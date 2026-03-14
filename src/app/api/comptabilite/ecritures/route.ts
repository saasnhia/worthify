import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── Types locaux ────────────────────────────────────────────────────────────

interface EcritureRow {
  id: string
  ecriture_num: string
  journal_code: string
  date_ecriture: string
  date_piece: string | null
  piece_ref: string | null
  compte_num: string
  compte_lib: string | null
  debit: number
  credit: number
  libelle: string
  lettrage: string | null
  is_validated: boolean
  source: string
  created_at: string
}

const JOURNAL_LABELS: Record<string, string> = {
  VE: 'Ventes',
  AC: 'Achats',
  BQ: 'Banque',
  OD: 'Opérations Diverses',
  AN: 'À-Nouveau',
  SA: 'Salaires',
  CA: 'Caisse',
}

// ─── GET — Liste des écritures avec filtres ──────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const journal = searchParams.get('journal')
    const compte = searchParams.get('compte')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 500)
    const offset = (page - 1) * limit

    let query = supabase
      .from('ecritures_comptables')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('date_ecriture', { ascending: false })
      .order('ecriture_num', { ascending: false })

    if (journal) query = query.eq('journal_code', journal)
    if (compte) query = query.ilike('compte_num', `${compte}%`)
    if (dateFrom) query = query.gte('date_ecriture', dateFrom)
    if (dateTo) query = query.lte('date_ecriture', dateTo)
    if (search) query = query.or(`libelle.ilike.%${search}%,piece_ref.ilike.%${search}%,compte_lib.ilike.%${search}%`)

    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const ecritures = (data ?? []) as EcritureRow[]

    // Totaux pour la sélection courante
    const totalDebit = ecritures.reduce((s, e) => s + Number(e.debit), 0)
    const totalCredit = ecritures.reduce((s, e) => s + Number(e.credit), 0)

    return NextResponse.json({
      success: true,
      ecritures,
      total: count ?? 0,
      page,
      limit,
      totals: { debit: totalDebit, credit: totalCredit, solde: totalDebit - totalCredit },
      journal_labels: JOURNAL_LABELS,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// ─── POST — Créer une écriture (lot de lignes équilibrées) ──────────────────

interface LigneInput {
  compte_num: string
  compte_lib?: string
  debit: number
  credit: number
  libelle: string
}

interface CreateEcritureBody {
  journal_code: string
  date_ecriture: string
  piece_ref?: string
  lignes: LigneInput[]
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = (await request.json()) as CreateEcritureBody

    // Validation
    const validJournals = ['VE', 'AC', 'BQ', 'OD', 'AN', 'SA', 'CA']
    if (!validJournals.includes(body.journal_code)) {
      return NextResponse.json({ error: `Journal invalide: ${body.journal_code}` }, { status: 400 })
    }
    if (!body.date_ecriture) {
      return NextResponse.json({ error: 'Date requise' }, { status: 400 })
    }
    if (!body.lignes || body.lignes.length < 2) {
      return NextResponse.json({ error: 'Minimum 2 lignes pour une écriture équilibrée' }, { status: 400 })
    }

    // Vérifier équilibre débit/crédit
    const totalDebit = body.lignes.reduce((s, l) => s + (l.debit ?? 0), 0)
    const totalCredit = body.lignes.reduce((s, l) => s + (l.credit ?? 0), 0)
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { error: `Écriture déséquilibrée: débit=${totalDebit.toFixed(2)} ≠ crédit=${totalCredit.toFixed(2)}` },
        { status: 400 }
      )
    }

    // Générer numéro d'écriture
    const year = new Date(body.date_ecriture).getFullYear()
    const { count } = await supabase
      .from('ecritures_comptables')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .ilike('ecriture_num', `EC-${year}-%`)

    const seq = (count ?? 0) + 1
    const ecritureNum = `EC-${year}-${String(seq).padStart(4, '0')}`

    // Insérer toutes les lignes
    const rows = body.lignes.map((l) => ({
      user_id: user.id,
      ecriture_num: ecritureNum,
      journal_code: body.journal_code,
      date_ecriture: body.date_ecriture,
      piece_ref: body.piece_ref ?? null,
      compte_num: l.compte_num,
      compte_lib: l.compte_lib ?? null,
      debit: l.debit ?? 0,
      credit: l.credit ?? 0,
      libelle: l.libelle,
      source: 'manual',
    }))

    const { data: inserted, error: insertError } = await supabase
      .from('ecritures_comptables')
      .insert(rows)
      .select()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      ecriture_num: ecritureNum,
      lignes: inserted,
      count: inserted?.length ?? 0,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
