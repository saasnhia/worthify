'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// SOURCE DE VÉRITÉ PRICING — 3 plans Worthifast
// ─────────────────────────────────────────────────────────────

interface PlanData {
  id: string
  name: string
  description: string
  price: number
  annualPrice: number
  features: string[]
  cta: string
  highlight: boolean
  badge?: string
  trial?: string
  note?: string
}

const PLANS: PlanData[] = [
  {
    id: 'decouverte',
    name: 'Découverte',
    description: 'Pour tester sans engagement',
    price: 0,
    annualPrice: 0,
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
    description: 'Pour les cabinets indépendants',
    price: 49,
    annualPrice: 39,
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
    description: 'Pour les cabinets en croissance',
    price: 99,
    annualPrice: 79,
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
]

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

interface PricingPlansProps {
  sectionId?: string
  defaultProfile?: number
  onSubscribe?: (planKey: string, billing: 'monthly' | 'annual') => void
  subscribing?: string | null
}

export function PricingPlans({ sectionId, onSubscribe, subscribing }: PricingPlansProps) {
  const [annual, setAnnual] = useState(false)

  return (
    <section id={sectionId} className="py-24 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Tarifs clairs, sans surprise</h2>
          <p className="text-slate-500 mb-8">38% moins cher que Pennylane. Prix affiché, pas de devis commercial.</p>

          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              Mensuel
            </button>
            <button onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
              Annuel
              <span className="ml-1.5 text-xs font-bold text-emerald-600">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => {
            const billing: 'monthly' | 'annual' = annual ? 'annual' : 'monthly'
            const displayPrice = annual ? plan.annualPrice : plan.price
            const isLoading = subscribing === plan.id
            const useButton = !!onSubscribe && plan.price > 0

            return (
              <div key={plan.id} className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-[#0A1628] text-white border-2 border-emerald-500 shadow-xl'
                  : 'bg-white text-slate-900 border-gray-200'
              }`}>
                {plan.highlight && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>

                  <div className="mt-4">
                    {plan.price === 0 ? (
                      <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>Gratuit</span>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{displayPrice}€</span>
                          <span className={`text-sm mb-1 ${plan.highlight ? 'text-slate-400' : 'text-slate-400'}`}>/mois HT</span>
                        </div>
                        {annual && (
                          <p className={`text-xs mt-1 ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span className="line-through">{plan.price}€</span> → facturé {displayPrice * 12}€/an
                          </p>
                        )}
                        {!annual && (
                          <p className="text-xs text-emerald-500 mt-1">
                            Ou {plan.annualPrice}€/mois en annuel (−20%)
                          </p>
                        )}
                        {plan.trial && (
                          <p className="text-xs text-emerald-500 mt-1">{plan.trial}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1 text-sm">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2.5 ${plan.highlight ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {useButton ? (
                  <button
                    onClick={() => onSubscribe(plan.id, billing)}
                    disabled={!!subscribing}
                    className={`w-full block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                      plan.highlight
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'border border-gray-200 text-slate-700 hover:bg-gray-50'
                    } ${isLoading ? 'opacity-70 cursor-wait' : ''}`}>
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirection vers Stripe…
                      </span>
                    ) : plan.cta}
                  </button>
                ) : (
                  <Link href={plan.price === 0 ? '/signup' : `/signup?plan=${plan.id}&billing=${billing}`}
                    className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                      plan.highlight
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'border border-gray-200 text-slate-700 hover:bg-gray-50'
                    }`}>
                    {plan.cta}
                  </Link>
                )}

                {plan.note && (
                  <p className={`text-xs text-center mt-3 ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>{plan.note}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          {[
            { icon: '🇪🇺', text: 'Hébergé en France' },
            { icon: '🔒', text: 'RGPD conforme' },
            { icon: '🚫', text: 'Sans engagement' },
            { icon: '📞', text: 'Support inclus' },
          ].map(b => (
            <div key={b.text} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-slate-600 font-medium">
              <span>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Tous les prix sont HT — TVA 20% applicable</p>
      </div>
    </section>
  )
}
