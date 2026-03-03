'use client'

import { useEffect, useState } from 'react'
import { Header, Footer } from '@/components/layout'
import { Info } from 'lucide-react'
import { PricingPlans } from '@/components/PricingPlans'

export default function PricingPage() {
  const [subscriptionRequired, setSubscriptionRequired] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('message') === 'subscription_required') {
        setSubscriptionRequired(true)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {subscriptionRequired && (
          <div className="bg-emerald-600 text-white py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
              <Info className="w-4 h-4 flex-shrink-0" />
              Bienvenue sur FinSoft&nbsp;! Choisissez votre plan pour accéder à votre espace.
            </div>
          </div>
        )}

        <PricingPlans defaultProfile={3} />
      </main>

      <Footer />
    </div>
  )
}
