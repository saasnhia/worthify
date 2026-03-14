import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface FactureRow {
  client_id: string
  montant_ttc: number
  montant_paye: number
  statut_paiement: string
  date_emission: string
  date_echeance: string
}

interface ClientStats {
  id: string
  user_id: string
  nom: string
  email: string | null
  telephone: string | null
  adresse: string | null
  siren: string | null
  notes: string | null
  created_at: string
  updated_at: string
  factures_ouvertes: number
  ca_12_mois: number
  retard_max_jours: number
  montant_impaye: number
}

/**
 * GET /api/clients
 * Returns clients with aggregated invoice statistics
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Non authentifie' }, { status: 401 })
    }

    // Fetch clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('nom', { ascending: true })

    if (clientsError) {
      return NextResponse.json({ success: false, error: 'Erreur clients: ' + clientsError.message }, { status: 500 })
    }

    if (!clients || clients.length === 0) {
      return NextResponse.json({ success: true, clients: [] })
    }

    // Fetch all factures_clients for aggregation
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)
    const cutoffDate = twelveMonthsAgo.toISOString().split('T')[0]

    const { data: factures, error: facturesError } = await supabase
      .from('factures_clients')
      .select('client_id, montant_ttc, montant_paye, statut_paiement, date_emission, date_echeance')
      .eq('user_id', user.id)

    if (facturesError) {
      return NextResponse.json({ success: false, error: 'Erreur factures: ' + facturesError.message }, { status: 500 })
    }

    const facturesList = (factures ?? []) as FactureRow[]
    const now = new Date()

    // Build a map of stats per client
    const statsMap = new Map<string, { ouvertes: number; ca12: number; retardMax: number; impaye: number }>()

    for (const f of facturesList) {
      let entry = statsMap.get(f.client_id)
      if (!entry) {
        entry = { ouvertes: 0, ca12: 0, retardMax: 0, impaye: 0 }
        statsMap.set(f.client_id, entry)
      }

      // Open invoices (not fully paid)
      if (f.statut_paiement !== 'payee') {
        entry.ouvertes += 1
        entry.impaye += (f.montant_ttc ?? 0) - (f.montant_paye ?? 0)
      }

      // CA 12 months
      if (f.date_emission >= cutoffDate) {
        entry.ca12 += f.montant_ttc ?? 0
      }

      // Max overdue days (only for overdue invoices)
      if (f.statut_paiement !== 'payee' && f.date_echeance) {
        const echeance = new Date(f.date_echeance)
        if (echeance < now) {
          const joursRetard = Math.floor((now.getTime() - echeance.getTime()) / (1000 * 60 * 60 * 24))
          if (joursRetard > entry.retardMax) {
            entry.retardMax = joursRetard
          }
        }
      }
    }

    // Enrich clients with stats
    const enriched: ClientStats[] = clients.map((c) => {
      const stats = statsMap.get(c.id)
      return {
        id: c.id,
        user_id: c.user_id,
        nom: c.nom,
        email: c.email,
        telephone: c.telephone,
        adresse: c.adresse,
        siren: c.siren,
        notes: c.notes,
        created_at: c.created_at,
        updated_at: c.updated_at,
        factures_ouvertes: stats?.ouvertes ?? 0,
        ca_12_mois: stats?.ca12 ?? 0,
        retard_max_jours: stats?.retardMax ?? 0,
        montant_impaye: stats?.impaye ?? 0,
      }
    })

    return NextResponse.json({ success: true, clients: enriched })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ success: false, error: 'Erreur serveur: ' + message }, { status: 500 })
  }
}

/**
 * POST /api/clients
 * Create a new client
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Non authentifie' }, { status: 401 })
    }

    const body = await req.json()
    const { nom, email, telephone, adresse, siren, notes } = body as {
      nom?: string
      email?: string
      telephone?: string
      adresse?: string
      siren?: string
      notes?: string
    }

    if (!nom || nom.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Le nom du client est requis' }, { status: 400 })
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        nom: nom.trim(),
        email: email?.trim() || null,
        telephone: telephone?.trim() || null,
        adresse: adresse?.trim() || null,
        siren: siren?.trim() || null,
        notes: notes?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: 'Erreur creation client: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, client }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ success: false, error: 'Erreur serveur: ' + message }, { status: 500 })
  }
}
