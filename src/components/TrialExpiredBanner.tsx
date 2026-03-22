'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export function TrialExpiredBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .maybeSingle()

      const status = profile?.subscription_status
      if (status && status !== 'active' && status !== 'trial') {
        setShow(true)
      }
    })()
  }, [])

  if (!show) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Votre essai a expiré</strong> — vos données sont conservées en lecture seule.
          </span>
        </div>
        <Link
          href="/pricing"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Choisir un plan →
        </Link>
      </div>
    </div>
  )
}
