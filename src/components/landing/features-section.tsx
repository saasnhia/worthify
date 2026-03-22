import {
  DashboardMockup, OcrMockup, RapprochementMockup,
  TvaMockup, EinvoicingMockup, PortailMockup,
} from './mockups'

type MockupType = 'dashboard' | 'ocr' | 'rapprochement' | 'tva' | 'einvoicing' | 'portail'

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
    mockup: 'dashboard',
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
    icon: '🤝',
    title: 'Portail client',
    description: 'Vos clients déposent leurs documents directement. Zéro email.',
    mockup: 'portail',
  },
]

const MOCKUP_COMPONENTS: Record<MockupType, React.FC<{ mini?: boolean }>> = {
  dashboard: DashboardMockup,
  ocr: OcrMockup,
  rapprochement: RapprochementMockup,
  tva: TvaMockup,
  einvoicing: EinvoicingMockup,
  portail: PortailMockup,
}

function FeatureCard({ feature }: { feature: Feature }) {
  const MockupComponent = MOCKUP_COMPONENTS[feature.mockup]
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
        <MockupComponent mini />
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
