import Link from 'next/link'

export function SocialProofSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Beta ouverte &mdash; places limitées
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Rejoignez les premiers cabinets
        </h2>
        <p className="text-slate-300 mb-10 max-w-xl mx-auto">
          Worthifast est en beta ouverte. Les premiers cabinets bénéficient
          d&apos;un accès prioritaire, de tarifs préférentiels et d&apos;une influence
          directe sur les prochaines fonctionnalités.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: '🎯', title: 'Tarif fondateur', desc: 'Prix bloqué à vie — pas de hausse future' },
            { icon: '🛠️', title: 'Influence produit', desc: 'Vos retours façonnent les prochaines features' },
            { icon: '⚡', title: 'Onboarding dédié', desc: 'Migration Cegid/Pennylane accompagnée' },
          ].map(item => (
            <div key={item.title} className="bg-[#0F1117] border border-white/[0.08] rounded-xl p-6 text-left">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/signup" className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold px-8 py-3.5 rounded-xl text-base transition-colors">
          Rejoindre la beta →
        </Link>
        <p className="text-xs text-slate-500 mt-3">Sans carte bancaire · Annulable à tout moment</p>
      </div>
    </section>
  )
}
