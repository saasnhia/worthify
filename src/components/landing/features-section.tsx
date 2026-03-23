import Image from 'next/image'
import {
  JournalMockup, RapprochementMockup,
  EinvoicingMockup,
} from './mockups'

type MockupType = 'dashboard' | 'journal' | 'ocr' | 'rapprochement' | 'tva' | 'einvoicing' | 'agent-ia'

interface Feature {
  size: 'large' | 'normal'
  icon: string
  title: string
  description: string
  badge?: string
  badgeColor?: 'green' | 'gold'
  mockup: MockupType
}

const FEATURES: Feature[] = [
  {
    size: 'large',
    icon: '📊',
    title: 'Dashboard cabinet',
    description: 'KPIs en temps reel : CA, tresorerie, dossiers actifs, balance agee, alertes fiscales. Tout en un ecran.',
    badge: 'Temps reel · Alertes fiscales',
    mockup: 'dashboard',
  },
  {
    size: 'normal',
    icon: '🔍',
    title: 'OCR Intelligent',
    description: 'Taux de reconnaissance > 95%, correction manuelle possible, apprentissage continu des patterns.',
    badge: 'IA Mistral France',
    mockup: 'ocr',
  },
  {
    size: 'normal',
    icon: '📄',
    title: 'TVA & CERFA',
    description: 'CA3 pre-remplie depuis vos ecritures, export PDF conforme adminfisc, validation automatique.',
    badge: 'CERFA 3310',
    mockup: 'tva',
  },
  {
    size: 'normal',
    icon: '🏦',
    title: 'Rapprochement bancaire',
    description: 'Import OFX/CSV, matching automatique factures et transactions, detection des anomalies.',
    badge: 'Auto-matching 95%',
    mockup: 'rapprochement',
  },
  {
    size: 'normal',
    icon: '🇫🇷',
    title: 'E-invoicing 2026',
    description: 'Factur-X / EN16931 natif — conforme des maintenant pour la reforme sept. 2026.',
    badge: 'Inclus dans tous les plans',
    badgeColor: 'gold',
    mockup: 'einvoicing',
  },
  {
    size: 'large',
    icon: '📋',
    title: 'Journal comptable PCG',
    description: '700+ comptes, ecritures chronologiques par journal (VE/AC/BQ/OD), grand livre par compte en 1 clic.',
    badge: '700+ comptes',
    mockup: 'journal',
  },
  {
    size: 'normal',
    icon: '🤖',
    title: 'Agent IA comptable',
    description: 'Posez vos questions comptables — ecritures suggerees, references PCG & BOFIP, conseil fiscal.',
    badge: 'Mistral France · RGPD',
    mockup: 'agent-ia',
  },
]

const SVG_MOCKUPS: Partial<Record<MockupType, string>> = {
  dashboard: '/mockups/worthifast-dashboard.svg',
  ocr: '/mockups/worthifast-ocr.svg',
  tva: '/mockups/worthifast-tva-ca3.svg',
  'agent-ia': '/mockups/worthifast-agent-ia.svg',
}

const INLINE_MOCKUPS: Partial<Record<MockupType, React.FC<{ mini?: boolean }>>> = {
  journal: JournalMockup,
  rapprochement: RapprochementMockup,
  einvoicing: EinvoicingMockup,
}

function FeatureCard({ feature }: { feature: Feature }) {
  const svgPath = SVG_MOCKUPS[feature.mockup]
  const InlineComponent = INLINE_MOCKUPS[feature.mockup]
  const badgeClasses = feature.badgeColor === 'gold'
    ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
    : 'bg-[#00A878]/10 text-[#00A878] border-[#00A878]/20'

  return (
    <div className={`group bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6 hover:border-[#00A878]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,168,120,0.06)] ${
      feature.size === 'large' ? 'md:col-span-2' : ''
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{feature.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white text-[15px]">{feature.title}</h3>
            {feature.badge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeClasses}`}>
                {feature.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{feature.description}</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg overflow-hidden border border-white/[0.05] group-hover:border-white/[0.08] transition-colors">
        {svgPath ? (
          <Image src={svgPath} alt={feature.title} width={800} height={500} className="w-full h-auto" />
        ) : InlineComponent ? (
          <InlineComponent mini />
        ) : null}
      </div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ce que Worthifast fait pour vous</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Comptabilite, conformite et collaboration — dans une seule plateforme concue pour les cabinets francais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(feature => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
