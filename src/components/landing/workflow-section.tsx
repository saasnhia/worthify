import Image from 'next/image'
import { BrowserFrame } from './browser-frame'
import { OcrMockup, RapprochementMockup, TvaMockup } from './mockups'

interface Step {
  number: string
  icon: string
  title: string
  description: string
  visual: 'ocr' | 'screenshot' | 'rapprochement' | 'tva'
  screenshot?: string
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: '📤',
    title: 'Déposez votre facture',
    description: 'Glissez un PDF, une photo ou importez depuis votre email. Tous formats acceptés.',
    visual: 'ocr',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'OCR + PCG automatique',
    description: "L'IA Mistral extrait les données et génère les écritures PCG en 30 secondes.",
    visual: 'screenshot',
    screenshot: '/screenshots/factureocr.png',
  },
  {
    number: '03',
    icon: '🏦',
    title: 'Rapprochement bancaire',
    description: "Importez votre relevé — le matching automatique s'occupe du reste.",
    visual: 'rapprochement',
  },
  {
    number: '04',
    icon: '📊',
    title: 'Déclarations & exports',
    description: 'TVA CA3 pré-remplie, FEC conforme DGFiP, reporting cabinet en temps réel.',
    visual: 'tva',
  },
]

function StepVisual({ step }: { step: Step }) {
  switch (step.visual) {
    case 'ocr':
      return <OcrMockup />
    case 'rapprochement':
      return <RapprochementMockup />
    case 'tva':
      return <TvaMockup />
    case 'screenshot':
      return step.screenshot
        ? <Image src={step.screenshot} alt={step.title} width={600} height={350} className="w-full" />
        : null
  }
}

export function WorkflowSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Comment ça marche</h2>
          <p className="text-slate-400 max-w-xl mx-auto">4 étapes pour automatiser votre cabinet — de la facture au bilan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {STEPS.map((step, i) => (
            <div key={step.number} className="group" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex items-start gap-4 mb-4">
                <span className="text-[#00A878] font-bold text-sm mt-1">{step.number}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-xl">{step.icon}</span>
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{step.description}</p>
                </div>
              </div>
              <BrowserFrame className="group-hover:border-[#00A878]/30 transition-colors">
                <StepVisual step={step} />
              </BrowserFrame>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
