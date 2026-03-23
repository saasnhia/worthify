import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#F59E0B]/[0.08] rounded-full blur-[150px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#050509] to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold text-white mb-4">
          Automatisez votre cabinet des aujourd&apos;hui
        </h2>
        <p className="text-slate-300 text-lg mb-8">
          14 jours d&apos;essai gratuit. Sans carte bancaire. Sans engagement.
          <br />
          <span className="text-[#00A878] font-semibold">25% moins cher que Pennylane.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/signup"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-[0_0_32px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]">
            Demarrer l&apos;essai gratuit →
          </Link>
          <a href="mailto:contact@worthifast.app?subject=Demande%20de%20demo"
            className="border border-white/[0.15] hover:border-white/30 text-white px-10 py-4 rounded-xl text-lg transition-all text-center hover:bg-white/[0.03]">
            Planifier une demo
          </a>
        </div>
        <p className="text-sm text-slate-500">
          Rejoint par les premiers cabinets beta · Heberge en France · RGPD conforme
        </p>
      </div>
    </section>
  )
}
