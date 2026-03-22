// ═══════════════════════════════════════════════════════════
// SVG Mockups — Fidèles à l'interface réelle Worthifast
// Full: 800×500 (avec sidebar) · Mini: 400×250 (contenu seul)
// ═══════════════════════════════════════════════════════════

const SB = '#0F172A'    // sidebar bg
const CB = '#F8FAFC'    // content bg
const WH = '#FFFFFF'    // card bg
const BD = '#E2E8F0'    // border
const TH = '#F1F5F9'    // table header
const TP = '#1E293B'    // text primary
const TM = '#64748B'    // text muted
const TS = '#94A3B8'    // text subtle
const GR = '#00A878'    // green
const GL = '#F59E0B'    // gold
const OR = '#F97316'    // orange
const RD = '#EF4444'    // red
const BL = '#3B82F6'    // blue
const FT = "system-ui,-apple-system,sans-serif"

// ─── Shared: App Sidebar ──────────────────────────────────

type NavEntry = { type: 'item' | 'section'; label: string }

const NAV: NavEntry[] = [
  { type: 'item', label: 'Tableau de bord' },
  { type: 'item', label: 'Assistant IA' },
  { type: 'item', label: 'Mes Agents' },
  { type: 'section', label: 'COMPTABILITÉ' },
  { type: 'item', label: 'Factures' },
  { type: 'item', label: 'Banques' },
  { type: 'item', label: 'TVA' },
  { type: 'item', label: 'Rapprochement' },
  { type: 'section', label: 'CABINET' },
  { type: 'item', label: 'Portail Clients' },
  { type: 'item', label: 'E-invoicing' },
  { type: 'section', label: 'PARAMÈTRES' },
  { type: 'item', label: 'Général' },
]

function AppSidebar({ active }: { active: string }) {
  let y = 52
  return (
    <g>
      <rect x="0" y="0" width="180" height="500" fill={SB} />
      {/* Logo */}
      <text x="16" y="28" fill={GR} fontSize="18" fontWeight="800" fontFamily="Georgia,serif">W</text>
      <text x="34" y="28" fill="#FFFFFF" fontSize="13" fontWeight="600" fontFamily={FT}>Worthifast</text>
      <line x1="12" y1="42" x2="168" y2="42" stroke="#FFFFFF" strokeOpacity="0.06" />
      {/* Nav */}
      {NAV.map((entry, i) => {
        const currentY = y
        if (entry.type === 'section') {
          y += 22
          return (
            <text key={i} x="16" y={currentY + 12} fill={TS} fontSize="9" fontWeight="600" fontFamily={FT} letterSpacing="0.5">
              {entry.label}
            </text>
          )
        }
        const isActive = entry.label === active
        y += 28
        return (
          <g key={i}>
            {isActive && <rect x="8" y={currentY - 2} width="164" height="24" rx="6" fill={GR} fillOpacity="0.15" />}
            <text x="20" y={currentY + 14} fill={isActive ? GR : TS} fontSize="12" fontWeight={isActive ? '600' : '400'} fontFamily={FT}>
              {entry.label}
            </text>
          </g>
        )
      })}
      {/* Footer */}
      <line x1="12" y1="446" x2="168" y2="446" stroke="#FFFFFF" strokeOpacity="0.06" />
      <circle cx="28" cy="470" r="12" fill={GR} fillOpacity="0.2" />
      <text x="28" y="474" textAnchor="middle" fill={GR} fontSize="10" fontWeight="600" fontFamily={FT}>MF</text>
      <text x="48" y="466" fill="#FFFFFF" fontSize="11" fontWeight="500" fontFamily={FT}>Marie Fontaine</text>
      <text x="48" y="480" fill={TS} fontSize="9" fontFamily={FT}>Plan Cabinet</text>
    </g>
  )
}

// ─── Shared: KPI Card ─────────────────────────────────────

function KpiCard({ x, y, w, h, value, label, sub, color }: {
  x: number; y: number; w: number; h: number
  value: string; label: string; sub: string; color: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={WH} stroke={BD} strokeWidth="0.5" />
      <rect x={x} y={y} width="3" height={h} rx="1" fill={color} />
      <text x={x + 14} y={y + 18} fill={TM} fontSize="10" fontFamily={FT}>{label}</text>
      <text x={x + 14} y={y + 42} fill={TP} fontSize="20" fontWeight="700" fontFamily={FT}>{value}</text>
      <text x={x + 14} y={y + 58} fill={TS} fontSize="9" fontFamily={FT}>{sub}</text>
    </g>
  )
}

// ═══════════════════════════════════════════════════════════
// 1. DASHBOARD
// ═══════════════════════════════════════════════════════════

export function DashboardMockup({ mini = false }: { mini?: boolean }) {
  if (mini) return <DashboardMini />
  const cx = 196 // content x start
  const cw = 140 // card width (4 cards = 4×140 + 3×8 = 584)
  return (
    <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="800" height="500" fill={CB} />
      <AppSidebar active="Tableau de bord" />

      {/* Banner */}
      <rect x="192" y="8" width="596" height="28" rx="6" fill={GR} fillOpacity="0.08" stroke={GR} strokeOpacity="0.2" strokeWidth="0.5" />
      <text x="204" y="27" fill={GR} fontSize="10" fontWeight="500" fontFamily={FT}>✅ Worthifast est conforme e-invoicing 2026 (Factur-X / EN16931)</text>

      {/* Header */}
      <text x={cx} y="62" fill={TP} fontSize="18" fontWeight="700" fontFamily={FT}>Tableau de bord</text>
      <rect x="696" y="44" width="84" height="26" rx="6" fill={WH} stroke={BD} strokeWidth="0.5" />
      <text x="714" y="62" fill={TM} fontSize="10" fontFamily={FT}>Export FEC</text>

      {/* KPI row 1 */}
      <KpiCard x={cx}       y={80} w={cw} h={68} value="12" label="Dossiers actifs" sub="12 dossier(s) en cours" color={BL} />
      <KpiCard x={cx+148}   y={80} w={cw} h={68} value="3" label="Factures en retard" sub="3 client(s) en retard" color={RD} />
      <KpiCard x={cx+296}   y={80} w={cw} h={68} value="8 036 €" label="TVA du mois" sub="CA3 mars pré-remplie" color={GL} />
      <KpiCard x={cx+444}   y={80} w={cw} h={68} value="5" label="Alertes actives" sub="dont 2 critique(s)" color="#8B5CF6" />

      {/* Trésorerie */}
      <text x={cx} y="176" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>Trésorerie</text>
      <KpiCard x={cx}       y={184} w={cw} h={68} value="127 000 €" label="Solde bancaire" sub="Dernier relevé importé" color={GR} />
      <KpiCard x={cx+148}   y={184} w={cw} h={68} value="309 072 €" label="BFR estimé" sub="Encours clients − fourn." color={GL} />
      <KpiCard x={cx+296}   y={184} w={cw} h={68} value="41 200 €" label="Prévisionnel J+30" sub="Basé sur encours actuels" color={BL} />
      <KpiCard x={cx+444}   y={184} w={cw} h={68} value="38 750 €" label="Moy. mois précédent" sub="Moyenne glissante 3 mois" color={GR} />

      {/* Performance */}
      <text x={cx} y="280" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>Compte de résultat (YTD)</text>
      <KpiCard x={cx}       y={288} w={cw} h={68} value="38 420 €" label="CA HT actuel" sub="Factures clients 2026" color={GR} />
      <KpiCard x={cx+148}   y={288} w={cw} h={68} value="12 340 €" label="Charges HT" sub="Factures fournisseurs" color={RD} />
      <KpiCard x={cx+296}   y={288} w={cw} h={68} value="67,8 %" label="Marge brute" sub="CA − Charges" color={BL} />
      <KpiCard x={cx+444}   y={288} w={cw} h={68} value="198 400 €" label="CA N-1" sub="Année précédente" color={GR} />

      {/* Activity chart placeholder */}
      <rect x={cx} y="374" width="584" height="110" rx="8" fill={WH} stroke={BD} strokeWidth="0.5" />
      <text x={cx + 14} y="396" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>ACTIVITÉ CETTE SEMAINE</text>
      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d, i) => {
        const bx = cx + 30 + i * 78
        const bh = [60, 45, 72, 35, 50, 20, 10][i]
        return (
          <g key={d}>
            <rect x={bx} y={470 - bh} width="40" height={bh} rx="4" fill={GR} fillOpacity="0.6" />
            <text x={bx + 20} y="486" textAnchor="middle" fill={TM} fontSize="9" fontFamily={FT}>{d}</text>
          </g>
        )
      })}
    </svg>
  )
}

function DashboardMini() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height="250" rx="6" fill={CB} />
      {/* Header */}
      <rect x="0" y="0" width="400" height="32" rx="6" fill={WH} />
      <text x="14" y="21" fill={TP} fontSize="12" fontWeight="700" fontFamily={FT}>Tableau de bord</text>
      <rect x="310" y="7" width="78" height="18" rx="4" fill={GR} fillOpacity="0.1" />
      <text x="326" y="20" fill={GR} fontSize="8" fontWeight="500" fontFamily={FT}>Export FEC</text>

      {/* 4 KPI cards */}
      {[
        { v: '12', l: 'Dossiers', c: BL },
        { v: '3', l: 'En retard', c: RD },
        { v: '8 036€', l: 'TVA', c: GL },
        { v: '5', l: 'Alertes', c: '#8B5CF6' },
      ].map((k, i) => (
        <g key={i}>
          <rect x={12 + i * 96} y={40} width={88} height={50} rx="6" fill={WH} stroke={BD} strokeWidth="0.5" />
          <rect x={12 + i * 96} y={40} width="2" height={50} rx="1" fill={k.c} />
          <text x={24 + i * 96} y={58} fill={TM} fontSize="8" fontFamily={FT}>{k.l}</text>
          <text x={24 + i * 96} y={78} fill={TP} fontSize="16" fontWeight="700" fontFamily={FT}>{k.v}</text>
        </g>
      ))}

      {/* Trésorerie row */}
      <text x="14" y="112" fill={TP} fontSize="10" fontWeight="600" fontFamily={FT}>Trésorerie</text>
      {[
        { v: '127 000 €', l: 'Solde bancaire', c: GR },
        { v: '309 072 €', l: 'BFR estimé', c: GL },
      ].map((k, i) => (
        <g key={i}>
          <rect x={12 + i * 192} y={120} width={182} height={44} rx="6" fill={WH} stroke={BD} strokeWidth="0.5" />
          <rect x={12 + i * 192} y={120} width="2" height={44} rx="1" fill={k.c} />
          <text x={24 + i * 192} y={138} fill={TM} fontSize="8" fontFamily={FT}>{k.l}</text>
          <text x={24 + i * 192} y={155} fill={TP} fontSize="14" fontWeight="700" fontFamily={FT}>{k.v}</text>
        </g>
      ))}

      {/* Activity mini */}
      <rect x="12" y="174" width="376" height="66" rx="6" fill={WH} stroke={BD} strokeWidth="0.5" />
      <text x="22" y="192" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>ACTIVITÉ SEMAINE</text>
      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => {
        const bh = [30, 22, 36, 18, 25, 10, 5][i]
        return (
          <g key={`${d}${i}`}>
            <rect x={22 + i * 50} y={228 - bh} width={28} height={bh} rx="3" fill={GR} fillOpacity="0.5" />
            <text x={36 + i * 50} y="238" textAnchor="middle" fill={TM} fontSize="7" fontFamily={FT}>{d}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
// 1b. JOURNAL COMPTABLE (mini only — pour bento features)
// ═══════════════════════════════════════════════════════════

const JOURNAL_ROWS = [
  { date: '01/04', journal: 'AC', compte: '401TOTALENE', libelle: 'Facture TOTAL ENERGIES', debit: '', credit: '1 240,00' },
  { date: '01/04', journal: 'AC', compte: '44566000', libelle: 'TVA déductible 20%', debit: '248,00', credit: '' },
  { date: '01/04', journal: 'AC', compte: '51200000', libelle: 'Banque CIC Pro', debit: '1 488,00', credit: '' },
  { date: '02/04', journal: 'VE', compte: '411001SCI', libelle: 'SCI LES PINS', debit: '', credit: '2 880,00' },
  { date: '02/04', journal: 'VE', compte: '70600000', libelle: 'Prestations services', debit: '2 400,00', credit: '' },
  { date: '02/04', journal: 'VE', compte: '44571000', libelle: 'TVA collectée 20%', debit: '480,00', credit: '' },
]

export function JournalMockup() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height="250" rx="6" fill={CB} />
      {/* Header */}
      <rect x="0" y="0" width="400" height="30" rx="6" fill={WH} />
      <text x="14" y="20" fill={TP} fontSize="11" fontWeight="700" fontFamily={FT}>Journal — Avril 2026</text>
      <rect x="280" y="6" width="108" height="18" rx="4" fill={TH} stroke={BD} strokeWidth="0.5" />
      <text x="292" y="19" fill={TM} fontSize="8" fontFamily={FT}>Tous les journaux ▾</text>

      {/* Table header */}
      <rect x="8" y="36" width="384" height="20" rx="4" fill={TH} />
      <text x="14" y="50" fill={TM} fontSize="7" fontWeight="600" fontFamily={FT}>Date</text>
      <text x="52" y="50" fill={TM} fontSize="7" fontWeight="600" fontFamily={FT}>Jnl</text>
      <text x="76" y="50" fill={TM} fontSize="7" fontWeight="600" fontFamily={FT}>Compte</text>
      <text x="154" y="50" fill={TM} fontSize="7" fontWeight="600" fontFamily={FT}>Libellé</text>
      <text x="296" y="50" fill={TM} fontSize="7" fontWeight="600" fontFamily={FT}>Débit</text>
      <text x="352" y="50" fill={TM} fontSize="7" fontWeight="600" fontFamily={FT}>Crédit</text>

      {/* Rows */}
      {JOURNAL_ROWS.map((row, i) => {
        const ry = 60 + i * 26
        const jColor = row.journal === 'AC' ? BL : GR
        return (
          <g key={i}>
            <rect x="8" y={ry} width="384" height="22" rx="3" fill={i % 2 === 0 ? WH : CB} />
            <text x="14" y={ry + 15} fill={TM} fontSize="8" fontFamily={FT}>{row.date}</text>
            <rect x="50" y={ry + 3} width="18" height="14" rx="3" fill={jColor} fillOpacity="0.1" />
            <text x="59" y={ry + 14} textAnchor="middle" fill={jColor} fontSize="7" fontWeight="600" fontFamily={FT}>{row.journal}</text>
            <text x="76" y={ry + 15} fill={TP} fontSize="7" fontFamily="monospace">{row.compte}</text>
            <text x="154" y={ry + 15} fill={TP} fontSize="8" fontFamily={FT}>{row.libelle}</text>
            <text x="296" y={ry + 15} fill={row.debit ? TP : TS} fontSize="8" fontWeight={row.debit ? '600' : '400'} fontFamily={FT}>{row.debit || '—'}</text>
            <text x="352" y={ry + 15} fill={row.credit ? TP : TS} fontSize="8" fontWeight={row.credit ? '600' : '400'} fontFamily={FT}>{row.credit || '—'}</text>
          </g>
        )
      })}

      {/* Footer */}
      <rect x="8" y="222" width="384" height="20" rx="4" fill={GR} fillOpacity="0.06" stroke={GR} strokeOpacity="0.15" strokeWidth="0.5" />
      <text x="200" y="236" textAnchor="middle" fill={GR} fontSize="8" fontWeight="500" fontFamily={FT}>6 écritures ce mois · Solde : équilibré ✓</text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
// 2. OCR — Import factures
// ═══════════════════════════════════════════════════════════

const OCR_ROWS = [
  { fourn: 'TOTAL ENERGIES SA', compte: '401TOTALENE', montant: '1 240,00 €', status: 'Extrait', color: GR },
  { fourn: 'OVH SAS', compte: '401OVHSAS', montant: '59,99 €', status: 'Extrait', color: GR },
  { fourn: 'BUREAU VALLÉE', compte: '401BURVALL', montant: '87,40 €', status: 'En attente', color: OR },
]

export function OcrMockup({ mini = false }: { mini?: boolean }) {
  if (mini) return <OcrMini />
  const cx = 196
  return (
    <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="800" height="500" fill={CB} />
      <AppSidebar active="Factures" />

      {/* Header */}
      <text x={cx} y="30" fill={TP} fontSize="18" fontWeight="700" fontFamily={FT}>Import de facture</text>
      {/* Stats */}
      {[
        { v: '32', l: 'Total traités', c: BL },
        { v: '28', l: 'Validées', c: GR },
        { v: '4', l: 'En attente', c: OR },
      ].map((s, i) => (
        <g key={i}>
          <rect x={cx + i * 130} y={42} width={120} height={36} rx="6" fill={WH} stroke={BD} strokeWidth="0.5" />
          <text x={cx + 12 + i * 130} y={58} fill={s.c} fontSize="14" fontWeight="700" fontFamily={FT}>{s.v}</text>
          <text x={cx + 40 + i * 130} y={58} fill={TM} fontSize="10" fontFamily={FT}>{s.l}</text>
        </g>
      ))}

      {/* Upload zone */}
      <rect x={cx} y="92" width="584" height="140" rx="12" fill={WH} stroke={BD} strokeDasharray="6 3" strokeWidth="1.5" />
      <circle cx={cx + 292} cy="140" r="24" fill={GR} fillOpacity="0.1" />
      <text x={cx + 292} y="146" textAnchor="middle" fill={GR} fontSize="20" fontFamily={FT}>↑</text>
      <text x={cx + 292} y="182" textAnchor="middle" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>Glissez vos factures ici</text>
      <text x={cx + 292} y="200" textAnchor="middle" fill={TM} fontSize="10" fontFamily={FT}>PDF, JPG, PNG — Max 10 Mo</text>
      <rect x={cx + 232} y="210" width="120" height="16" rx="4" fill={GR} fillOpacity="0.1" />
      <text x={cx + 292} y="222" textAnchor="middle" fill={GR} fontSize="9" fontWeight="500" fontFamily={FT}>ou parcourir les fichiers</text>

      {/* Table header */}
      <text x={cx} y="256" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>Factures traitées</text>
      <rect x={cx} y="264" width="584" height="28" rx="6" fill={TH} />
      <text x={cx + 14} y="283" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Fournisseur</text>
      <text x={cx + 230} y="283" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Compte</text>
      <text x={cx + 380} y="283" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Montant</text>
      <text x={cx + 500} y="283" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Statut</text>

      {/* Rows */}
      {OCR_ROWS.map((row, i) => {
        const ry = 298 + i * 44
        return (
          <g key={i}>
            <rect x={cx} y={ry} width="584" height="38" rx="6" fill={i % 2 === 0 ? WH : CB} stroke={BD} strokeWidth="0.3" />
            <text x={cx + 14} y={ry + 24} fill={TP} fontSize="11" fontWeight="500" fontFamily={FT}>{row.fourn}</text>
            <text x={cx + 230} y={ry + 24} fill={TM} fontSize="10" fontFamily="monospace">{row.compte}</text>
            <text x={cx + 380} y={ry + 24} fill={TP} fontSize="11" fontWeight="600" fontFamily={FT}>{row.montant}</text>
            <rect x={cx + 495} y={ry + 10} width="68" height="18" rx="4" fill={row.color} fillOpacity="0.1" />
            <text x={cx + 529} y={ry + 24} textAnchor="middle" fill={row.color} fontSize="9" fontWeight="600" fontFamily={FT}>{row.status}</text>
          </g>
        )
      })}
    </svg>
  )
}

function OcrMini() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height="250" rx="6" fill={CB} />
      <rect x="0" y="0" width="400" height="30" rx="6" fill={WH} />
      <text x="14" y="20" fill={TP} fontSize="11" fontWeight="700" fontFamily={FT}>Import de facture</text>

      {/* Upload zone */}
      <rect x="12" y="38" width="376" height="70" rx="8" fill={WH} stroke={BD} strokeDasharray="4 2" strokeWidth="1" />
      <text x="200" y="70" textAnchor="middle" fill={GR} fontSize="16" fontFamily={FT}>↑</text>
      <text x="200" y="88" textAnchor="middle" fill={TM} fontSize="9" fontFamily={FT}>Glissez vos factures ici · PDF, JPG, PNG</text>

      {/* Table */}
      <rect x="12" y="116" width="376" height="22" rx="4" fill={TH} />
      <text x="22" y="131" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Fournisseur</text>
      <text x="180" y="131" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Compte</text>
      <text x="270" y="131" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Montant</text>
      <text x="348" y="131" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Statut</text>

      {OCR_ROWS.map((row, i) => {
        const ry = 142 + i * 32
        return (
          <g key={i}>
            <rect x="12" y={ry} width="376" height="28" rx="4" fill={i % 2 === 0 ? WH : CB} />
            <text x="22" y={ry + 18} fill={TP} fontSize="9" fontWeight="500" fontFamily={FT}>{row.fourn}</text>
            <text x="180" y={ry + 18} fill={TM} fontSize="8" fontFamily="monospace">{row.compte}</text>
            <text x="270" y={ry + 18} fill={TP} fontSize="9" fontWeight="600" fontFamily={FT}>{row.montant}</text>
            <rect x="338" y={ry + 6} width="44" height="14" rx="3" fill={row.color} fillOpacity="0.1" />
            <text x="360" y={ry + 17} textAnchor="middle" fill={row.color} fontSize="7" fontWeight="600" fontFamily={FT}>{row.status}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
// 3. RAPPROCHEMENT BANCAIRE
// ═══════════════════════════════════════════════════════════

const RAPP_ROWS = [
  { date: '16/03', label: 'VIR TOTAL ENERGIES', montant: '-1 240,00 €', compte: '401089', status: '✓ Rapproché', color: GR },
  { date: '17/03', label: 'PRLV OVH CLOUD', montant: '-59,99 €', compte: '613108', status: '✓ Rapproché', color: GR },
  { date: '15/03', label: 'CB BUREAU VALLÉE', montant: '-87,40 €', compte: '606110', status: '⏳ En attente', color: OR },
  { date: '18/03', label: 'VIR CLIENT SCI', montant: '+3 500,00 €', compte: '411001', status: '✓ Rapproché', color: GR },
  { date: '19/03', label: 'PRLV EDF PRO', montant: '-234,00 €', compte: '606100', status: '✗ Non trouvé', color: RD },
]

export function RapprochementMockup({ mini = false }: { mini?: boolean }) {
  if (mini) return <RapprochementMini />
  const cx = 196
  return (
    <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="800" height="500" fill={CB} />
      <AppSidebar active="Rapprochement" />

      {/* Header */}
      <text x={cx} y="30" fill={TP} fontSize="18" fontWeight="700" fontFamily={FT}>Rapprochement bancaire</text>
      <rect x="640" y="12" width="140" height="26" rx="6" fill={GR} fillOpacity="0.1" />
      <text x="660" y="30" fill={GR} fontSize="10" fontWeight="600" fontFamily={FT}>6/8 rapprochées</text>

      {/* Stats */}
      {[
        { v: '4', l: 'Validés', c: GR, bg: '#ECFDF5' },
        { v: '1', l: 'En attente', c: OR, bg: '#FFF7ED' },
        { v: '1', l: 'Anomalies', c: RD, bg: '#FEF2F2' },
        { v: '8', l: 'Total', c: BL, bg: '#EFF6FF' },
      ].map((s, i) => (
        <g key={i}>
          <rect x={cx + i * 148} y={46} width={140} height={52} rx="8" fill={s.bg} stroke={BD} strokeWidth="0.3" />
          <text x={cx + 14 + i * 148} y={68} fill={s.c} fontSize="18" fontWeight="700" fontFamily={FT}>{s.v}</text>
          <text x={cx + 14 + i * 148} y={86} fill={TM} fontSize="10" fontFamily={FT}>{s.l}</text>
        </g>
      ))}

      {/* Table header */}
      <rect x={cx} y="112" width="584" height="30" rx="6" fill={TH} />
      <text x={cx + 14} y="132" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Date</text>
      <text x={cx + 80} y="132" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Libellé</text>
      <text x={cx + 290} y="132" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Montant</text>
      <text x={cx + 400} y="132" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Compte</text>
      <text x={cx + 490} y="132" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Statut</text>

      {/* Rows */}
      {RAPP_ROWS.map((row, i) => {
        const ry = 148 + i * 42
        const isNeg = row.montant.startsWith('-')
        return (
          <g key={i}>
            <rect x={cx} y={ry} width="584" height="38" rx="4" fill={i % 2 === 0 ? WH : CB} stroke={BD} strokeWidth="0.3" />
            <text x={cx + 14} y={ry + 24} fill={TM} fontSize="10" fontFamily={FT}>{row.date}</text>
            <text x={cx + 80} y={ry + 24} fill={TP} fontSize="11" fontWeight="500" fontFamily={FT}>{row.label}</text>
            <text x={cx + 290} y={ry + 24} fill={isNeg ? RD : GR} fontSize="11" fontWeight="600" fontFamily={FT}>{row.montant}</text>
            <text x={cx + 400} y={ry + 24} fill={TM} fontSize="10" fontFamily="monospace">{row.compte}</text>
            <rect x={cx + 482} y={ry + 10} width="90" height="18" rx="4" fill={row.color} fillOpacity="0.1" />
            <text x={cx + 527} y={ry + 24} textAnchor="middle" fill={row.color} fontSize="9" fontWeight="600" fontFamily={FT}>{row.status}</text>
          </g>
        )
      })}
    </svg>
  )
}

function RapprochementMini() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height="250" rx="6" fill={CB} />
      <rect x="0" y="0" width="400" height="30" rx="6" fill={WH} />
      <text x="14" y="20" fill={TP} fontSize="11" fontWeight="700" fontFamily={FT}>Rapprochement bancaire</text>
      <rect x="296" y="6" width="92" height="18" rx="4" fill={GR} fillOpacity="0.1" />
      <text x="312" y="19" fill={GR} fontSize="8" fontWeight="600" fontFamily={FT}>6/8 rapprochées</text>

      {/* Table */}
      <rect x="12" y="38" width="376" height="22" rx="4" fill={TH} />
      <text x="22" y="53" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Date</text>
      <text x="60" y="53" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Libellé</text>
      <text x="195" y="53" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Montant</text>
      <text x="280" y="53" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Compte</text>
      <text x="345" y="53" fill={TM} fontSize="8" fontWeight="600" fontFamily={FT}>Statut</text>

      {RAPP_ROWS.slice(0, 5).map((row, i) => {
        const ry = 64 + i * 34
        return (
          <g key={i}>
            <rect x="12" y={ry} width="376" height="30" rx="4" fill={i % 2 === 0 ? WH : CB} />
            <text x="22" y={ry + 19} fill={TM} fontSize="8" fontFamily={FT}>{row.date}</text>
            <text x="60" y={ry + 19} fill={TP} fontSize="9" fontWeight="500" fontFamily={FT}>{row.label}</text>
            <text x="195" y={ry + 19} fill={row.montant.startsWith('-') ? RD : GR} fontSize="9" fontWeight="600" fontFamily={FT}>{row.montant}</text>
            <text x="280" y={ry + 19} fill={TM} fontSize="7" fontFamily="monospace">{row.compte}</text>
            <rect x="338" y={ry + 7} width="44" height="14" rx="3" fill={row.color} fillOpacity="0.1" />
            <text x="360" y={ry + 18} textAnchor="middle" fill={row.color} fontSize="6" fontWeight="600" fontFamily={FT}>{row.status.slice(2)}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
// 4. TVA CA3
// ═══════════════════════════════════════════════════════════

const TVA_CASES = [
  { id: 'A (0090)', label: 'Opérations imposables (HT)', value: '48 280,00 €' },
  { id: 'B (0040)', label: 'Autres opér. non imposables', value: '0,00 €' },
  { id: '08 (0150)', label: 'TVA brute (20%)', value: '9 656,00 €' },
  { id: '3B (0703)', label: 'TVA déductible / immobilis.', value: '1 620,00 €' },
  { id: '16 (8002)', label: 'Crédit de TVA reporté', value: '0,00 €' },
]

export function TvaMockup({ mini = false }: { mini?: boolean }) {
  if (mini) return <TvaMini />
  const cx = 196
  return (
    <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="800" height="500" fill={CB} />
      <AppSidebar active="TVA" />

      {/* Header */}
      <text x={cx} y="30" fill={TP} fontSize="18" fontWeight="700" fontFamily={FT}>Déclaration TVA CA3 — Mars 2026</text>
      <rect x="620" y="12" width="160" height="26" rx="6" fill={GR} fillOpacity="0.1" />
      <text x="636" y="30" fill={GR} fontSize="10" fontWeight="600" fontFamily={FT}>✅ Pré-rempli automatiquement</text>

      {/* Stats */}
      {[
        { v: '4', l: 'Total', c: GR, bg: '#ECFDF5' },
        { v: '2', l: 'Brouillons', c: BL, bg: '#EFF6FF' },
        { v: '1', l: 'Envoyées', c: BL, bg: '#EFF6FF' },
        { v: '3 200 €', l: 'TVA Payée', c: GL, bg: '#FFFBEB' },
      ].map((s, i) => (
        <g key={i}>
          <rect x={cx + i * 148} y={46} width={140} height={48} rx="8" fill={s.bg} stroke={BD} strokeWidth="0.3" />
          <text x={cx + 14 + i * 148} y={68} fill={s.c} fontSize="16" fontWeight="700" fontFamily={FT}>{s.v}</text>
          <text x={cx + 14 + i * 148} y={84} fill={TM} fontSize="10" fontFamily={FT}>{s.l}</text>
        </g>
      ))}

      {/* Form header */}
      <rect x={cx} y="110" width="584" height="28" rx="6" fill={TH} />
      <text x={cx + 14} y="129" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Case</text>
      <text x={cx + 120} y="129" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Libellé</text>
      <text x={cx + 440} y="129" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Montant</text>

      {/* Cases */}
      {TVA_CASES.map((c, i) => {
        const ry = 144 + i * 46
        const isLast = i === TVA_CASES.length - 1
        return (
          <g key={i}>
            <rect x={cx} y={ry} width="584" height="40" rx="6" fill={WH} stroke={BD} strokeWidth="0.3" />
            <rect x={cx + 8} y={ry + 8} width="80" height="24" rx="4" fill="#1B3A6B" fillOpacity="0.08" />
            <text x={cx + 48} y={ry + 25} textAnchor="middle" fill="#1B3A6B" fontSize="10" fontWeight="600" fontFamily="monospace">{c.id}</text>
            <text x={cx + 120} y={ry + 25} fill={TP} fontSize="11" fontFamily={FT}>{c.label}</text>
            <rect x={cx + 430} y={ry + 8} width="130" height="24" rx="4" fill={isLast ? WH : GR} fillOpacity={isLast ? 1 : 0.06} stroke={isLast ? BD : GR} strokeOpacity={isLast ? 1 : 0.3} strokeWidth="0.5" />
            <text x={cx + 495} y={ry + 25} textAnchor="middle" fill={isLast ? TM : GR} fontSize="11" fontWeight="600" fontFamily={FT}>{c.value}</text>
          </g>
        )
      })}

      {/* Total */}
      <rect x={cx} y="380" width="584" height="48" rx="8" fill="#EFF6FF" stroke={BL} strokeOpacity="0.2" strokeWidth="0.5" />
      <text x={cx + 14} y="410" fill={TP} fontSize="14" fontWeight="700" fontFamily={FT}>TVA nette à payer</text>
      <text x={cx + 546} y="410" textAnchor="end" fill="#1B3A6B" fontSize="22" fontWeight="800" fontFamily={FT}>8 036,00 €</text>

      {/* Button + note */}
      <rect x={cx} y="444" width="180" height="36" rx="8" fill={GR} />
      <text x={cx + 90} y="468" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="600" fontFamily={FT}>Exporter PDF adminfisc</text>
      <text x={cx + 200} y="468" fill={TM} fontSize="10" fontFamily={FT}>Calculé depuis 142 écritures PCG</text>
    </svg>
  )
}

function TvaMini() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height="250" rx="6" fill={CB} />
      <rect x="0" y="0" width="400" height="30" rx="6" fill={WH} />
      <text x="14" y="20" fill={TP} fontSize="11" fontWeight="700" fontFamily={FT}>TVA CA3 — Mars 2026</text>
      <rect x="270" y="6" width="118" height="18" rx="4" fill={GR} fillOpacity="0.1" />
      <text x="282" y="19" fill={GR} fontSize="8" fontWeight="500" fontFamily={FT}>Pré-rempli auto</text>

      {TVA_CASES.slice(0, 4).map((c, i) => {
        const ry = 38 + i * 36
        return (
          <g key={i}>
            <rect x="12" y={ry} width="376" height="30" rx="4" fill={WH} stroke={BD} strokeWidth="0.3" />
            <rect x="18" y={ry + 5} width="56" height="20" rx="3" fill="#1B3A6B" fillOpacity="0.08" />
            <text x="46" y={ry + 19} textAnchor="middle" fill="#1B3A6B" fontSize="8" fontWeight="600" fontFamily="monospace">{c.id}</text>
            <text x="82" y={ry + 19} fill={TP} fontSize="9" fontFamily={FT}>{c.label}</text>
            <rect x="310" y={ry + 5} width="70" height="20" rx="3" fill={GR} fillOpacity="0.06" />
            <text x="345" y={ry + 19} textAnchor="middle" fill={GR} fontSize="9" fontWeight="600" fontFamily={FT}>{c.value}</text>
          </g>
        )
      })}

      {/* Total */}
      <rect x="12" y="190" width="376" height="36" rx="6" fill="#EFF6FF" stroke={BL} strokeOpacity="0.2" strokeWidth="0.5" />
      <text x="24" y="214" fill={TP} fontSize="11" fontWeight="700" fontFamily={FT}>TVA nette à payer</text>
      <text x="370" y="214" textAnchor="end" fill="#1B3A6B" fontSize="16" fontWeight="800" fontFamily={FT}>8 036,00 €</text>

      <rect x="12" y="234" width="100" height="14" rx="3" fill={GR} />
      <text x="62" y="245" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="600" fontFamily={FT}>Exporter PDF</text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
// 5. E-INVOICING — Factur-X
// ═══════════════════════════════════════════════════════════

export function EinvoicingMockup({ mini = false }: { mini?: boolean }) {
  if (mini) return <EinvoicingMini />
  const cx = 196
  const FIELDS = [
    { label: 'BT-1 Numéro facture', value: 'FAC-2026-0047' },
    { label: 'BT-2 Date émission', value: '18/03/2026' },
    { label: 'BT-31 TVA vendeur', value: 'FR 82 824513290' },
    { label: 'BT-84 IBAN', value: 'FR76 3000 4028 3700 ****' },
    { label: 'BT-10 Réf. acheteur', value: 'CMD-2026-1138' },
    { label: 'BT-112 Montant TTC', value: '2 880,00 €' },
  ]

  return (
    <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="800" height="500" fill={CB} />
      <AppSidebar active="Factures" />

      {/* Header */}
      <text x={cx} y="30" fill={TP} fontSize="18" fontWeight="700" fontFamily={FT}>Facture FAC-2026-0047</text>
      <rect x="600" y="12" width="180" height="26" rx="6" fill={GR} fillOpacity="0.1" stroke={GR} strokeOpacity="0.3" strokeWidth="0.5" />
      <text x="616" y="30" fill={GR} fontSize="10" fontWeight="700" fontFamily={FT}>✓ Factur-X EN16931 conforme</text>

      {/* Invoice card */}
      <rect x={cx} y="48" width="584" height="120" rx="8" fill={WH} stroke={BD} strokeWidth="0.5" />
      <text x={cx + 14} y="72" fill={TM} fontSize="10" fontFamily={FT}>Émetteur</text>
      <text x={cx + 14} y="90" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>Cabinet Moreau &amp; Associés</text>
      <text x={cx + 14} y="106" fill={TM} fontSize="10" fontFamily={FT}>SIREN : 824 513 290 · TVA : FR82824513290</text>

      <line x1={cx + 292} y1="56" x2={cx + 292} y2="160" stroke={BD} strokeWidth="0.5" />

      <text x={cx + 306} y="72" fill={TM} fontSize="10" fontFamily={FT}>Destinataire</text>
      <text x={cx + 306} y="90" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>SCI LES PINS</text>
      <text x={cx + 306} y="106" fill={TM} fontSize="10" fontFamily={FT}>SIREN : 751 203 841</text>

      <rect x={cx + 14} y="120" width="170" height="36" rx="6" fill={CB} />
      <text x={cx + 28} y="138" fill={TM} fontSize="9" fontFamily={FT}>Montant HT</text>
      <text x={cx + 28} y="152" fill={TP} fontSize="12" fontWeight="700" fontFamily={FT}>2 400,00 €</text>
      <rect x={cx + 200} y="120" width="120" height="36" rx="6" fill={CB} />
      <text x={cx + 214} y="138" fill={TM} fontSize="9" fontFamily={FT}>TVA 20%</text>
      <text x={cx + 214} y="152" fill={TP} fontSize="12" fontWeight="700" fontFamily={FT}>480,00 €</text>
      <rect x={cx + 336} y="120" width="120" height="36" rx="6" fill={GR} fillOpacity="0.06" />
      <text x={cx + 350} y="138" fill={TM} fontSize="9" fontFamily={FT}>Total TTC</text>
      <text x={cx + 350} y="152" fill={GR} fontSize="12" fontWeight="700" fontFamily={FT}>2 880,00 €</text>

      {/* EN16931 fields */}
      <text x={cx} y="194" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>Champs obligatoires EN16931</text>
      <rect x={cx + 420} y="180" width="164" height="22" rx="4" fill={GR} fillOpacity="0.1" />
      <text x={cx + 502} y="196" textAnchor="middle" fill={GR} fontSize="10" fontWeight="600" fontFamily={FT}>✓ 16/16 champs validés</text>

      <rect x={cx} y="206" width="584" height="28" rx="6" fill={TH} />
      <text x={cx + 14} y="225" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Champ</text>
      <text x={cx + 320} y="225" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Valeur</text>
      <text x={cx + 540} y="225" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Statut</text>

      {FIELDS.map((f, i) => {
        const ry = 240 + i * 36
        return (
          <g key={i}>
            <rect x={cx} y={ry} width="584" height="32" rx="4" fill={i % 2 === 0 ? WH : CB} />
            <text x={cx + 14} y={ry + 21} fill={TP} fontSize="10" fontFamily={FT}>{f.label}</text>
            <text x={cx + 320} y={ry + 21} fill={TP} fontSize="10" fontWeight="500" fontFamily="monospace">{f.value}</text>
            <text x={cx + 552} y={ry + 21} fill={GR} fontSize="12" fontFamily={FT}>✓</text>
          </g>
        )
      })}

      {/* Footer */}
      <rect x={cx} y="462" width="584" height="28" rx="6" fill="#1B3A6B" fillOpacity="0.05" />
      <text x={cx + 292} y="481" textAnchor="middle" fill="#1B3A6B" fontSize="10" fontWeight="500" fontFamily={FT}>XML Factur-X embarqué dans le PDF · Conforme réforme 2026</text>
    </svg>
  )
}

function EinvoicingMini() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height="250" rx="6" fill={CB} />
      <rect x="0" y="0" width="400" height="30" rx="6" fill={WH} />
      <text x="14" y="20" fill={TP} fontSize="11" fontWeight="700" fontFamily={FT}>Facture FAC-2026-0047</text>
      <rect x="260" y="6" width="128" height="18" rx="4" fill={GR} fillOpacity="0.1" />
      <text x="274" y="19" fill={GR} fontSize="8" fontWeight="600" fontFamily={FT}>Factur-X EN16931 ✓</text>

      {/* Invoice summary */}
      <rect x="12" y="38" width="376" height="58" rx="6" fill={WH} stroke={BD} strokeWidth="0.5" />
      <text x="22" y="54" fill={TM} fontSize="8" fontFamily={FT}>Cabinet Moreau → SCI LES PINS</text>
      <text x="22" y="70" fill={TP} fontSize="10" fontWeight="600" fontFamily={FT}>HT 2 400,00 €</text>
      <text x="130" y="70" fill={TP} fontSize="10" fontWeight="600" fontFamily={FT}>TVA 480,00 €</text>
      <text x="260" y="70" fill={GR} fontSize="12" fontWeight="700" fontFamily={FT}>TTC 2 880,00 €</text>
      <text x="22" y="86" fill={TM} fontSize="8" fontFamily={FT}>SIREN 824 513 290 · TVA FR82824513290</text>

      {/* Fields */}
      {[
        { l: 'BT-1 Numéro', v: 'FAC-2026-0047' },
        { l: 'BT-2 Date', v: '18/03/2026' },
        { l: 'BT-31 TVA', v: 'FR82824513290' },
        { l: 'BT-84 IBAN', v: 'FR76 3000 ****' },
      ].map((f, i) => (
        <g key={i}>
          <rect x="12" y={104 + i * 28} width="376" height="24" rx="3" fill={i % 2 === 0 ? WH : CB} />
          <text x="22" y={120 + i * 28} fill={TP} fontSize="9" fontFamily={FT}>{f.l}</text>
          <text x="200" y={120 + i * 28} fill={TP} fontSize="9" fontWeight="500" fontFamily="monospace">{f.v}</text>
          <text x="372" y={120 + i * 28} fill={GR} fontSize="10" fontFamily={FT}>✓</text>
        </g>
      ))}

      <rect x="12" y="222" width="376" height="20" rx="4" fill="#1B3A6B" fillOpacity="0.05" />
      <text x="200" y="236" textAnchor="middle" fill="#1B3A6B" fontSize="8" fontFamily={FT}>✓ 16/16 champs · XML Factur-X embarqué</text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
// 6. PORTAIL CLIENT (layout différent — pas de sidebar app)
// ═══════════════════════════════════════════════════════════

export function PortailMockup({ mini = false }: { mini?: boolean }) {
  if (mini) return <PortailMini />
  const DOCS = [
    { name: 'Facture EDF mars 2026.pdf', size: '245 Ko', date: '22/03/2026', status: 'Reçu', color: GR },
    { name: 'Relevé BNP Mars 2026.pdf', size: '182 Ko', date: '21/03/2026', status: 'Reçu', color: GR },
    { name: 'Note de frais Q1.pdf', size: '94 Ko', date: '20/03/2026', status: 'En cours', color: OR },
  ]
  return (
    <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="800" height="500" fill={CB} />

      {/* Header */}
      <rect x="0" y="0" width="800" height="56" fill={WH} />
      <text x="20" y="30" fill={GR} fontSize="18" fontWeight="800" fontFamily="Georgia,serif">W</text>
      <text x="38" y="30" fill={TP} fontSize="13" fontWeight="600" fontFamily={FT}>Worthifast</text>
      <line x1="120" y1="14" x2="120" y2="42" stroke={BD} strokeWidth="0.5" />
      <text x="136" y="30" fill={TP} fontSize="14" fontWeight="600" fontFamily={FT}>Espace client — SCI LES PINS</text>
      <text x="136" y="46" fill={TM} fontSize="10" fontFamily={FT}>Cabinet Moreau &amp; Associés</text>
      <line x1="0" y1="56" x2="800" y2="56" stroke={BD} strokeWidth="0.5" />

      {/* Documents */}
      <text x="40" y="90" fill={TP} fontSize="16" fontWeight="700" fontFamily={FT}>Documents déposés</text>

      {/* Table header */}
      <rect x="40" y="104" width="720" height="30" rx="6" fill={TH} />
      <text x="60" y="124" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Fichier</text>
      <text x="400" y="124" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Taille</text>
      <text x="500" y="124" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Date</text>
      <text x="640" y="124" fill={TM} fontSize="10" fontWeight="600" fontFamily={FT}>Statut</text>

      {DOCS.map((doc, i) => {
        const ry = 140 + i * 44
        return (
          <g key={i}>
            <rect x="40" y={ry} width="720" height="40" rx="4" fill={i % 2 === 0 ? WH : CB} stroke={BD} strokeWidth="0.3" />
            <text x="60" y={ry + 18} fill={TP} fontSize="12" fontFamily={FT}>📄</text>
            <text x="82" y={ry + 25} fill={TP} fontSize="11" fontWeight="500" fontFamily={FT}>{doc.name}</text>
            <text x="400" y={ry + 25} fill={TM} fontSize="10" fontFamily={FT}>{doc.size}</text>
            <text x="500" y={ry + 25} fill={TM} fontSize="10" fontFamily={FT}>{doc.date}</text>
            <rect x="632" y={ry + 10} width="70" height="20" rx="4" fill={doc.color} fillOpacity="0.1" />
            <text x="667" y={ry + 25} textAnchor="middle" fill={doc.color} fontSize="9" fontWeight="600" fontFamily={FT}>{doc.status}</text>
          </g>
        )
      })}

      {/* Messagerie */}
      <text x="40" y="304" fill={TP} fontSize="16" fontWeight="700" fontFamily={FT}>Messagerie</text>
      <rect x="40" y="318" width="720" height="76" rx="8" fill={WH} stroke={BD} strokeWidth="0.5" />
      <rect x="40" y="318" width="720" height="76" rx="8" fill={GL} fillOpacity="0.03" stroke={GL} strokeOpacity="0.15" strokeWidth="0.5" />
      <rect x="56" y="330" width="56" height="18" rx="4" fill={GL} fillOpacity="0.15" />
      <text x="84" y="343" textAnchor="middle" fill={GL} fontSize="8" fontWeight="600" fontFamily={FT}>Non lu</text>
      <text x="124" y="343" fill={TP} fontSize="11" fontWeight="600" fontFamily={FT}>Cabinet Moreau &amp; Associés</text>
      <text x="56" y="362" fill={TM} fontSize="11" fontFamily={FT}>Votre déclaration TVA Mars est prête à valider.</text>
      <text x="56" y="382" fill={TS} fontSize="9" fontFamily={FT}>Il y a 2 heures</text>

      {/* Button */}
      <rect x="40" y="416" width="200" height="40" rx="8" fill={GR} />
      <text x="140" y="442" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="600" fontFamily={FT}>+ Déposer un document</text>

      <text x="40" y="480" fill={TS} fontSize="10" fontFamily={FT}>Espace sécurisé · Connexion chiffrée · RGPD conforme</text>
    </svg>
  )
}

function PortailMini() {
  return (
    <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="400" height="250" rx="6" fill={CB} />
      {/* Header */}
      <rect x="0" y="0" width="400" height="30" rx="6" fill={WH} />
      <text x="14" y="14" fill={GR} fontSize="12" fontWeight="800" fontFamily="Georgia,serif">W</text>
      <text x="26" y="14" fill={TP} fontSize="9" fontWeight="600" fontFamily={FT}>Worthifast</text>
      <text x="14" y="26" fill={TM} fontSize="8" fontFamily={FT}>Espace client — SCI LES PINS</text>

      {/* Documents */}
      {[
        { n: 'Facture EDF mars.pdf', s: 'Reçu', c: GR },
        { n: 'Relevé BNP Mars.pdf', s: 'Reçu', c: GR },
        { n: 'Note de frais Q1.pdf', s: 'En cours', c: OR },
      ].map((d, i) => (
        <g key={i}>
          <rect x="12" y={38 + i * 30} width="376" height="26" rx="4" fill={i % 2 === 0 ? WH : CB} />
          <text x="22" y={55 + i * 30} fill={TP} fontSize="9" fontFamily={FT}>📄 {d.n}</text>
          <rect x="338" y={42 + i * 30} width="44" height="14" rx="3" fill={d.c} fillOpacity="0.1" />
          <text x="360" y={53 + i * 30} textAnchor="middle" fill={d.c} fontSize="7" fontWeight="600" fontFamily={FT}>{d.s}</text>
        </g>
      ))}

      {/* Message */}
      <rect x="12" y="134" width="376" height="46" rx="6" fill={WH} stroke={GL} strokeOpacity="0.2" strokeWidth="0.5" />
      <rect x="20" y="142" width="38" height="12" rx="3" fill={GL} fillOpacity="0.15" />
      <text x="39" y="151" textAnchor="middle" fill={GL} fontSize="7" fontWeight="600" fontFamily={FT}>Non lu</text>
      <text x="64" y="151" fill={TP} fontSize="9" fontWeight="600" fontFamily={FT}>Cabinet Moreau</text>
      <text x="20" y="170" fill={TM} fontSize="8" fontFamily={FT}>Votre déclaration TVA Mars est prête à valider.</text>

      {/* Button */}
      <rect x="12" y="192" width="140" height="28" rx="6" fill={GR} />
      <text x="82" y="211" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="600" fontFamily={FT}>+ Déposer un document</text>

      <text x="12" y="240" fill={TS} fontSize="8" fontFamily={FT}>Espace sécurisé · RGPD conforme</text>
    </svg>
  )
}
