'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    price: 29,
    description: 'Pour les independants et petits cabinets',
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
    price: 59,
    description: 'Pour les cabinets independants',
    features: [
      '3 utilisateurs · 45 dossiers',
      'OCR illimite',
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
    priceComparison: '25% moins cher que Pennylane',
  },
  {
    id: 'cabinet_pro',
    name: 'Cabinet Pro',
    price: 99,
    description: 'Pour les cabinets en croissance',
    features: [
      '10 utilisateurs · Dossiers illimites',
      'OCR illimite',
      'Tout Cabinet +',
      'Agents IA illimites',
      'API + webhooks',
      'Multi-cabinets',
      'Integrations Cegid/Sage (roadmap)',
      'Support prioritaire',
    ],
    cta: 'Essai 14j gratuit',
    highlight: false,
    trial: '14 jours gratuits',
  },
  {
    id: 'sur_mesure',
    name: 'Sur Mesure',
    price: -1,
    description: 'Grands cabinets et besoins specifiques',
    features: [
      '+10 utilisateurs',
      'SLA dedie',
      'Migration accompagnee',
    ],
    cta: 'Nous contacter →',
    highlight: false,
    isContact: true,
  },
] as const

const PRICING_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    { "@type": "Offer", "name": "Solo", "price": "29", "priceCurrency": "EUR", "description": "1 utilisateur, 15 dossiers, OCR 50/mois, 1 Agent IA" },
    { "@type": "Offer", "name": "Cabinet", "price": "59", "priceCurrency": "EUR", "description": "3 utilisateurs, 45 dossiers, OCR illimite, portail, 3 Agents IA" },
    { "@type": "Offer", "name": "Cabinet Pro", "price": "99", "priceCurrency": "EUR", "description": "10 utilisateurs, dossiers illimites, API, Agents IA illimites" },
  ],
}

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  const maxSaving = Math.round(99 * 12 * 0.2)

  return (
    <section id="pricing" className="py-24 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_SCHEMA) }} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Tarifs clairs, sans surprise</h2>
          <p className="text-slate-400 mb-8">25% moins cher que Pennylane des le plan Cabinet. 14 jours d&apos;essai gratuit sur tous les plans.</p>

          <div className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
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

          {annual && (
            <p className="text-xs text-[#00A878] mt-3 font-medium">
              Economisez jusqu&apos;a {maxSaving} EUR/an avec le plan annuel
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(plan => {
            const isContact = 'isContact' in plan && plan.isContact
            const displayPrice = !isContact && plan.price > 0 && annual ? Math.round(plan.price * 0.8) : plan.price
            return (
              <div key={plan.id} className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-200 hover:-translate-y-0.5 ${
                plan.highlight
                  ? 'bg-[#0D1117] border-[#00A878]/30 shadow-[0_0_30px_rgba(0,168,120,0.08)]'
                  : 'bg-[#0D1117] border-white/[0.07] hover:border-white/[0.12]'
              }`}>
                {plan.highlight && 'badge' in plan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00A878] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-[0_0_16px_rgba(0,168,120,0.3)]">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.description}</p>

                  <div className="mt-4">
                    {isContact ? (
                      <span className="text-3xl font-extrabold text-white">Sur devis</span>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-extrabold text-white">{displayPrice}EUR</span>
                          <span className="text-sm text-slate-400 mb-1">/mois HT</span>
                        </div>
                        {annual && (
                          <p className="text-xs text-slate-500 mt-1">
                            <span className="line-through">{plan.price}EUR</span> → facture {displayPrice * 12}EUR/an
                          </p>
                        )}
                        {'trial' in plan && plan.trial && (
                          <p className="text-xs text-[#00A878] mt-1">{plan.trial}</p>
                        )}
                        {'priceComparison' in plan && plan.priceComparison && (
                          <p className="text-[10px] text-[#F59E0B] font-semibold mt-1.5 bg-[#F59E0B]/[0.08] border border-[#F59E0B]/20 inline-block px-2 py-0.5 rounded-full">
                            {plan.priceComparison}
                          </p>
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

                {isContact ? (
                  <a href="mailto:contact@worthifast.app?subject=Demande%20plan%20sur%20mesure"
                    className="block text-center py-3 px-4 rounded-xl font-semibold text-sm border border-white/[0.15] text-white hover:border-white/30 hover:bg-white/[0.03] transition-all">
                    {plan.cta}
                  </a>
                ) : (
                  <Link href={`/signup?plan=${plan.id}&billing=${annual ? 'annual' : 'monthly'}`}
                    className={`block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                      plan.highlight
                        ? 'bg-[#F59E0B] hover:bg-[#D97706] text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : 'border border-white/[0.15] text-white hover:border-white/30 hover:bg-white/[0.03]'
                    }`}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Guarantees */}
        <div className="text-center mt-8 space-y-3">
          <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-slate-500">
            <span>🔒 14 jours satisfait ou rembourse</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>Resiliation en 1 clic</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>Donnees exportables</span>
          </div>
          <p className="text-xs text-slate-600">
            Tous les prix sont HT — TVA 20% applicable · Apres l&apos;essai, vos donnees restent accessibles en lecture seule
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Pas sur de quel plan choisir ?{' '}
            <a href="mailto:contact@worthifast.app?subject=Demande%20de%20demo" className="text-[#00A878] hover:underline font-medium">
              Planifiez une demo personnalisee →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
