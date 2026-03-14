import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/banking/status
 * Returns aggregated banking status (mock data for now — will be replaced by Bridge/Powens).
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Fetch real counts from DB where available
  const [bankRes, facturesRes] = await Promise.all([
    supabase
      .from('comptes_bancaires')
      .select('id, solde_actuel')
      .eq('user_id', user.id),
    supabase
      .from('factures_clients')
      .select('id')
      .eq('user_id', user.id)
      .in('statut_paiement', ['en_attente', 'en_retard']),
  ])

  const accounts = bankRes.data?.length ?? 0
  const balance = bankRes.data?.reduce((sum, a) => sum + (Number(a.solde_actuel) || 0), 0) ?? 0
  const pendingInvoices = facturesRes.data?.length ?? 0

  // Reconciliation rate from rapprochements
  const { count: totalRappr } = await supabase
    .from('rapprochements_factures')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: validRappr } = await supabase
    .from('rapprochements_factures')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('statut', 'valide')

  const reconciliationRate = totalRappr && totalRappr > 0
    ? Math.round((validRappr ?? 0) / totalRappr * 100) / 100
    : 0

  return NextResponse.json({
    accounts,
    balance,
    pending_invoices: pendingInvoices,
    reconciliation_rate: reconciliationRate,
    connected: accounts > 0,
  })
}
