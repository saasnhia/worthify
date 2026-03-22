import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B3A6B]/20 via-[#080810] to-[#00A878]/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#F59E0B]/10 rounded-full blur-[150px]" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold text-white mb-4">
          Automatisez votre cabinet dès aujourd&apos;hui
        </h2>
        <p className="text-slate-300 text-lg mb-8">
          14 jours d&apos;essai gratuit. Sans carte bancaire. Sans engagement.
          <br />
          <span className="text-[#00A878]">25% moins cher que Pennylane.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/signup" className="bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold px-10 py-4 rounded-xl text-lg transition-colors">
            Démarrer l&apos;essai gratuit →
          </Link>
          <a href="mailto:contact@worthifast.app?subject=Demande%20de%20demo" className="border border-white/20 hover:border-white/40 text-white px-10 py-4 rounded-xl text-lg transition-colors text-center">
            Planifier une démo
          </a>
        </div>
        <p className="text-sm text-slate-500">
          Rejoint par les premiers cabinets beta · Hébergé en France · RGPD conforme
        </p>
      </div>
    </section>
  )
}
