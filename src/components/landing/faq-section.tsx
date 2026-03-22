'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ = [
  {
    q: "Worthifast remplace-t-il complètement Pennylane ou Cegid ?",
    a: "Worthifast couvre les fonctionnalités core des cabinets : OCR, journal PCG, TVA CA3, rapprochement bancaire, FEC et e-invoicing. Pour les modules très spécifiques (paie complète, ERP avancé), des intégrations sont prévues au roadmap Q3 2026."
  },
  {
    q: "Puis-je migrer mes données depuis Cegid ou Sage ?",
    a: "Oui. Worthifast propose une migration accompagnée depuis Cegid Loop et Sage via notre module d'import. Notre équipe vous accompagne pendant l'onboarding. La migration prend généralement 1 à 3 jours selon le volume."
  },
  {
    q: "Worthifast est-il conforme à la réforme e-invoicing 2026 ?",
    a: "Oui. Worthifast génère nativement des factures au format Factur-X (EN16931), le standard de la réforme française obligatoire à partir de 2026. Cette conformité est incluse dans tous les plans, y compris le plan Découverte gratuit."
  },
  {
    q: "Combien de dossiers clients puis-je gérer avec le plan Cabinet ?",
    a: "Le plan Cabinet inclut 45 dossiers clients actifs simultanément, ce qui couvre la grande majorité des cabinets indépendants. Pour les structures gérant plus de 45 dossiers, le plan Cabinet Pro offre des dossiers illimités à 99€/mois."
  },
  {
    q: "Mes données sont-elles hébergées en France ?",
    a: "Oui. Worthifast est entièrement hébergé en France sur infrastructure française. L'IA utilisée est Mistral AI, entreprise française basée à Paris. Vos données comptables ne quittent jamais l'Union Européenne, en conformité totale avec le RGPD."
  },
  {
    q: "Que se passe-t-il après les 14 jours d'essai ?",
    a: "Après 14 jours, votre compte passe automatiquement sur le plan Découverte gratuit si vous ne souscrivez pas. Vous conservez vos données et pouvez continuer à utiliser Worthifast gratuitement avec les limites du plan Découverte (5 dossiers, 10 factures OCR/mois)."
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans frais ni préavis. Résiliez depuis votre tableau de bord en 1 clic. Vous conservez l'accès jusqu'à la fin de la période payée, puis votre compte revient sur le plan Découverte gratuit."
  },
]

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ.map(item => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": { "@type": "Answer", "text": item.a },
  })),
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Questions fréquentes</h2>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-colors">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
