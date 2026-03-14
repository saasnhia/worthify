import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enrichirFournisseur } from '@/lib/api/api-entreprise'

/**
 * GET /api/entreprises/[siren]
 * Enrichit les donnees d'un fournisseur via son SIREN
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siren: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Non authentifie' }, { status: 401 })
    }

    const { siren } = await params

    const entreprise = await enrichirFournisseur(siren)

    return NextResponse.json({ success: true, entreprise })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    const status = msg.includes('invalide') ? 400 : 500
    return NextResponse.json(
      { success: false, error: msg },
      { status }
    )
  }
}
