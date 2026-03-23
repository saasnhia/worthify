import Image from 'next/image'
import {
  JournalMockup, RapprochementMockup,
  EinvoicingMockup, PortailMockup,
} from './mockups'

type MockupType = 'dashboard' | 'journal' | 'ocr' | 'rapprochement' | 'tva' | 'einvoicing' | 'portail' | 'agent-ia'

interface Feature {
  size: 'large' | 'normal'
  icon: string
  title: string
  description: string
  badge?: string
  mockup: MockupType
}

const FEATURES: Feature[] = [
  {
    size: 'large',
    icon: '📋',
    title: 'Journal comptable PCG',
    description: '700+ comptes, écritures chronologiques par journal (VE/AC/BQ/OD), grand livre par compte en 1 clic.',
    mockup: 'journal',
  },
  {
    size: 'normal',
    icon: '🔍',
    title: 'OCR Intelligent',
    description: 'Taux de reconnaissance > 95%, correction manuelle possible, apprentissage continu.',
    mockup: 'ocr',
  },
  {
    size: 'normal',
    icon: '🏦',
    title: 'Rapprochement bancaire',
    description: 'Import OFX/CSV, matching automatique, détection des anomalies.',
    mockup: 'rapprochement',
  },
  {
    size: 'normal',
    icon: '📄',
    title: 'TVA & CERFA',
    description: 'CA3 pré-remplie depuis vos écritures, export PDF conforme adminfisc.',
    mockup: 'tva',
  },
  {
    size: 'normal',
    icon: '🇫🇷',
    title: 'E-invoicing 2026',
    description: "Factur-X / EN16931 natif — conforme dès maintenant pour la réforme 2026.",
    badge: 'Inclus dans tous les plans',
    mockup: 'einvoicing',
  },
  {
    size: 'large',
    icon: '📊',
    title: 'Dashboard cabinet',
    description: 'KPIs en temps réel : CA, trésorerie, dossiers actifs, balance âgée, alertes fiscales.',
    mockup: 'dashboard',
  },
  {
    size: 'normal',
    icon: '🤖',
    title: 'Agent IA comptable',
    description: 'Posez vos questions comptables — écritures suggérées, références PCG & BOFIP.',
    badge: 'Mistral IA France',
    mockup: 'agent-ia',
  },
]

/** Mockups served as static SVG files from public/mockups/ */
const SVG_MOCKUPS: Partial<Record<MockupType, string>> = {
  dashboard: '/mockups/worthifast-dashboard.svg',
  ocr: '/mockups/worthifast-ocr.svg',
  tva: '/mockups/worthifast-tva-ca3.svg',
  'agent-ia': '/mockups/worthifast-agent-ia.svg',
}

/** Inline SVG React components (kept for features without file-based mockups) */
const INLINE_MOCKUPS: Partial<Record<MockupType, React.FC<{ mini?: boolean }>>> = {
  journal: JournalMockup,
  rapprochement: RapprochementMockup,
  einvoicing: EinvoicingMockup,
  portail: PortailMockup,
}

function FeatureCard({ feature }: { feature: Feature }) {
  const svgPath = SVG_MOCKUPS[feature.mockup]
  const InlineComponent = INLINE_MOCKUPS[feature.mockup]
  return (
    <div className={`bg-[#0F1117] border border-white/[0.08] rounded-2xl p-6 hover:border-[#00A878]/30 transition-colors ${
      feature.size === 'large' ? 'md:col-span-2' : ''
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{feature.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white">{feature.title}</h3>
            {feature.badge && (
              <span className="bg-[#00A878]/10 text-[#00A878] text-xs px-2 py-1 rounded-full">{feature.badge}</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg overflow-hidden border border-white/5">
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
          <p className="text-slate-400 max-w-xl mx-auto">Comptabilité, conformité et collaboration — dans une seule plateforme conçue pour les cabinets français.</p>
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
