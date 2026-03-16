/**
 * Seed Screenshots Demo — harounchikh71@gmail.com
 * Complète les données existantes pour 8 screenshots landing.
 * Ajoute : dossiers supplémentaires, écritures comptables (journal PCG),
 * dossier_statuts, relances_historique + relances_config.
 *
 * Run: npx tsx scripts/seed/seed-screenshots.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://jwaqsszcaicikhgmfcwc.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function log(msg: string) { console.log(msg) }
function err(msg: string) { console.error('❌', msg) }

// ─── Get user_id ──────────────────────────────────────────────────────────────

async function getUserId(): Promise<string> {
  log('\n📍 Récupération user_id harounchikh71@gmail.com...')
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) throw new Error(`listUsers: ${error.message}`)
  const user = data.users.find(u => u.email === 'harounchikh71@gmail.com')
  if (!user) throw new Error('Utilisateur harounchikh71@gmail.com introuvable')
  log(`  ✅ user_id = ${user.id}`)
  return user.id
}

// ─── 1. Dossiers supplémentaires ──────────────────────────────────────────────

async function seedDossiers(userId: string) {
  log('\n📁 1. Dossiers clients (3 supplémentaires)...')

  const dossiers = [
    { nom: 'Dupont Bâtiment SARL', siren: '523456789', secteur: 'BTP', regime_tva: 'réel normal', email: 'contact@dupont-btp.fr', notes: 'BTP — CA 450 000€', actif: true },
    { nom: 'Restaurant Le Gourmet', siren: '745678901', secteur: 'Restauration', regime_tva: 'réel simplifié', email: 'contact@legourmet.fr', notes: 'Alimentaire — CA 89 000€', actif: true },
    { nom: 'Cabinet Dr Martin', siren: '178901234', secteur: 'Santé', regime_tva: 'réel normal', email: 'secretariat@drmartin.fr', notes: 'Médecine — CA 210 000€', actif: true },
  ].map(d => ({ ...d, user_id: userId }))

  const { data, error: dossierErr } = await supabase.from('dossiers').insert(dossiers).select('id, nom')
  if (dossierErr) err(`dossiers: ${dossierErr.message}`)
  else log(`  ✅ ${data?.length} dossiers insérés`)

  // Seed dossier_statuts for all dossiers
  if (data) {
    const statuts = data.map((d, i) => ({
      dossier_id: d.id,
      tva_status: i === 0 ? 'a_jour' : i === 1 ? 'en_retard' : 'a_jour',
      tva_prochaine_echeance: '2026-04-15',
      nb_factures_attente: [3, 1, 0][i],
      taux_rapprochement: [87.5, 62.0, 95.0][i],
      ca_annuel_estime: [450000, 89000, 210000][i],
    }))

    const { error: statutErr } = await supabase.from('dossier_statuts').upsert(statuts, { onConflict: 'dossier_id' })
    if (statutErr) err(`dossier_statuts: ${statutErr.message}`)
    else log(`  ✅ ${statuts.length} dossier_statuts insérés`)
  }

  return data
}

// ─── 2. Écritures comptables (Journal PCG — 60 lignes) ───────────────────────

async function seedEcritures(userId: string) {
  log('\n📒 2. Écritures comptables (journal PCG, 60 lignes)...')

  // Clean existing
  const { error: delErr } = await supabase.from('ecritures_comptables').delete().eq('user_id', userId)
  if (delErr) log(`  ⚠ cleanup: ${delErr.message}`)

  let num = 1
  const ecritures: {
    user_id: string
    ecriture_num: string
    journal_code: string
    date_ecriture: string
    compte_num: string
    compte_lib: string
    debit: number
    credit: number
    libelle: string
    piece_ref: string
    is_validated: boolean
    source: string
  }[] = []

  function addPair(journal: string, date: string, piece: string, libelle: string, compteD: string, compteLibD: string, compteC: string, compteLibC: string, montant: number, validated: boolean) {
    const n = String(num++).padStart(4, '0')
    ecritures.push({
      user_id: userId,
      ecriture_num: `EC-2026-${n}`,
      journal_code: journal,
      date_ecriture: date,
      compte_num: compteD,
      compte_lib: compteLibD,
      debit: montant,
      credit: 0,
      libelle,
      piece_ref: piece,
      is_validated: validated,
      source: 'manual',
    })
    const n2 = String(num++).padStart(4, '0')
    ecritures.push({
      user_id: userId,
      ecriture_num: `EC-2026-${n2}`,
      journal_code: journal,
      date_ecriture: date,
      compte_num: compteC,
      compte_lib: compteLibC,
      debit: 0,
      credit: montant,
      libelle,
      piece_ref: piece,
      is_validated: validated,
      source: 'manual',
    })
  }

  // Journal VE (Ventes) — 8 écritures (16 lignes)
  addPair('VE', '2026-01-05', 'FAC-001', 'Facture DUPONT BATIMENT — Fondations', '411000', 'Clients', '707000', 'Ventes marchandises', 57600, true)
  addPair('VE', '2026-01-08', 'FAC-002', 'Facture DUPONT — Rénovation façade', '411000', 'Clients', '707000', 'Ventes marchandises', 38400, true)
  addPair('VE', '2026-01-10', 'FAC-006', 'Facture TECH INNOV — App mobile', '411000', 'Clients', '706000', 'Prestations de services', 33600, true)
  addPair('VE', '2026-01-12', 'FAC-011', 'Facture BOULANGERIE MARTIN', '411000', 'Clients', '707000', 'Ventes marchandises', 5040, true)
  addPair('VE', '2026-01-15', 'FAC-016', 'Facture SCI LES LILAS — Gestion', '411000', 'Clients', '706000', 'Prestations de services', 5760, true)
  addPair('VE', '2026-01-18', 'FAC-021', 'Facture TRANSPORT LECLERC', '411000', 'Clients', '706000', 'Prestations de services', 50400, true)
  addPair('VE', '2026-01-20', 'FAC-026', 'Facture CABINET MEDICAL', '411000', 'Clients', '706000', 'Prestations de services', 10200, true)
  addPair('VE', '2026-01-25', 'FAC-036', 'Facture INDUSTRIE RENARD — Pièces alu', '411000', 'Clients', '707000', 'Ventes marchandises', 222000, true)

  // Journal AC (Achats) — 6 écritures (12 lignes)
  addPair('AC', '2026-01-04', 'BM-2026-0142', 'Achat BETON MORTAR SAS', '607000', 'Achats marchandises', '401000', 'Fournisseurs', 22200, true)
  addPair('AC', '2026-01-06', 'TE-INV-88432', 'Achat TOTAL ENERGIES carburant', '606100', 'Fournitures non stockables', '401000', 'Fournisseurs', 3840, true)
  addPair('AC', '2026-01-11', 'INV-FR-67821', 'Achat AWS hébergement cloud', '613500', 'Locations mobilières', '401000', 'Fournisseurs', 3840, true)
  addPair('AC', '2026-01-15', 'OBS-260115-FR', 'Achat ORANGE BUSINESS télécom', '626000', 'Frais postaux et télécom', '401000', 'Fournisseurs', 1068, true)
  addPair('AC', '2026-01-22', 'KLT-FAC-9921', 'Location KILOUTOU engins chantier', '613500', 'Locations mobilières', '401000', 'Fournisseurs', 6240, true)
  addPair('AC', '2026-01-25', 'BV-2026-F-087', 'Achat BUREAU VALLEE fournitures', '606400', 'Fournitures administratives', '401000', 'Fournisseurs', 408, true)

  // Journal BQ (Banque) — 6 écritures (12 lignes)
  addPair('BQ', '2026-01-02', 'RLV-BNP-01', 'Encaissement client MAISON ARCHITECTES', '512000', 'Banque BNP', '411000', 'Clients', 48000, true)
  addPair('BQ', '2026-01-07', 'RLV-BNP-02', 'Paiement salaires janvier', '421000', 'Personnel rémunérations', '512000', 'Banque BNP', 22000, true)
  addPair('BQ', '2026-01-09', 'RLV-BNP-03', 'Encaissement VILLE DE PARIS', '512000', 'Banque BNP', '411000', 'Clients', 12500, true)
  addPair('BQ', '2026-01-15', 'RLV-BNP-04', 'Paiement assurance ALLIANZ', '616000', 'Primes d\'assurance', '512000', 'Banque BNP', 2400, true)
  addPair('BQ', '2026-01-20', 'RLV-BNP-05', 'Paiement carburant TOTAL', '606100', 'Fournitures non stockables', '512000', 'Banque BNP', 3200, true)
  addPair('BQ', '2026-01-25', 'RLV-BNP-06', 'Paiement loyer atelier', '613200', 'Locations immobilières', '512000', 'Banque BNP', 4500, true)

  // Journal OD (Opérations diverses) — 5 écritures (10 lignes)
  addPair('OD', '2026-01-31', 'OD-TVA-01', 'TVA collectée janvier 20%', '445710', 'TVA collectée', '445800', 'TVA à payer', 7500, false)
  addPair('OD', '2026-01-31', 'OD-TVA-02', 'TVA déductible janvier 20%', '445660', 'TVA déductible', '445710', 'TVA collectée', 3000, false)
  addPair('OD', '2026-01-31', 'OD-AMO-01', 'Dotation amortissement véhicule', '681100', 'Dotations aux amortissements', '281500', 'Amortissements matériel transport', 850, false)
  addPair('OD', '2026-01-31', 'OD-PRO-01', 'Provision créances douteuses LECLERC', '681740', 'Dotations provisions clients', '491000', 'Provisions clients douteux', 5500, false)
  addPair('OD', '2026-02-01', 'OD-EXT-01', 'Extourne provision client LECLERC', '491000', 'Provisions clients douteux', '681740', 'Dotations provisions clients', 5500, false)

  const { data, error: ecErr } = await supabase.from('ecritures_comptables').insert(ecritures).select('id')
  if (ecErr) err(`ecritures_comptables: ${ecErr.message}`)
  else log(`  ✅ ${data?.length} écritures comptables insérées`)
}

// ─── 3. Relances config + historique ──────────────────────────────────────────

async function seedRelances(userId: string) {
  log('\n📨 3. Relances (config + historique)...')

  // Config
  const { error: cfgErr } = await supabase.from('relances_config').upsert({
    user_id: userId,
    actif: true,
    delai_j1: 7,
    delai_j2: 15,
    delai_j3: 30,
    ton: 'cordial',
    signature: 'Cabinet Moreau & Associés — Service Recouvrement',
  }, { onConflict: 'user_id' })
  if (cfgErr) err(`relances_config: ${cfgErr.message}`)
  else log('  ✅ relances_config configurée')

  // Get factures_clients en_retard to link relances
  const { data: retardFactures, error: retErr } = await supabase
    .from('factures_clients')
    .select('id, client_id, numero_facture, montant_ttc')
    .eq('user_id', userId)
    .eq('statut_paiement', 'en_retard')
    .limit(4)

  if (retErr || !retardFactures?.length) {
    log(`  ⚠ Pas de factures en_retard trouvées (${retErr?.message ?? 'aucune'})`)
    return
  }

  // Clean existing relances_historique
  const { error: delRel } = await supabase.from('relances_historique').delete().eq('user_id', userId)
  if (delRel) log(`  ⚠ cleanup relances_historique: ${delRel.message}`)

  const relances = retardFactures.flatMap((f, i) => {
    const items: {
      user_id: string
      facture_id: string
      niveau: number
      email_destinataire: string
      contenu: string
      statut: string
      created_at: string
    }[] = []

    // Niveau 1 (J+7)
    items.push({
      user_id: userId,
      facture_id: f.id,
      niveau: 1,
      email_destinataire: `client${i}@example.fr`,
      contenu: `Bonjour,\n\nNous vous rappelons que la facture ${f.numero_facture} d'un montant de ${f.montant_ttc} € TTC est arrivée à échéance. Nous vous remercions de bien vouloir procéder au règlement dans les meilleurs délais.\n\nCordialement,\nCabinet Moreau & Associés`,
      statut: 'envoye',
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    })

    // Niveau 2 (J+15) pour les 3 premiers
    if (i < 3) {
      items.push({
        user_id: userId,
        facture_id: f.id,
        niveau: 2,
        email_destinataire: `client${i}@example.fr`,
        contenu: `Bonjour,\n\nMalgré notre précédent rappel, la facture ${f.numero_facture} (${f.montant_ttc} € TTC) demeure impayée. Sans règlement sous 8 jours, nous serons contraints d'appliquer des pénalités de retard conformément à nos CGV.\n\nCordialement,\nCabinet Moreau & Associés`,
        statut: 'envoye',
        created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
      })
    }

    // Niveau 3 (J+30) pour les 2 premiers
    if (i < 2) {
      items.push({
        user_id: userId,
        facture_id: f.id,
        niveau: 3,
        email_destinataire: `client${i}@example.fr`,
        contenu: `Bonjour,\n\nLa facture ${f.numero_facture} (${f.montant_ttc} € TTC) reste impayée malgré nos relances précédentes. Nous vous informons que sans règlement sous 48h, le dossier sera transmis à notre service contentieux.\n\nService Recouvrement\nCabinet Moreau & Associés`,
        statut: 'envoye',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      })
    }

    return items
  })

  const { data: relData, error: relErr } = await supabase.from('relances_historique').insert(relances).select('id')
  if (relErr) err(`relances_historique: ${relErr.message}`)
  else log(`  ✅ ${relData?.length} relances insérées`)
}

// ─── 4. Portail client accès ──────────────────────────────────────────────────

async function seedPortail(userId: string) {
  log('\n🌐 4. Portail client (accès + documents + messages)...')

  // Get 3 clients
  const { data: clients, error: clErr } = await supabase
    .from('clients')
    .select('id, nom, email')
    .eq('user_id', userId)
    .limit(3)

  if (clErr || !clients?.length) {
    log(`  ⚠ Pas de clients trouvés (${clErr?.message ?? 'aucun'})`)
    return
  }

  // Clean existing
  const { error: delP } = await supabase.from('portail_acces').delete().eq('cabinet_user_id', userId)
  if (delP) log(`  ⚠ cleanup: ${delP.message}`)

  const portails = clients.map(c => ({
    cabinet_user_id: userId,
    client_id: c.id,
    client_email: c.email ?? `${c.nom.toLowerCase().replace(/\s/g, '.')}@email.fr`,
    client_nom: c.nom,
    actif: true,
  }))

  const { data: pData, error: pErr } = await supabase.from('portail_acces').insert(portails).select('id, client_nom')
  if (pErr) err(`portail_acces: ${pErr.message}`)
  else log(`  ✅ ${pData?.length} accès portail créés`)

  if (!pData?.length) return

  // Documents pour chaque portail
  const docs = pData.flatMap((p, i) => [
    { portail_id: p.id, nom: 'Bilan comptable 2025.pdf', type: 'bilan', uploaded_by: 'cabinet', statut: 'valide' },
    { portail_id: p.id, nom: `Factures Q1 2026 — ${p.client_nom}.zip`, type: 'facture', uploaded_by: 'cabinet', statut: 'valide' },
    ...(i === 0 ? [{ portail_id: p.id, nom: 'Justificatif TVA intracommunautaire.pdf', type: 'justificatif', uploaded_by: 'client', statut: 'en_attente' }] : []),
  ])

  const { data: dData, error: dErr } = await supabase.from('portail_documents').insert(docs).select('id')
  if (dErr) err(`portail_documents: ${dErr.message}`)
  else log(`  ✅ ${dData?.length} documents portail insérés`)

  // Messages
  const msgs = pData.flatMap(p => [
    { portail_id: p.id, expediteur: 'cabinet', message: `Bonjour, votre bilan 2025 est disponible dans l'espace documents. N'hésitez pas si vous avez des questions.`, lu: true },
    { portail_id: p.id, expediteur: 'client', message: `Merci ! Pourriez-vous aussi ajouter le détail des charges sociales ?`, lu: false },
  ])

  const { data: mData, error: mErr } = await supabase.from('portail_messages').insert(msgs).select('id')
  if (mErr) err(`portail_messages: ${mErr.message}`)
  else log(`  ✅ ${mData?.length} messages portail insérés`)
}

// ─── 5. Anomalies (pour rapprochement screenshot) ─────────────────────────────

async function seedAnomalies(userId: string) {
  log('\n🔍 5. Anomalies détectées (4)...')

  const anomalies = [
    { type: 'doublon_transaction', severite: 'warning', description: 'Transaction en double : VIR RECU MAISON ARCHITECTES — 48 000 € le 02/01 et 03/01', montant: 48000, statut: 'ouverte' },
    { type: 'facture_sans_transaction', severite: 'critical', description: 'Facture FAC-2026-024 TRANSPORT LECLERC (66 000 € TTC) — aucun encaissement correspondant', montant: 66000, statut: 'ouverte' },
    { type: 'ecart_montant', severite: 'warning', description: 'Écart de 120 € entre facture BM-2026-0142 (22 200 € TTC) et transaction VIR (22 080 €)', montant: 22200, montant_attendu: 22080, ecart: 120, statut: 'ouverte' },
    { type: 'montant_eleve', severite: 'info', description: 'Transaction inhabituelle : VIR RECU 15 200 € — référence inconnue REF 8821', montant: 15200, statut: 'ouverte' },
  ].map(a => ({ ...a, user_id: userId }))

  const { data, error: anErr } = await supabase.from('anomalies_detectees').insert(anomalies).select('id')
  if (anErr) err(`anomalies_detectees: ${anErr.message}`)
  else log(`  ✅ ${data?.length} anomalies insérées`)
}

// ─── 6. Verify ────────────────────────────────────────────────────────────────

async function verify(userId: string) {
  log('\n✅ Vérification finale...')

  const tables = [
    'dossiers', 'dossier_statuts', 'clients', 'factures_clients', 'factures',
    'declarations_tva', 'transactions', 'rapprochements', 'comptes_bancaires',
    'alerts', 'ecritures_comptables', 'relances_config', 'relances_historique',
    'portail_acces', 'portail_documents', 'portail_messages',
    'anomalies_detectees', 'import_history',
  ]

  for (const table of tables) {
    // Some tables have user_id, others have cabinet_user_id
    const userCol = table === 'portail_acces' ? 'cabinet_user_id'
      : table === 'dossier_statuts' ? null
      : table === 'portail_documents' || table === 'portail_messages' ? null
      : 'user_id'

    if (!userCol) {
      const { count, error: cErr } = await supabase.from(table).select('*', { count: 'exact', head: true })
      log(`  ${table}: ${cErr ? `⚠ ${cErr.message}` : count}`)
    } else {
      const { data, error: cErr } = await supabase.from(table).select('id').eq(userCol, userId)
      log(`  ${table}: ${cErr ? `⚠ ${cErr.message}` : data?.length}`)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log('🚀 ════════════════════════════════════════════')
  log('🚀  Seed Screenshots — harounchikh71@gmail.com')
  log('🚀 ════════════════════════════════════════════')

  try {
    const userId = await getUserId()

    await seedDossiers(userId)
    await seedEcritures(userId)
    await seedRelances(userId)
    await seedPortail(userId)
    await seedAnomalies(userId)
    await verify(userId)

    log('\n🎉 Seed screenshots terminé !')
    log('→ Prêt pour screenshots landing !')

  } catch (e) {
    err(`Erreur fatale: ${e}`)
    process.exit(1)
  }
}

main()
