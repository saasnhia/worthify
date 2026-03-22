'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const PLANS = [
  {
    id: 'decouverte',
    name: 'Découverte',
    price: 0,
    description: 'Pour tester sans engagement',
    features: [
      'Journal comptable',
      'Grand livre',
      'OCR 10 factures/mois',
      '5 dossiers clients',
      '1 utilisateur',
    ],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    id: 'cabinet',
    name: 'Cabinet',
    price: 49,
    description: 'Pour les cabinets indépendants',
    features: [
      'Tout Découverte +',
      '45 dossiers clients',
      'OCR illimité (Mistral IA)',
      'TVA CA3 automatique',
      'Rapprochement bancaire',
      'Export FEC DGFiP',
      'E-invoicing Factur-X 2026',
      "Jusqu'à 5 utilisateurs",
      'Support email 24h',
    ],
    cta: 'Essai 14j gratuit',
    highlight: true,
    badge: 'Le plus populaire',
    trial: '14 jours gratuits',
  },
  {
    id: 'cabinet_pro',
    name: 'Cabinet Pro',
    price: 99,
    description: 'Pour les cabinets en croissance',
    features: [
      'Tout Cabinet +',
      'Dossiers illimités',
      "Jusqu'à 10 utilisateurs",
      'API + webhooks',
      'Multi-cabinets',
      'Support prioritaire',
      'Paie (roadmap Q3 2026)',
    ],
    cta: 'Essai 14j gratuit',
    highlight: false,
    note: '+10 utilisateurs → tarif sur mesure',
  },
] as const

const PRICING_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": PLANS.map(p => ({
    "@type": "Offer",
    "name": p.name,
    "price": String(p.price),
    "priceCurrency": "EUR",
    "description": p.description,
  })),
}

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_SCHEMA) }} />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Tarifs clairs, sans surprise</h2>
          <p className="text-slate-400 mb-8">38% moins cher que Pennylane. Prix affiché, pas de devis commercial.</p>

          <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!annual ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
              Mensuel
            </button>
            <button onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${annual ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>
              Annuel
              <span className="ml-1.5 text-xs font-bold text-[#00A878]">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const displayPrice = annual && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price
            return (
              <div key={plan.id} className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-[#0F1117] border-[#00A878]/40 shadow-lg shadow-[#00A878]/10'
                  : 'bg-[#0F1117] border-white/[0.08]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00A878] text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>

                  <div className="mt-4">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-extrabold text-white">Gratuit</span>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-extrabold text-white">{displayPrice}€</span>
                          <span className="text-sm text-slate-400 mb-1">/mois HT</span>
                        </div>
                        {annual && (
                          <p className="text-xs text-slate-500 mt-1">
                            <span className="line-through">{plan.price}€</span> → facturé {displayPrice * 12}€/an
                          </p>
                        )}
                        {'trial' in plan && plan.trial && (
                          <p className="text-xs text-[#00A878] mt-1">{plan.trial}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#00A878] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={plan.price === 0 ? '/signup' : `/signup?plan=${plan.id}&billing=${annual ? 'annual' : 'monthly'}`}
                  className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-[#F59E0B] hover:bg-[#D97706] text-black'
                      : 'border border-white/20 text-white hover:border-white/40'
                  }`}>
                  {plan.cta}
                </Link>

                {'note' in plan && plan.note && (
                  <p className="text-xs text-slate-500 text-center mt-3">{plan.note}</p>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          💬 +10 utilisateurs ou besoins spécifiques ?{' '}
          <a href="mailto:contact@worthifast.app" className="text-[#00A878] hover:underline">Contactez-nous →</a>
        </p>
        <p className="text-center text-xs text-slate-600 mt-2">Tous les prix sont HT — TVA 20% applicable</p>
      </div>
    </section>
  )
}
