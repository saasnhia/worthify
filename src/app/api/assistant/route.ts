import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { createClient } from '@/lib/supabase/server'
import { checkAndConsumeTokens, getModelForPlan } from '@/lib/ai-quota'

function getMistralClient() {
  return new Mistral({ apiKey: process.env.MISTRAL_API_KEY ?? '' })
}

const SYSTEM_PROMPT = `Tu es un expert-comptable français spécialisé dans le Plan Comptable Général (PCG) et le BOFIP (Bulletin Officiel des Finances Publiques).

Tu réponds UNIQUEMENT sur des sujets comptables, fiscaux et financiers français.
Tu cites toujours le numéro de compte PCG concerné (ex: 401, 601, 7111...) et la référence BOFIP si applicable.
Tu proposes des écritures comptables complètes (débit/crédit) quand c'est pertinent, avec le format :
  Débit [compte] - [libellé] : [montant]
  Crédit [compte] - [libellé] : [montant]

Tu es précis, professionnel et pédagogue. Tu expliques toujours pourquoi tu choisis un compte particulier.
Si une question sort du domaine comptable/fiscal français, tu l'indiques poliment.`

interface MessageRow {
  role: string
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json() as { conversation_id: string; message: string }
    const { conversation_id, message } = body

    if (!conversation_id || !message?.trim()) {
      return NextResponse.json({ error: 'conversation_id et message requis' }, { status: 400 })
    }

    if (message.length > 10_000) {
      return NextResponse.json({ error: 'Message trop long (max 10 000 caractères)' }, { status: 400 })
    }

    // Get user plan
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    const plan = (profile?.plan as string) ?? 'basique'
    const model = getModelForPlan(plan)

    // Pre-check quota (estimate ~500 tokens for request)
    const quotaOk = await checkAndConsumeTokens(supabase, user.id, 500, plan, model, 'assistant')
    if (!quotaOk) {
      return NextResponse.json(
        { error: 'Quota mensuel de tokens IA atteint. Passez à un plan supérieur pour continuer.', upgrade: true },
        { status: 429 }
      )
    }

    // Verify conversation belongs to user
    const { data: conv } = await supabase
      .from('conversations_assistant')
      .select('id')
      .eq('id', conversation_id)
      .eq('user_id', user.id)
      .single()
    if (!conv) return NextResponse.json({ error: 'Conversation introuvable' }, { status: 404 })

    // Save user message
    await supabase.from('messages_assistant').insert({
      conversation_id,
      role: 'user',
      content: message,
    })

    // Load conversation history (last 20 messages)
    const { data: history } = await supabase
      .from('messages_assistant')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(20)

    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history ?? []).map((m: MessageRow) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    let fullResponse = ''
    const encoder = new TextEncoder()

    // Capture for closure
    const capturedSupabase = supabase
    const capturedUserId = user.id

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const mistral = getMistralClient()
          const stream = await mistral.chat.stream({
            model,
            maxTokens: 2048,
            messages,
          })

          let totalTokens = 0

          for await (const event of stream) {
            const choice = event.data.choices[0]
            const text = choice?.delta?.content ?? ''
            if (typeof text === 'string' && text) {
              fullResponse += text
              controller.enqueue(encoder.encode(text))
            }

            // Capture usage from the final chunk
            if (event.data.usage) {
              totalTokens = (event.data.usage.promptTokens ?? 0) + (event.data.usage.completionTokens ?? 0)
            }
          }

          // Log actual token delta (we pre-logged 500 estimate)
          if (totalTokens > 500) {
            void capturedSupabase.from('ai_usage').insert({
              user_id: capturedUserId,
              tokens_used: totalTokens - 500,
              model,
              endpoint: 'assistant',
            }).then(() => {})
          }

          // Save assistant message after stream
          await capturedSupabase.from('messages_assistant').insert({
            conversation_id,
            role: 'assistant',
            content: fullResponse,
          })

          // Update conversation timestamp
          const updatePayload: Record<string, string> = { updated_at: new Date().toISOString() }
          await capturedSupabase
            .from('conversations_assistant')
            .update(updatePayload)
            .eq('id', conversation_id)

        } catch (err) {
          controller.error(err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
