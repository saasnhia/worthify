'use client'

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { DossierProvider } from '@/contexts/DossierContext'
import { CommandPalette } from '@/components/CommandPalette'
import { CommandPaletteContext } from '@/lib/search/use-command-palette'
import { TrialExpiredBanner } from '@/components/TrialExpiredBanner'

interface AppShellProps {
  children: React.ReactNode
}

/**
 * Main application shell: Header (top) + Sidebar (left) + Content.
 * Use this as a wrapper for all authenticated pages instead of standalone <Header />.
 */
export function AppShell({ children }: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <DossierProvider>
      <CommandPaletteContext.Provider value={{ open: commandOpen, setOpen: setCommandOpen }}>
        <div className="min-h-screen bg-navy-50">
          <TrialExpiredBanner />
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
          <CommandPalette />
        </div>
      </CommandPaletteContext.Provider>
    </DossierProvider>
  )
}
