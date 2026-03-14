import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  'https://jwaqsszcaicikhgmfcwc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3YXFzc3pjYWljaWtoZ21mY3djIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDA1NjA3NCwiZXhwIjoyMDg1NjMyMDc0fQ.k9kEhr2Le4FyLyy_s770dcP55DEM46H_HqGzbnOzjFc'
)

const uid = 'ea81a899-f85b-4b61-b931-6f45cb532094' // harounchikh71@gmail.com

async function seed() {
  // Clean existing
  const { error: delErr } = await admin.from('ecritures_comptables').delete().eq('user_id', uid)
  if (delErr) console.log('Delete warning:', delErr.message)

  const rows = []
  let seq = 1
  const num = () => `EC-2026-${String(seq++).padStart(4, '0')}`

  // AN — Ouverture
  const an = num()
  rows.push(
    { user_id: uid, ecriture_num: an, journal_code: 'AN', date_ecriture: '2026-01-01', compte_num: '512', compte_lib: 'Banque', debit: 85000, credit: 0, libelle: 'Solde ouverture banque', source: 'manual' },
    { user_id: uid, ecriture_num: an, journal_code: 'AN', date_ecriture: '2026-01-01', compte_num: '411', compte_lib: 'Clients', debit: 42000, credit: 0, libelle: 'Créances clients ouverture', source: 'manual' },
    { user_id: uid, ecriture_num: an, journal_code: 'AN', date_ecriture: '2026-01-01', compte_num: '401', compte_lib: 'Fournisseurs', debit: 0, credit: 18000, libelle: 'Dettes fournisseurs ouverture', source: 'manual' },
    { user_id: uid, ecriture_num: an, journal_code: 'AN', date_ecriture: '2026-01-01', compte_num: '101', compte_lib: 'Capital social', debit: 0, credit: 50000, libelle: 'Capital social', source: 'manual' },
    { user_id: uid, ecriture_num: an, journal_code: 'AN', date_ecriture: '2026-01-01', compte_num: '110', compte_lib: 'Report à nouveau', debit: 0, credit: 59000, libelle: 'Report à nouveau créditeur', source: 'manual' },
  )

  // AC — Achats (Jan-Mars)
  const fourns = [
    { nom: 'Office Depot', ht: 1200, tva: 240, ttc: 1440, compte: '606' },
    { nom: 'Sage Compta', ht: 890, tva: 178, ttc: 1068, compte: '613' },
    { nom: 'Orange Pro', ht: 89, tva: 17.8, ttc: 106.8, compte: '626' },
    { nom: 'EDF Pro', ht: 340, tva: 68, ttc: 408, compte: '606' },
    { nom: 'MAIF Assurance', ht: 450, tva: 0, ttc: 450, compte: '616' },
  ]
  for (const m of ['01', '02', '03']) {
    for (const f of fourns) {
      const d = String(5 + Math.floor(Math.random() * 20)).padStart(2, '0')
      const n = num()
      const date = `2026-${m}-${d}`
      const ref = `FA-${f.nom.substring(0, 3).toUpperCase()}-${m}`
      rows.push(
        { user_id: uid, ecriture_num: n, journal_code: 'AC', date_ecriture: date, piece_ref: ref, compte_num: f.compte, compte_lib: `Achats ${f.nom}`, debit: f.ht, credit: 0, libelle: `Facture ${f.nom}`, source: 'auto_facture' },
      )
      if (f.tva > 0) {
        rows.push(
          { user_id: uid, ecriture_num: n, journal_code: 'AC', date_ecriture: date, piece_ref: ref, compte_num: '44566', compte_lib: 'TVA déductible', debit: f.tva, credit: 0, libelle: `TVA ${f.nom}`, source: 'auto_facture' },
        )
      }
      rows.push(
        { user_id: uid, ecriture_num: n, journal_code: 'AC', date_ecriture: date, piece_ref: ref, compte_num: '401', compte_lib: `Fournisseurs ${f.nom}`, debit: 0, credit: f.ttc, libelle: `Facture ${f.nom}`, source: 'auto_facture' },
      )
    }
  }

  // VE — Ventes (Jan-Mars)
  const cls = [
    { nom: 'Boulangerie Martin', ht: 2400, tva: 480, ttc: 2880 },
    { nom: 'Restaurant Le Gourmet', ht: 3600, tva: 720, ttc: 4320 },
    { nom: 'Pharmacie Dupont', ht: 1800, tva: 360, ttc: 2160 },
    { nom: 'Garage Durand', ht: 1500, tva: 300, ttc: 1800 },
    { nom: 'SCI Moreau Immo', ht: 4200, tva: 840, ttc: 5040 },
  ]
  for (const m of ['01', '02', '03']) {
    for (const c of cls) {
      const d = String(1 + Math.floor(Math.random() * 25)).padStart(2, '0')
      const n = num()
      const date = `2026-${m}-${d}`
      const ref = `FC-${m}-${c.nom.substring(0, 3).toUpperCase()}`
      rows.push(
        { user_id: uid, ecriture_num: n, journal_code: 'VE', date_ecriture: date, piece_ref: ref, compte_num: '411', compte_lib: `Clients ${c.nom}`, debit: c.ttc, credit: 0, libelle: `Honoraires ${c.nom}`, source: 'auto_facture' },
        { user_id: uid, ecriture_num: n, journal_code: 'VE', date_ecriture: date, piece_ref: ref, compte_num: '44571', compte_lib: 'TVA collectée', debit: 0, credit: c.tva, libelle: `TVA ${c.nom}`, source: 'auto_facture' },
        { user_id: uid, ecriture_num: n, journal_code: 'VE', date_ecriture: date, piece_ref: ref, compte_num: '706', compte_lib: 'Prestations de services', debit: 0, credit: c.ht, libelle: `Honoraires ${c.nom}`, source: 'auto_facture' },
      )
    }
  }

  // BQ — Encaissements clients + Paiements fournisseurs
  for (const m of ['01', '02', '03']) {
    for (const c of cls) {
      const d = String(15 + Math.floor(Math.random() * 13)).padStart(2, '0')
      const n = num()
      rows.push(
        { user_id: uid, ecriture_num: n, journal_code: 'BQ', date_ecriture: `2026-${m}-${d}`, compte_num: '512', compte_lib: 'Banque', debit: c.ttc, credit: 0, libelle: `Enc. ${c.nom}`, source: 'auto_transaction' },
        { user_id: uid, ecriture_num: n, journal_code: 'BQ', date_ecriture: `2026-${m}-${d}`, compte_num: '411', compte_lib: `Clients ${c.nom}`, debit: 0, credit: c.ttc, libelle: `Enc. ${c.nom}`, source: 'auto_transaction' },
      )
    }
    for (const f of fourns) {
      const d = String(20 + Math.floor(Math.random() * 8)).padStart(2, '0')
      const n = num()
      rows.push(
        { user_id: uid, ecriture_num: n, journal_code: 'BQ', date_ecriture: `2026-${m}-${d}`, compte_num: '401', compte_lib: `Fournisseurs ${f.nom}`, debit: f.ttc, credit: 0, libelle: `Pmt ${f.nom}`, source: 'auto_transaction' },
        { user_id: uid, ecriture_num: n, journal_code: 'BQ', date_ecriture: `2026-${m}-${d}`, compte_num: '512', compte_lib: 'Banque', debit: 0, credit: f.ttc, libelle: `Pmt ${f.nom}`, source: 'auto_transaction' },
      )
    }
  }

  // SA — Salaires (Jan-Mars)
  for (const m of ['01', '02', '03']) {
    const n = num()
    rows.push(
      { user_id: uid, ecriture_num: n, journal_code: 'SA', date_ecriture: `2026-${m}-28`, compte_num: '641', compte_lib: 'Rémunérations du personnel', debit: 8500, credit: 0, libelle: `Salaires bruts ${m}/2026`, source: 'manual' },
      { user_id: uid, ecriture_num: n, journal_code: 'SA', date_ecriture: `2026-${m}-28`, compte_num: '645', compte_lib: 'Charges sociales', debit: 3800, credit: 0, libelle: `Charges sociales ${m}/2026`, source: 'manual' },
      { user_id: uid, ecriture_num: n, journal_code: 'SA', date_ecriture: `2026-${m}-28`, compte_num: '421', compte_lib: 'Personnel — Rémunérations dues', debit: 0, credit: 6200, libelle: `Net à payer ${m}/2026`, source: 'manual' },
      { user_id: uid, ecriture_num: n, journal_code: 'SA', date_ecriture: `2026-${m}-28`, compte_num: '431', compte_lib: 'Sécurité sociale', debit: 0, credit: 3400, libelle: `URSSAF ${m}/2026`, source: 'manual' },
      { user_id: uid, ecriture_num: n, journal_code: 'SA', date_ecriture: `2026-${m}-28`, compte_num: '4421', compte_lib: 'Prélèvements à la source', debit: 0, credit: 2700, libelle: `PAS ${m}/2026`, source: 'manual' },
    )
  }

  // OD — TVA déclaration
  const od = num()
  rows.push(
    { user_id: uid, ecriture_num: od, journal_code: 'OD', date_ecriture: '2026-01-31', compte_num: '44571', compte_lib: 'TVA collectée', debit: 2700, credit: 0, libelle: 'Déclaration TVA janvier — collectée', source: 'manual' },
    { user_id: uid, ecriture_num: od, journal_code: 'OD', date_ecriture: '2026-01-31', compte_num: '44566', compte_lib: 'TVA déductible', debit: 0, credit: 503.8, libelle: 'Déclaration TVA janvier — déductible', source: 'manual' },
    { user_id: uid, ecriture_num: od, journal_code: 'OD', date_ecriture: '2026-01-31', compte_num: '44551', compte_lib: 'TVA à décaisser', debit: 0, credit: 2196.2, libelle: 'TVA nette à payer janvier', source: 'manual' },
  )

  console.log('Total rows:', rows.length)

  // Insert in batches
  let inserted = 0
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50)
    const { error } = await admin.from('ecritures_comptables').insert(batch)
    if (error) {
      console.error(`BATCH ${Math.floor(i / 50) + 1} FAILED:`, error.message, error.details)
      return
    }
    inserted += batch.length
    console.log(`Batch ${Math.floor(i / 50) + 1}: ${batch.length} rows OK`)
  }

  // Verify
  const { count } = await admin.from('ecritures_comptables').select('id', { count: 'exact', head: true }).eq('user_id', uid)
  console.log(`\nSEED COMPLETE: ${inserted} inserted, ${count} in DB`)
}

seed().catch(e => console.error('Fatal:', e))
