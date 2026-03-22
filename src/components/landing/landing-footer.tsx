import Link from 'next/link'
import Image from 'next/image'

export function LandingFooter() {
  return (
    <footer className="bg-[#060912] text-slate-500 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/worthifast-logo-white.svg" alt="Worthifast — Logiciel comptable" width={140} height={34} className="h-8 w-auto" />
            </div>
            <p className="text-sm max-w-xs leading-relaxed">
              La solution comptable intelligente pour les cabinets d&apos;expertise comptable et PME françaises.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-[#00A878] font-medium">
              <span>🇪🇺</span>
              Hébergé en France — RGPD conforme
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Essai gratuit</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Se connecter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><a href="mailto:contact@worthifast.app" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/cgv" className="hover:text-white transition-colors">CGV</Link></li>
              <li><Link href="/legal/cgu" className="hover:text-white transition-colors">CGU</Link></li>
              <li><Link href="/legal/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité RGPD</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-slate-600">
            <span>RGPD</span>
            <span>·</span>
            <span>E-invoicing 2026</span>
            <span>·</span>
            <span>Mistral AI 🇫🇷</span>
            <span>·</span>
            <span>Hébergé en France</span>
          </div>
          <p className="text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Worthifast — SAS NBHC · contact@worthifast.app
          </p>
        </div>
      </div>
    </footer>
  )
}
