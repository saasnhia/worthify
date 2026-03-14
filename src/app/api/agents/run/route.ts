import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { createClient } from '@/lib/supabase/server'
import { checkAndConsumeTokens, getModelForPlan } from '@/lib/ai-quota'

function getMistralClient() {
  return new Mistral({ apiKey: process.env.MISTRAL_API_KEY ?? '' })
}

interface AgentRow {
  id: string
  user_id: string
  nom: string
  actions: string[]
  prompt_template: string | null
  statut: string
}

function applyVariables(template: string, context: Record<string, string>): string {
  return Object.entries(context).reduce(
    (text, [key, value]) => text.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
    template,
  )
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Get user plan
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    const plan = (profile?.plan as string) ?? 'basique'
    const model = getModelForPlan(plan)

    // Pre-check quota (estimate ~300 tokens for agent call)
    const quotaOk = await checkAndConsumeTokens(supabase, user.id, 300, plan, model, 'agent')
    if (!quotaOk) {
      return NextResponse.json(
        { success: false, error: 'Quota mensuel de tokens IA atteint. Passez à un plan supérieur pour continuer.', upgrade: true },
        { status: 429 }
      )
    }

    const body = await request.json() as { agent_id: string; context_data?: Record<string, string> }
    const { agent_id, context_data = {} } = body

    // Load agent
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agent_id)
      .eq('user_id', user.id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent introuvable' }, { status: 404 })
    }

    const agentRow = agent as AgentRow

    // Build prompt
    const promptTemplate = agentRow.prompt_template || 'Effectuez l\'action demandée pour {client_nom} concernant la facture {facture_numero}.'
    const finalPrompt = applyVariables(promptTemplate, {
      ...context_data,
      date: new Date().toLocaleDateString('fr-FR'),
    })

    // Insert log (running)
    const { data: logData } = await supabase.from('agent_logs').insert({
      agent_id,
      statut: 'running',
      input_data: { prompt: finalPrompt, context: context_data },
    }).select('id').single()
    const logId = (logData as { id: string } | null)?.id

    // Call Mistral
    const client = getMistralClient()
    const response = await client.chat.complete({
      model,
      maxTokens: 1024,
      messages: [
        { role: 'system', content: 'Tu es un assistant comptable expert. Tu réponds de manière concise et professionnelle en français.' },
        { role: 'user', content: finalPrompt },
      ],
    })

    const responseText = response.choices?.[0]?.message?.content ?? ''

    // Log actual token usage (adjust the pre-estimated 300)
    const actualTokens = (response.usage?.promptTokens ?? 0) + (response.usage?.completionTokens ?? 0)
    if (actualTokens > 300) {
      void supabase.from('ai_usage').insert({
        user_id: user.id,
        tokens_used: actualTokens - 300,
        model,
        endpoint: 'agent',
      }).then(() => {})
    }

    // Update log (success)
    if (logId) {
      void supabase.from('agent_logs').update({
        statut: 'success',
        output_data: { result: typeof responseText === 'string' ? responseText : '', tokens: actualTokens },
      }).eq('id', logId).then(() => {})
    }

    return NextResponse.json({ success: true, output: typeof responseText === 'string' ? responseText : '' })

  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
