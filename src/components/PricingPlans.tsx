'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// SOURCE DE VÉRITÉ PRICING — 4 plans Worthifast (trial-led)
// Zéro plan gratuit permanent. 14j essai sur tous les plans,
// puis read-only post-trial (données visibles, mutations bloquées).
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
  isContact?: boolean
}

const PLANS: PlanData[] = [
  {
    id: 'solo',
    name: 'Solo',
    description: 'Pour les indépendants et petits cabinets',
    price: 29,
    annualPrice: 23,
    features: [
      '1 utilisateur · 15 dossiers',
      'OCR 50 factures/mois (Mistral IA)',
      'Journal PCG + Grand livre + TVA CA3',
      'Export FEC · E-invoicing 2026',
      '1 Agent IA personnalisable',
      'Support email 48h',
    ],
    cta: 'Essai 14j gratuit',
    highlight: false,
    trial: '14 jours gratuits',
  },
  {
    id: 'cabinet',
    name: 'Cabinet',
    description: 'Pour les cabinets indépendants',
    price: 59,
    annualPrice: 47,
    features: [
      '3 utilisateurs · 45 dossiers',
      'OCR illimité',
      'Tout Solo +',
      'Rapprochement bancaire',
      'Portail client',
      'Relances automatiques',
      '3 Agents IA personnalisables',
      'Dashboard KPIs cabinet',
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
      '10 utilisateurs · Dossiers illimités',
      'OCR illimité',
      'Tout Cabinet +',
      'Agents IA illimités',
      'API + webhooks',
      'Multi-cabinets',
      'Intégrations Cegid/Sage (roadmap)',
      'Support prioritaire',
      'Paie (roadmap Q3 2026)',
    ],
    cta: 'Essai 14j gratuit',
    highlight: false,
    trial: '14 jours gratuits',
  },
  {
    id: 'sur_mesure',
    name: 'Sur Mesure',
    description: 'Grands cabinets et besoins spécifiques',
    price: 0,
    annualPrice: 0,
    features: [
      '+10 utilisateurs',
      'SLA dédié',
      'Migration accompagnée',
    ],
    cta: 'Nous contacter →',
    highlight: false,
    isContact: true,
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Tarifs clairs, sans surprise</h2>
          <p className="text-slate-500 mb-8">25% moins cher que Pennylane dès le plan Cabinet. 14 jours d&apos;essai gratuit sur tous les plans.</p>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(plan => {
            const billing: 'monthly' | 'annual' = annual ? 'annual' : 'monthly'
            const displayPrice = annual ? plan.annualPrice : plan.price
            const isLoading = subscribing === plan.id
            const useButton = !!onSubscribe && !plan.isContact && plan.price > 0

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
                    {plan.isContact ? (
                      <span className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>Sur devis</span>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{displayPrice}€</span>
                          <span className="text-sm text-slate-400 mb-1">/mois HT</span>
                        </div>
                        {annual && plan.price > 0 && (
                          <p className="text-xs text-slate-400 mt-1">
                            <span className="line-through">{plan.price}€</span> → facturé {displayPrice * 12}€/an
                          </p>
                        )}
                        {!annual && plan.price > 0 && (
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

                {plan.isContact ? (
                  <a href="mailto:contact@worthifast.app?subject=Demande%20plan%20sur%20mesure"
                    className="block text-center py-3 px-4 rounded-xl font-semibold text-sm border border-gray-200 text-slate-700 hover:bg-gray-50 transition-colors">
                    {plan.cta}
                  </a>
                ) : useButton ? (
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
                  <Link href={`/signup?plan=${plan.id}&billing=${billing}`}
                    className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-colors ${
                      plan.highlight
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'border border-gray-200 text-slate-700 hover:bg-gray-50'
                    }`}>
                    {plan.cta}
                  </Link>
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
        <p className="text-center text-xs text-slate-400 mt-4">
          Tous les prix sont HT — TVA 20% applicable · Après l&apos;essai, vos données restent accessibles en lecture seule
        </p>
      </div>
    </section>
  )
}
