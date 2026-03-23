import Link from 'next/link'

const TRUST_SIGNALS = [
  'Code source TypeScript strict',
  '35 migrations Supabase verifiees',
  '120 endpoints API documentes',
  'RGPD : donnees jamais transmises a des tiers',
  'Heberge en France (AWS eu-west)',
]

const TECH_STACK = [
  { name: 'Mistral AI', color: '#00A878' },
  { name: 'Supabase', color: '#3ECF8E' },
  { name: 'Vercel', color: '#FFFFFF' },
  { name: 'Tesseract', color: '#3B82F6' },
  { name: 'Factur-X', color: '#F59E0B' },
]

export function SocialProofSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#F59E0B]/30 bg-[#F59E0B]/[0.08] text-[#F59E0B] text-sm font-semibold px-5 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
            </span>
            Beta ouverte — places limitees
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pourquoi nous faire confiance ?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Pas de faux temoignages ni de metrics gonfles. Voici ce que Worthifast est reellement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Beta info + Founder */}
          <div className="space-y-6">
            {/* Beta card */}
            <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                {/* Stacked avatars */}
                <div className="flex -space-x-2">
                  {['MF', 'JD', 'PL', 'AC'].map((initials, i) => (
                    <div key={initials}
                      className="w-8 h-8 rounded-full border-2 border-[#0D1117] flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: ['#00A878', '#3B82F6', '#F59E0B', '#8B5CF6'][i] + '30', color: ['#00A878', '#3B82F6', '#F59E0B', '#8B5CF6'][i], zIndex: 4 - i }}>
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-300 font-medium">Premiers cabinets en test</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Rejoignez les fondateurs</h3>
              <p className="text-sm text-slate-400 mb-4">
                Les premiers cabinets beneficient du tarif fondateur — prix bloque a vie, influence produit directe,
                et onboarding personnalise avec migration Cegid/Pennylane accompagnee.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '🎯', title: 'Tarif fondateur', desc: 'Prix bloque a vie' },
                  { icon: '🛠️', title: 'Influence produit', desc: 'Vos retours = features' },
                  { icon: '⚡', title: 'Onboarding dedie', desc: 'Migration accompagnee' },
                ].map(item => (
                  <div key={item.title} className="bg-white/[0.03] rounded-lg p-3">
                    <div className="text-lg mb-1">{item.icon}</div>
                    <p className="text-xs font-semibold text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder quote */}
            <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A878]/30 to-[#1B3A6B]/30 flex items-center justify-center text-sm font-bold text-[#00A878] flex-shrink-0">
                  HC
                </div>
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed italic mb-3">
                    &ldquo;Les logiciels comptables coutent trop cher et n&apos;innovent pas.
                    J&apos;ai construit Worthifast pour prouver qu&apos;on peut faire mieux,
                    moins cher, et avec une IA hebergee en France.&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-white">Haroun Chikh</p>
                    <p className="text-xs text-slate-500">Fondateur · Etudiant L3 IAE Dijon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Trust signals + Tech stack */}
          <div className="space-y-6">
            {/* Trust signals */}
            <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Garanties techniques</h3>
              <ul className="space-y-3">
                {TRUST_SIGNALS.map(signal => (
                  <li key={signal} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00A878]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#00A878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300">{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div className="bg-[#0D1117] border border-white/[0.07] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Construit avec les meilleures technologies</h3>
              <p className="text-xs text-slate-500 mb-4">Pas un assemblage de briques tierces — une plateforme integree.</p>
              <div className="flex items-center gap-3 flex-wrap">
                {TECH_STACK.map(tech => (
                  <div key={tech.name}
                    className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="text-xs font-medium text-slate-300">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Docker self-hosted */}
            <div className="bg-gradient-to-r from-[#00A878]/[0.06] to-transparent border border-[#00A878]/[0.15] rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🐳</span>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Self-hosted disponible</h3>
                  <p className="text-xs text-slate-400">
                    Docker Compose complet — PostgreSQL, Auth, IA locale (Ollama).
                    Vos donnees restent dans votre infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/signup"
            className="inline-block bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold px-8 py-3.5 rounded-xl text-base transition-all shadow-[0_0_24px_rgba(245,158,11,0.25)]">
            Rejoindre la beta →
          </Link>
          <p className="text-xs text-slate-500 mt-3">Sans carte bancaire · Annulable a tout moment</p>
        </div>
      </div>
    </section>
  )
}
