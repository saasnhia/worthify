import Link from 'next/link'
import { BrowserFrame } from './browser-frame'
import { DashboardMockup } from './mockups'

const PIPELINE = ['OCR Facture', 'Journal PCG', 'TVA CA3', 'Export FEC']

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#1B3A6B]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00A878]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 border border-[#00A878]/30 bg-[#00A878]/10 text-[#00A878] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            L&apos;alternative moderne à Pennylane &amp; Cegid
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Votre cabinet comptable,{' '}
            <span className="text-[#F59E0B]">enfin automatisé</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
            De la facture fournisseur au rapprochement bancaire, TVA CA3 et
            reporting — tout automatisé par l&apos;IA Mistral française.{' '}
            <strong className="text-white">38% moins cher que Pennylane.</strong>
          </p>

          <div className="flex items-center gap-2 flex-wrap mb-8">
            {PIPELINE.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="text-xs font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300">
                  {step}
                </span>
                {i < PIPELINE.length - 1 && (
                  <span className="text-[#00A878]">→</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link href="/signup" className="bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold px-8 py-3.5 rounded-xl text-base transition-colors text-center">
              Essai gratuit 14 jours →
            </Link>
            <a href="mailto:contact@worthifast.app?subject=Demande%20de%20demo" className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl text-base transition-colors text-center">
              Voir la démo
            </a>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            {['⚡ Hébergé en France', '🔒 RGPD natif', '📄 E-invoicing 2026', '✓ Sans carte bancaire'].map(badge => (
              <span key={badge} className="text-xs text-slate-400">{badge}</span>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <BrowserFrame className="shadow-2xl shadow-[#1B3A6B]/20">
            <DashboardMockup />
          </BrowserFrame>
          <div className="absolute -bottom-4 -left-4 bg-[#00A878] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg">
            ✓ OCR traité en 30 secondes
          </div>
        </div>
      </div>
    </section>
  )
}
