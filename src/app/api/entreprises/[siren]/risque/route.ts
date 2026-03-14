import { NextRequest, NextResponse } from 'next/server'
import { checkSolvabilite } from '@/lib/api/api-fiben'
import { requirePlanFeature, isAuthed } from '@/lib/auth/require-plan'

/**
 * GET /api/entreprises/[siren]/risque
 * Retourne le score de solvabilite d'un fournisseur
 * Requiert: plan Cabinet ou Entreprise
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siren: string }> }
) {
  try {
    const auth = await requirePlanFeature('pappers')
    if (!isAuthed(auth)) return auth

    const { siren } = await params

    const score = await checkSolvabilite(siren)

    return NextResponse.json({ success: true, score })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    const status = msg.includes('invalide') ? 400 : 500
    return NextResponse.json(
      { success: false, error: msg },
      { status }
    )
  }
}
