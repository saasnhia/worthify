import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL('https://worthifast.vercel.app'),
  title: 'Worthifast — Comptabilité automatisée pour cabinets',
  description: 'Comptabilité automatisée pour cabinets comptables. OCR factures, journal PCG, TVA CA3, rapprochement bancaire. Dès 29€/mois. Hébergé en France, RGPD natif.',
  keywords: ['comptabilité', 'OCR factures', 'cabinet comptable', 'TVA CA3', 'rapprochement bancaire', 'PME', 'RGPD', 'e-invoicing 2026', 'Factur-X', 'Worthifast'],
  authors: [{ name: 'Worthifast' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/images/worthifast-logo.svg',
  },
  openGraph: {
    title: 'Worthifast — Comptabilité automatisée pour cabinets',
    description: 'Comptabilité automatisée pour cabinets comptables. OCR factures, journal PCG, TVA CA3, rapprochement bancaire. Dès 29€/mois. Hébergé en France, RGPD natif.',
    type: 'website',
    locale: 'fr_FR',
    images: ['/images/worthifast-logo.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-body antialiased">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {children}
      </body>
    </html>
  )
}
