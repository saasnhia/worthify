import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── Types locaux ────────────────────────────────────────────────────────────

interface EcritureRow {
  id: string
  ecriture_num: string
  journal_code: string
  date_ecriture: string
  piece_ref: string | null
  compte_num: string
  compte_lib: string | null
  debit: number
  credit: number
  libelle: string
  lettrage: string | null
}

interface CompteAggrege {
  compte_num: string
  compte_lib: string
  classe: number
  total_debit: number
  total_credit: number
  solde: number
  nb_ecritures: number
}

// ─── GET — Grand livre (agrégé par compte ou détail d'un compte) ─────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const compte = searchParams.get('compte') // Si présent → détail du compte
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const classeFilter = searchParams.get('classe')

    // Requête de base
    let query = supabase
      .from('ecritures_comptables')
      .select('id, ecriture_num, journal_code, date_ecriture, piece_ref, compte_num, compte_lib, debit, credit, libelle, lettrage')
      .eq('user_id', user.id)
      .order('date_ecriture', { ascending: true })
      .order('ecriture_num', { ascending: true })

    if (dateFrom) query = query.gte('date_ecriture', dateFrom)
    if (dateTo) query = query.lte('date_ecriture', dateTo)

    // Mode détail : écritures d'un seul compte
    if (compte) {
      query = query.eq('compte_num', compte)
      const { data, error } = await query

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      const ecritures = (data ?? []) as EcritureRow[]
      let soldeCumul = 0
      const lignes = ecritures.map(e => {
        soldeCumul += Number(e.debit) - Number(e.credit)
        return { ...e, solde_cumule: soldeCumul }
      })

      const totalDebit = ecritures.reduce((s, e) => s + Number(e.debit), 0)
      const totalCredit = ecritures.reduce((s, e) => s + Number(e.credit), 0)

      return NextResponse.json({
        success: true,
        mode: 'detail',
        compte_num: compte,
        compte_lib: ecritures[0]?.compte_lib ?? compte,
        lignes,
        totals: { debit: totalDebit, credit: totalCredit, solde: totalDebit - totalCredit },
      })
    }

    // Mode agrégé : tous les comptes avec totaux
    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const ecritures = (data ?? []) as EcritureRow[]

    // Agréger par compte
    const comptesMap = new Map<string, CompteAggrege>()
    for (const e of ecritures) {
      const existing = comptesMap.get(e.compte_num)
      if (existing) {
        existing.total_debit += Number(e.debit)
        existing.total_credit += Number(e.credit)
        existing.solde = existing.total_debit - existing.total_credit
        existing.nb_ecritures++
      } else {
        comptesMap.set(e.compte_num, {
          compte_num: e.compte_num,
          compte_lib: e.compte_lib ?? e.compte_num,
          classe: parseInt(e.compte_num[0]) || 0,
          total_debit: Number(e.debit),
          total_credit: Number(e.credit),
          solde: Number(e.debit) - Number(e.credit),
          nb_ecritures: 1,
        })
      }
    }

    let comptes = Array.from(comptesMap.values()).sort((a, b) => a.compte_num.localeCompare(b.compte_num))

    if (classeFilter) {
      const cl = parseInt(classeFilter)
      comptes = comptes.filter(c => c.classe === cl)
    }

    const grandTotalDebit = comptes.reduce((s, c) => s + c.total_debit, 0)
    const grandTotalCredit = comptes.reduce((s, c) => s + c.total_credit, 0)

    return NextResponse.json({
      success: true,
      mode: 'agrege',
      comptes,
      totals: {
        debit: grandTotalDebit,
        credit: grandTotalCredit,
        solde: grandTotalDebit - grandTotalCredit,
        nb_comptes: comptes.length,
      },
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
