import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Génère automatiquement les écritures comptables pour une facture.
 *
 * Facture fournisseur (AC): 607/401 + TVA 44566
 * Facture client (VE): 411/707 + TVA 44571
 * Transaction bancaire (BQ): 512/... selon catégorie
 */

interface AutoEcritureFactureFournisseur {
  type: 'facture_fournisseur'
  facture_id: string
  user_id: string
  date: string
  fournisseur: string
  montant_ht: number
  montant_tva: number
  montant_ttc: number
  numero_facture?: string
  compte_charge?: string // défaut 607
}

interface AutoEcritureFactureClient {
  type: 'facture_client'
  facture_client_id: string
  user_id: string
  date: string
  client_nom: string
  montant_ht: number
  tva: number
  montant_ttc: number
  numero_facture?: string
  compte_produit?: string // défaut 707
}

interface AutoEcritureTransaction {
  type: 'transaction'
  transaction_id: string
  user_id: string
  date: string
  description: string
  amount: number
  tx_type: 'income' | 'expense'
}

type AutoEcritureInput = AutoEcritureFactureFournisseur | AutoEcritureFactureClient | AutoEcritureTransaction

async function getNextEcritureNum(supabase: SupabaseClient, userId: string, year: number): Promise<string> {
  const { count } = await supabase
    .from('ecritures_comptables')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .ilike('ecriture_num', `EC-${year}-%`)

  const seq = (count ?? 0) + 1
  return `EC-${year}-${String(seq).padStart(4, '0')}`
}

export async function generateAutoEcritures(
  supabase: SupabaseClient,
  input: AutoEcritureInput
): Promise<{ success: boolean; ecriture_num?: string; error?: string }> {
  try {
    const year = new Date(input.date).getFullYear()
    const ecritureNum = await getNextEcritureNum(supabase, input.user_id, year)

    const baseRow = {
      user_id: input.user_id,
      ecriture_num: ecritureNum,
      date_ecriture: input.date,
      source: 'auto_facture' as const,
    }

    let rows: Record<string, unknown>[]

    if (input.type === 'facture_fournisseur') {
      const compteCharge = input.compte_charge ?? '607'
      const pieceRef = input.numero_facture ?? null

      rows = [
        // Débit: Charge (607)
        {
          ...baseRow,
          journal_code: 'AC',
          piece_ref: pieceRef,
          compte_num: compteCharge,
          compte_lib: `Achats — ${input.fournisseur}`,
          debit: input.montant_ht,
          credit: 0,
          libelle: `Facture ${input.fournisseur}${pieceRef ? ` (${pieceRef})` : ''}`,
          facture_fournisseur_id: input.facture_id,
        },
        // Débit: TVA déductible (44566)
        ...(input.montant_tva > 0 ? [{
          ...baseRow,
          journal_code: 'AC',
          piece_ref: pieceRef,
          compte_num: '44566',
          compte_lib: 'TVA déductible sur ABS',
          debit: input.montant_tva,
          credit: 0,
          libelle: `TVA — Facture ${input.fournisseur}`,
          facture_fournisseur_id: input.facture_id,
        }] : []),
        // Crédit: Fournisseur (401)
        {
          ...baseRow,
          journal_code: 'AC',
          piece_ref: pieceRef,
          compte_num: '401',
          compte_lib: `Fournisseurs — ${input.fournisseur}`,
          debit: 0,
          credit: input.montant_ttc,
          libelle: `Facture ${input.fournisseur}${pieceRef ? ` (${pieceRef})` : ''}`,
          facture_fournisseur_id: input.facture_id,
        },
      ]
    } else if (input.type === 'facture_client') {
      const compteProduit = input.compte_produit ?? '707'
      const pieceRef = input.numero_facture ?? null

      rows = [
        // Débit: Client (411)
        {
          ...baseRow,
          journal_code: 'VE',
          piece_ref: pieceRef,
          compte_num: '411',
          compte_lib: `Clients — ${input.client_nom}`,
          debit: input.montant_ttc,
          credit: 0,
          libelle: `Facture client ${input.client_nom}${pieceRef ? ` (${pieceRef})` : ''}`,
          facture_client_id: input.facture_client_id,
        },
        // Crédit: TVA collectée (44571)
        ...(input.tva > 0 ? [{
          ...baseRow,
          journal_code: 'VE',
          piece_ref: pieceRef,
          compte_num: '44571',
          compte_lib: 'TVA collectée',
          debit: 0,
          credit: input.tva,
          libelle: `TVA — Facture ${input.client_nom}`,
          facture_client_id: input.facture_client_id,
        }] : []),
        // Crédit: Produit (707)
        {
          ...baseRow,
          journal_code: 'VE',
          piece_ref: pieceRef,
          compte_num: compteProduit,
          compte_lib: `Ventes — ${input.client_nom}`,
          debit: 0,
          credit: input.montant_ht,
          libelle: `Facture client ${input.client_nom}${pieceRef ? ` (${pieceRef})` : ''}`,
          facture_client_id: input.facture_client_id,
        },
      ]
    } else {
      // Transaction bancaire
      const isIncome = input.tx_type === 'income'
      rows = [
        // Banque (512)
        {
          ...baseRow,
          journal_code: 'BQ',
          source: 'auto_transaction',
          compte_num: '512',
          compte_lib: 'Banque',
          debit: isIncome ? input.amount : 0,
          credit: isIncome ? 0 : input.amount,
          libelle: input.description,
          transaction_id: input.transaction_id,
        },
        // Contrepartie
        {
          ...baseRow,
          journal_code: 'BQ',
          source: 'auto_transaction',
          compte_num: isIncome ? '707' : '607',
          compte_lib: isIncome ? 'Ventes' : 'Achats',
          debit: isIncome ? 0 : input.amount,
          credit: isIncome ? input.amount : 0,
          libelle: input.description,
          transaction_id: input.transaction_id,
        },
      ]
    }

    const { error } = await supabase.from('ecritures_comptables').insert(rows)

    if (error) return { success: false, error: error.message }
    return { success: true, ecriture_num: ecritureNum }
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' }
  }
}
