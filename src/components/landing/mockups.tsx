// SVG Mockups — interfaces Worthifast réalistes (dark theme)
// Utilisés dans WorkflowSection et FeaturesSection

const BG = '#0F1117'
const CARD = '#161B22'
const BORDER = '#2D333B'
const TEXT = '#F1F5F9'
const MUTED = '#8B949E'
const GREEN = '#00A878'
const GOLD = '#F59E0B'
const ORANGE = '#F97316'
const RED = '#EF4444'

// ─── 1. OCR — Upload + factures traitées ──────────────────
export function OcrMockup({ mini = false }: { mini?: boolean }) {
  const h = mini ? 180 : 250
  return (
    <svg viewBox={`0 0 400 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height={h} rx="8" fill={BG} />

      {/* Upload zone */}
      <rect x="16" y="12" width="130" height={mini ? 60 : 80} rx="6" fill={CARD} stroke={BORDER} strokeWidth="1" strokeDasharray="4 2" />
      <text x="81" y={mini ? 36 : 42} textAnchor="middle" fill={MUTED} fontSize="9" fontFamily="system-ui">Glissez votre facture</text>
      <text x="81" y={mini ? 50 : 58} textAnchor="middle" fill={MUTED} fontSize="7" fontFamily="system-ui">PDF, JPG, PNG</text>

      {/* Factures traitées */}
      <text x="160" y="24" fill={TEXT} fontSize="9" fontWeight="600" fontFamily="system-ui">Factures traitées</text>

      {/* Row 1 */}
      <rect x="160" y="32" width="224" height={mini ? 28 : 34} rx="4" fill={CARD} />
      <text x="168" y={mini ? 44 : 48} fill={TEXT} fontSize="8" fontFamily="system-ui">TOTAL ENERGIES SA</text>
      <text x="168" y={mini ? 54 : 58} fill={MUTED} fontSize="7" fontFamily="system-ui">401000 · Fournisseurs</text>
      <text x="310" y={mini ? 44 : 48} fill={TEXT} fontSize="8" fontWeight="600" fontFamily="system-ui">1 240,00 €</text>
      <rect x="310" y={mini ? 49 : 52} width="60" height="12" rx="3" fill={GREEN} fillOpacity="0.15" />
      <text x="340" y={mini ? 58 : 61} textAnchor="middle" fill={GREEN} fontSize="6" fontWeight="600" fontFamily="system-ui">Extrait en 30s</text>

      {/* Row 2 */}
      <rect x="160" y={mini ? 64 : 72} width="224" height={mini ? 28 : 34} rx="4" fill={CARD} />
      <text x="168" y={mini ? 76 : 88} fill={TEXT} fontSize="8" fontFamily="system-ui">OVH SAS</text>
      <text x="168" y={mini ? 86 : 98} fill={MUTED} fontSize="7" fontFamily="system-ui">613500 · Locations mob.</text>
      <text x="310" y={mini ? 76 : 88} fill={TEXT} fontSize="8" fontWeight="600" fontFamily="system-ui">59,99 €</text>
      <rect x="310" y={mini ? 81 : 92} width="60" height="12" rx="3" fill={GREEN} fillOpacity="0.15" />
      <text x="340" y={mini ? 90 : 101} textAnchor="middle" fill={GREEN} fontSize="6" fontWeight="600" fontFamily="system-ui">Extrait en 30s</text>

      {!mini && (
        <>
          {/* Row 3 */}
          <rect x="160" y="112" width="224" height="34" rx="4" fill={CARD} />
          <text x="168" y="128" fill={TEXT} fontSize="8" fontFamily="system-ui">BUREAU VALLÉE</text>
          <text x="168" y="138" fill={MUTED} fontSize="7" fontFamily="system-ui">606300 · Fournitures</text>
          <text x="310" y="128" fill={TEXT} fontSize="8" fontWeight="600" fontFamily="system-ui">87,40 €</text>
          <rect x="310" y="132" width="60" height="12" rx="3" fill={GREEN} fillOpacity="0.15" />
          <text x="340" y="141" textAnchor="middle" fill={GREEN} fontSize="6" fontWeight="600" fontFamily="system-ui">Extrait en 30s</text>
        </>
      )}

      {/* Stats */}
      <rect x="16" y={mini ? 80 : 100} width="130" height={mini ? 50 : 46} rx="4" fill={CARD} />
      <text x="81" y={mini ? 98 : 118} textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="700" fontFamily="system-ui">95%</text>
      <text x="81" y={mini ? 112 : 132} textAnchor="middle" fill={MUTED} fontSize="7" fontFamily="system-ui">Précision OCR</text>

      {!mini && (
        <>
          <rect x="16" y="152" width="130" height="46" rx="4" fill={CARD} />
          <text x="81" y="178" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="700" fontFamily="system-ui">3 factures</text>
          <text x="81" y="190" textAnchor="middle" fill={MUTED} fontSize="7" fontFamily="system-ui">traitées aujourd&apos;hui</text>
        </>
      )}
    </svg>
  )
}

// ─── 2. RAPPROCHEMENT — Table transactions bancaires ──────
export function RapprochementMockup({ mini = false }: { mini?: boolean }) {
  const h = mini ? 180 : 250
  const rows = [
    { date: '18/03', label: 'VIR TOTAL ENERGIES', montant: '-1 240,00', compte: '401000', status: 'matched' },
    { date: '17/03', label: 'PRLV OVH CLOUD', montant: '-59,99', compte: '613500', status: 'matched' },
    { date: '15/03', label: 'CB BUREAU VALLÉE', montant: '-87,40', compte: '606300', status: 'pending' },
    { date: '14/03', label: 'VIR CLIENT DUPONT', montant: '+3 200,00', compte: '411000', status: 'matched' },
  ]
  const visibleRows = mini ? rows.slice(0, 3) : rows

  return (
    <svg viewBox={`0 0 400 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height={h} rx="8" fill={BG} />

      {/* Header */}
      <text x="16" y="24" fill={TEXT} fontSize="10" fontWeight="600" fontFamily="system-ui">Rapprochement bancaire</text>
      <rect x="300" y="12" width="84" height="18" rx="4" fill={GREEN} fillOpacity="0.15" />
      <text x="342" y="24" textAnchor="middle" fill={GREEN} fontSize="7" fontWeight="600" fontFamily="system-ui">3/4 rapprochées</text>

      {/* Table header */}
      <text x="16" y="46" fill={MUTED} fontSize="7" fontFamily="system-ui">Date</text>
      <text x="60" y="46" fill={MUTED} fontSize="7" fontFamily="system-ui">Libellé</text>
      <text x="210" y="46" fill={MUTED} fontSize="7" fontFamily="system-ui">Montant</text>
      <text x="285" y="46" fill={MUTED} fontSize="7" fontFamily="system-ui">Compte</text>
      <text x="345" y="46" fill={MUTED} fontSize="7" fontFamily="system-ui">Statut</text>
      <line x1="16" y1="52" x2="384" y2="52" stroke={BORDER} strokeWidth="0.5" />

      {/* Rows */}
      {visibleRows.map((row, i) => {
        const y = 66 + i * (mini ? 36 : 42)
        const isNeg = row.montant.startsWith('-')
        const statusColor = row.status === 'matched' ? GREEN : ORANGE
        const statusText = row.status === 'matched' ? '✓ Rapproché' : '⏳ En attente'
        return (
          <g key={i}>
            <rect x="12" y={y - 12} width="376" height={mini ? 30 : 36} rx="4" fill={CARD} />
            <text x="20" y={y + 2} fill={MUTED} fontSize="8" fontFamily="system-ui">{row.date}</text>
            <text x="60" y={y + 2} fill={TEXT} fontSize="8" fontFamily="system-ui">{row.label}</text>
            <text x="210" y={y + 2} fill={isNeg ? RED : GREEN} fontSize="8" fontWeight="600" fontFamily="system-ui">{row.montant} €</text>
            <text x="285" y={y + 2} fill={MUTED} fontSize="7" fontFamily="monospace">{row.compte}</text>
            <rect x="335" y={y - 8} width="48" height="14" rx="3" fill={statusColor} fillOpacity="0.15" />
            <text x="359" y={y + 1} textAnchor="middle" fill={statusColor} fontSize="6" fontWeight="600" fontFamily="system-ui">{statusText}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── 3. TVA CA3 — Formulaire pré-rempli ───────────────────
export function TvaMockup({ mini = false }: { mini?: boolean }) {
  const h = mini ? 180 : 250
  return (
    <svg viewBox={`0 0 400 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height={h} rx="8" fill={BG} />

      {/* Header */}
      <rect x="16" y="12" width="368" height="30" rx="4" fill={CARD} />
      <text x="24" y="31" fill={TEXT} fontSize="10" fontWeight="600" fontFamily="system-ui">Déclaration TVA CA3 — Mars 2026</text>
      <rect x="280" y="18" width="96" height="16" rx="4" fill={GREEN} fillOpacity="0.15" />
      <text x="328" y="30" textAnchor="middle" fill={GREEN} fontSize="7" fontWeight="600" fontFamily="system-ui">Pré-rempli auto</text>

      {/* Cases */}
      {[
        { id: '0206', label: 'Opérations imposables (HT)', value: '45 280,00', y: 52 },
        { id: '0105', label: 'Autres opér. non imposables', value: '0,00', y: mini ? 80 : 84 },
        { id: '08', label: 'TVA brute (20%)', value: '9 056,00', y: mini ? 108 : 116 },
        { id: '20', label: 'TVA déductible / immobilis.', value: '1 420,00', y: mini ? 136 : 148 },
      ].map((c, i) => (
        <g key={i}>
          <rect x="16" y={c.y} width="368" height={mini ? 24 : 26} rx="3" fill={CARD} />
          <rect x="20" y={c.y + 3} width="28" height={mini ? 18 : 20} rx="3" fill="#1B3A6B" fillOpacity="0.3" />
          <text x="34" y={c.y + (mini ? 16 : 17)} textAnchor="middle" fill="#6B9BD2" fontSize="7" fontWeight="600" fontFamily="monospace">{c.id}</text>
          <text x="56" y={c.y + (mini ? 16 : 17)} fill={TEXT} fontSize="8" fontFamily="system-ui">{c.label}</text>
          <rect x="310" y={c.y + 3} width="66" height={mini ? 18 : 20} rx="3" fill={GREEN} fillOpacity="0.1" stroke={GREEN} strokeOpacity="0.3" strokeWidth="0.5" />
          <text x="343" y={c.y + (mini ? 16 : 17)} textAnchor="middle" fill={GREEN} fontSize="8" fontWeight="600" fontFamily="system-ui">{c.value}</text>
        </g>
      ))}

      {!mini && (
        <>
          <line x1="16" y1="182" x2="384" y2="182" stroke={BORDER} strokeWidth="0.5" />
          <rect x="16" y="190" width="368" height="30" rx="4" fill={GREEN} fillOpacity="0.08" />
          <text x="24" y="210" fill={TEXT} fontSize="9" fontWeight="600" fontFamily="system-ui">TVA nette à payer</text>
          <text x="360" y="210" textAnchor="end" fill={GREEN} fontSize="12" fontWeight="700" fontFamily="system-ui">7 636,00 €</text>
          <rect x="16" y="228" width="368" height="16" rx="3" fill={CARD} />
          <text x="200" y="240" textAnchor="middle" fill={MUTED} fontSize="7" fontFamily="system-ui">Calculé depuis 142 écritures PCG · Exporter PDF conforme</text>
        </>
      )}
    </svg>
  )
}

// ─── 4. PORTAIL — Espace client ───────────────────────────
export function PortailMockup({ mini = false }: { mini?: boolean }) {
  const h = mini ? 180 : 250
  return (
    <svg viewBox={`0 0 400 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height={h} rx="8" fill={BG} />

      {/* Sidebar */}
      <rect x="0" y="0" width="100" height={h} rx="8" fill={CARD} />
      <text x="14" y="26" fill={TEXT} fontSize="8" fontWeight="600" fontFamily="system-ui">SCI Moreau</text>
      <text x="14" y="38" fill={MUTED} fontSize="7" fontFamily="system-ui">Espace client</text>
      <line x1="8" y1="46" x2="92" y2="46" stroke={BORDER} strokeWidth="0.5" />
      {['Documents', 'Messages', 'Profil'].map((item, i) => (
        <g key={item}>
          <rect x="8" y={54 + i * 26} width="84" height="20" rx="3" fill={i === 0 ? GREEN : 'transparent'} fillOpacity={i === 0 ? 0.15 : 1} />
          <text x="16" y={68 + i * 26} fill={i === 0 ? GREEN : MUTED} fontSize="8" fontFamily="system-ui">{item}</text>
          {i === 0 && (
            <>
              <rect x="72" y={56 + i * 26} width="16" height="12" rx="6" fill={GOLD} />
              <text x="80" y={65 + i * 26} textAnchor="middle" fill="#000" fontSize="7" fontWeight="700" fontFamily="system-ui">3</text>
            </>
          )}
        </g>
      ))}

      {/* Main content */}
      <text x="112" y="26" fill={TEXT} fontSize="9" fontWeight="600" fontFamily="system-ui">Documents déposés</text>

      {[
        { name: 'Facture EDF mars 2026.pdf', date: '20/03', tag: 'Nouveau' },
        { name: 'Relevé BNP février.csv', date: '15/03', tag: '' },
        { name: 'Note de frais Q1.pdf', date: '12/03', tag: 'Nouveau' },
      ].map((doc, i) => (
        <g key={i}>
          <rect x="108" y={36 + i * (mini ? 30 : 36)} width="276" height={mini ? 26 : 30} rx="4" fill={CARD} />
          <text x="120" y={mini ? 52 + i * 30 : 55 + i * 36} fill={TEXT} fontSize="8" fontFamily="system-ui">{doc.name}</text>
          <text x="300" y={mini ? 52 + i * 30 : 55 + i * 36} fill={MUTED} fontSize="7" fontFamily="system-ui">{doc.date}</text>
          {doc.tag && (
            <>
              <rect x="340" y={mini ? 42 + i * 30 : 44 + i * 36} width="38" height="14" rx="3" fill={GOLD} fillOpacity="0.15" />
              <text x="359" y={mini ? 52 + i * 30 : 55 + i * 36} textAnchor="middle" fill={GOLD} fontSize="6" fontWeight="600" fontFamily="system-ui">{doc.tag}</text>
            </>
          )}
        </g>
      ))}

      {!mini && (
        <>
          <line x1="108" y1="150" x2="384" y2="150" stroke={BORDER} strokeWidth="0.5" />
          <text x="112" y="170" fill={TEXT} fontSize="9" fontWeight="600" fontFamily="system-ui">Messages</text>
          <rect x="108" y="178" width="276" height="56" rx="4" fill={CARD} />
          <text x="120" y="196" fill={GREEN} fontSize="8" fontWeight="600" fontFamily="system-ui">Cabinet Fontaine</text>
          <text x="120" y="210" fill={MUTED} fontSize="7" fontFamily="system-ui">Merci pour les documents. La TVA Q1 est calculée.</text>
          <text x="120" y="224" fill="#4A5568" fontSize="7" fontFamily="system-ui">Il y a 2 heures</text>
        </>
      )}
    </svg>
  )
}

// ─── 5. E-INVOICING — Facture Factur-X ────────────────────
export function EinvoicingMockup({ mini = false }: { mini?: boolean }) {
  const h = mini ? 180 : 250
  return (
    <svg viewBox={`0 0 400 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height={h} rx="8" fill={BG} />

      {/* Facture header */}
      <rect x="16" y="12" width="368" height={mini ? 40 : 50} rx="4" fill={CARD} />
      <text x="24" y={mini ? 28 : 32} fill={TEXT} fontSize="10" fontWeight="700" fontFamily="system-ui">FACTURE FAC-2026-0047</text>
      <text x="24" y={mini ? 42 : 48} fill={MUTED} fontSize="7" fontFamily="system-ui">SCI Moreau → Client Dupont SARL · 18/03/2026</text>
      <rect x="290" y="16" width="86" height="18" rx="4" fill={GREEN} fillOpacity="0.15" stroke={GREEN} strokeOpacity="0.4" strokeWidth="0.5" />
      <text x="333" y="29" textAnchor="middle" fill={GREEN} fontSize="7" fontWeight="700" fontFamily="system-ui">Factur-X EN16931 ✓</text>

      {/* Champs obligatoires */}
      <text x="16" y={mini ? 66 : 76} fill={MUTED} fontSize="7" fontFamily="system-ui">Champs obligatoires e-invoicing</text>

      {[
        { label: 'SIRET émetteur', value: '123 456 789 00012', ok: true },
        { label: 'SIRET destinataire', value: '987 654 321 00034', ok: true },
        { label: 'Numéro TVA intracom.', value: 'FR 12 345678901', ok: true },
        { label: 'Code devise', value: 'EUR', ok: true },
      ].map((field, i) => (
        <g key={i}>
          <rect x="16" y={(mini ? 72 : 82) + i * (mini ? 22 : 26)} width="180" height={mini ? 18 : 22} rx="3" fill={CARD} />
          <text x="24" y={(mini ? 84 : 97) + i * (mini ? 22 : 26)} fill={MUTED} fontSize="7" fontFamily="system-ui">{field.label}</text>
          <rect x="200" y={(mini ? 72 : 82) + i * (mini ? 22 : 26)} width="130" height={mini ? 18 : 22} rx="3" fill={GREEN} fillOpacity="0.08" stroke={GREEN} strokeOpacity="0.2" strokeWidth="0.5" />
          <text x="210" y={(mini ? 84 : 97) + i * (mini ? 22 : 26)} fill={GREEN} fontSize="7" fontWeight="500" fontFamily="monospace">{field.value}</text>
          <text x="370" y={(mini ? 84 : 97) + i * (mini ? 22 : 26)} fill={GREEN} fontSize="8" fontFamily="system-ui">✓</text>
        </g>
      ))}

      {!mini && (
        <>
          <line x1="16" y1="192" x2="384" y2="192" stroke={BORDER} strokeWidth="0.5" />
          <rect x="16" y="200" width="368" height="36" rx="4" fill={CARD} />
          <text x="24" y="218" fill={TEXT} fontSize="8" fontFamily="system-ui">Total TTC</text>
          <text x="360" y="218" textAnchor="end" fill={TEXT} fontSize="14" fontWeight="700" fontFamily="system-ui">3 840,00 €</text>
          <text x="24" y="230" fill={MUTED} fontSize="7" fontFamily="system-ui">HT 3 200,00 · TVA 20% 640,00</text>
        </>
      )}
    </svg>
  )
}
