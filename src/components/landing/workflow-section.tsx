import Image from 'next/image'
import { BrowserFrame } from './browser-frame'
import { RapprochementMockup } from './mockups'

type StepMockup = 'drop-zone' | 'ocr' | 'rapprochement' | 'tva'

const STEPS: Array<{
  number: string
  icon: string
  title: string
  description: string
  mockup: StepMockup
  badges?: string[]
}> = [
  {
    number: '01',
    icon: '📤',
    title: 'Deposez votre facture',
    description: 'Glissez un PDF, une photo ou importez depuis votre email. Tous formats acceptes.',
    mockup: 'drop-zone',
    badges: ['PDF', 'JPG', 'PNG', 'Excel', 'Email'],
  },
  {
    number: '02',
    icon: '🤖',
    title: 'OCR + PCG automatique',
    description: "L'IA Mistral extrait les donnees et genere les ecritures PCG en 30 secondes.",
    mockup: 'ocr',
    badges: ['Confiance 98%', 'PCG auto'],
  },
  {
    number: '03',
    icon: '🏦',
    title: 'Rapprochement bancaire',
    description: "Importez votre releve — le matching automatique s'occupe du reste.",
    mockup: 'rapprochement',
    badges: ['Auto-matching 95%'],
  },
  {
    number: '04',
    icon: '📊',
    title: 'Declarations & exports',
    description: 'TVA CA3 pre-remplie, FEC conforme DGFiP, reporting cabinet en temps reel.',
    mockup: 'tva',
    badges: ['CERFA 3310', 'FEC DGFiP'],
  },
]

const SVG_MOCKUPS: Partial<Record<StepMockup, string>> = {
  'drop-zone': '/mockups/worthifast-drop-zone.svg',
  ocr: '/mockups/worthifast-ocr.svg',
  tva: '/mockups/worthifast-tva-ca3.svg',
}

export function WorkflowSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Comment ca marche</h2>
          <p className="text-slate-400 max-w-xl mx-auto">4 etapes pour automatiser votre cabinet — de la facture au bilan.</p>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00A878]/20 to-transparent" />

          <div className="space-y-16 md:space-y-24">
            {STEPS.map((step, i) => {
              const svgPath = SVG_MOCKUPS[step.mockup]
              const isEven = i % 2 === 1

              return (
                <div key={step.number} className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${isEven ? 'md:direction-rtl' : ''}`}>
                  {/* Text side */}
                  <div className={`${isEven ? 'md:order-2 md:text-left' : 'md:order-1'}`} style={{ direction: 'ltr' }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#00A878]/10 border border-[#00A878]/20 flex-shrink-0">
                        <span className="text-[#00A878] font-bold text-sm">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span>{step.icon}</span>
                          {step.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-2 leading-relaxed">{step.description}</p>
                        {step.badges && (
                          <div className="flex items-center gap-2 flex-wrap mt-3">
                            {step.badges.map(badge => (
                              <span key={badge} className="text-[10px] font-semibold bg-[#00A878]/[0.08] text-[#00A878] border border-[#00A878]/20 px-2 py-1 rounded-md">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mockup side */}
                  <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`} style={{ direction: 'ltr' }}>
                    <BrowserFrame className="hover:border-[#00A878]/20 transition-all duration-200">
                      {svgPath ? (
                        <Image src={svgPath} alt={step.title} width={800} height={500} className="w-full h-auto" />
                      ) : (
                        <RapprochementMockup />
                      )}
                    </BrowserFrame>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
