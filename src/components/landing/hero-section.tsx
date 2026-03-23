import Link from 'next/link'
import { BrowserFrame } from './browser-frame'
import { DashboardMockup } from './mockups'

const PIPELINE = [
  { icon: '📄', label: 'OCR Facture' },
  { icon: '📒', label: 'Journal PCG' },
  { icon: '🏦', label: 'TVA CA3' },
  { icon: '📊', label: 'Export FEC' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#00A878]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#1B3A6B]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00A878]/[0.06] rounded-full blur-[100px]" />
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[#00A878]/30 bg-[#00A878]/[0.08] text-[#00A878] text-sm font-semibold px-5 py-2 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A878] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A878]" />
            </span>
            L&apos;alternative moderne a Pennylane &amp; Cegid
          </div>

          {/* H1 */}
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Votre cabinet comptable,{' '}
            <span className="bg-gradient-to-r from-[#00A878] to-[#00D4A0] bg-clip-text text-transparent">
              enfin automatise
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
            De la facture fournisseur au rapprochement bancaire, TVA CA3 et
            reporting — tout automatise par l&apos;IA Mistral francaise.{' '}
            <strong className="text-[#00A878] font-semibold">25% moins cher que Pennylane.</strong>
          </p>

          {/* Pipeline */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-10">
            {PIPELINE.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex items-center gap-1.5 text-xs font-medium bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-lg text-slate-300 hover:border-[#00A878]/20 transition-colors">
                  <span>{step.icon}</span>
                  {step.label}
                </span>
                {i < PIPELINE.length - 1 && (
                  <span className="text-[#00A878]/60 text-sm">→</span>
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link href="/signup"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold px-8 py-3.5 rounded-xl text-base transition-all text-center shadow-[0_0_24px_rgba(245,158,11,0.25)] hover:shadow-[0_0_32px_rgba(245,158,11,0.35)]">
              Essai gratuit 14 jours →
            </Link>
            <a href="mailto:contact@worthifast.app?subject=Demande%20de%20demo"
              className="border border-white/[0.15] hover:border-white/30 text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all text-center hover:bg-white/[0.03]">
              Voir la demo
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-xs text-slate-500">
            <span>🔒 Heberge en France</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>🛡 RGPD natif</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>📄 E-invoicing 2026</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span>✓ Sans carte bancaire</span>
          </div>
        </div>

        {/* Mockup */}
        <div className="relative lg:block">
          <div className="relative">
            <div className="absolute -inset-4 bg-[#00A878]/[0.08] rounded-3xl blur-2xl" />
            <BrowserFrame className="relative shadow-2xl shadow-[#00A878]/[0.08] border-[#00A878]/[0.15]">
              <DashboardMockup />
            </BrowserFrame>
          </div>
          {/* Floating badges */}
          <div className="absolute -bottom-3 -left-3 bg-[#00A878] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-[0_0_20px_rgba(0,168,120,0.3)]">
            ✓ OCR traite en 30 secondes
          </div>
          <div className="absolute -top-3 -right-3 bg-[#0D1117] border border-[#00A878]/30 text-[#00A878] text-xs font-bold px-3.5 py-2 rounded-lg shadow-lg">
            E-invoicing 2026 ✓
          </div>
        </div>
      </div>
    </section>
  )
}
