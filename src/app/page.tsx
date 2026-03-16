'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, ChevronDown, ArrowRight, ScanLine, ArrowRightLeft,
  Users2, Bell, Menu, Shield, Zap, X as XIcon,
  Scale, Euro, TrendingUp, Wrench, Play, Sparkles,
  FileText, BookOpen, Receipt, Send,
} from 'lucide-react'
import { ScreenshotCarousel } from '@/components/ScreenshotCarousel'
import { PricingPlans } from '@/components/PricingPlans'
import { ComparatifSection } from '@/components/ComparatifSection'
import { FloatingOrbs } from '@/components/landing/FloatingOrbs'
import { FeatureCard } from '@/components/landing/FeatureCards'
import { useHeroAnimation, useScrollAnimations } from '@/components/landing/HeroAnimations'


// ─────────────────────────────────────────────────────────────
// PIPELINE
// ─────────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  { icon: ScanLine, label: 'OCR Facture' },
  { icon: BookOpen, label: 'Journal PCG' },
  { icon: Receipt, label: 'TVA CA3' },
  { icon: Send, label: 'Envoi client' },
]

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const FEATURES: { icon: typeof ScanLine; color: 'emerald' | 'cyan' | 'violet'; title: string; desc: string }[] = [
  { icon: ScanLine, color: 'emerald', title: 'OCR intelligent', desc: 'Scannez une facture, Worthifast extrait fournisseur, montants, TVA et classe automatiquement en PCG.' },
  { icon: ArrowRightLeft, color: 'emerald', title: 'Rapprochement IA', desc: "L'IA apprend vos habitudes de lettrage et rapproche factures et relevés bancaires automatiquement." },
  { icon: Scale, color: 'cyan', title: 'Conformité française native', desc: 'TVA CA3 automatique, export FEC certifié, assistant PCG & BOFIP avec références contextualisées.' },
  { icon: Zap, color: 'cyan', title: 'E-invoicing 2026 prêt', desc: "Factur-X natif, norme EN16931, validation des 16 champs obligatoires DGFiP. Prêt pour l'obligation." },
  { icon: Users2, color: 'violet', title: 'Portail client sécurisé', desc: 'Zéro email, zéro pièce jointe. Vos clients déposent leurs documents dans un espace dédié.' },
  { icon: Bell, color: 'violet', title: 'Relances automatiques', desc: 'Impayés détectés et relancés en J+7, J+15, J+30. Configurable par client et par seuil.' },
  { icon: Euro, color: 'emerald', title: 'Prix transparent', desc: "Dossiers illimités dès le plan Cabinet. Pas de facturation à l'utilisateur ni au dossier." },
  { icon: TrendingUp, color: 'cyan', title: 'IA française intégrée', desc: 'Assistant entraîné sur le PCG, BOFIP et CGI. Données traitées en Europe, conforme RGPD.' },
  { icon: Wrench, color: 'violet', title: 'Construit avec des comptables', desc: "Développé avec le département Comptabilité-Finance de l'IAE Dijon. Validé par des praticiens." },
]

const FAQ_ITEMS: { q: string; r: string; cta?: { text: string; href: string } }[] = [
  { q: 'Worthifast est-il conforme RGPD ?', r: "Oui. Notre infrastructure utilise des serveurs européens certifiés. Aucune donnée n'est transmise à des tiers sans votre consentement. Worthifast est conforme au RGPD et utilise des modèles IA hébergés en Europe." },
  { q: 'Vous utilisez Sage ou Cegid ?', r: "Les connecteurs Cegid (OAuth2) et Sage (via Chift) sont développés et en cours de déploiement (T2 2026). En attendant, vous pouvez migrer via import FEC. Ce qui est repris : plan comptable personnalisé, balances N-1. Immobilisations : import CSV, migration accompagnée sur demande. Notre équipe vous guide étape par étape.", cta: { text: 'Parler de ma migration \u2192', href: 'mailto:contact@worthifast.app?subject=Migration Sage' } },
  { q: "Comment fonctionne l'essai gratuit ?", r: "Vous créez votre compte sans carte bancaire. Accès complet pendant 30 jours. À l'issue de la période d'essai, l'accès est suspendu sauf souscription à un abonnement payant. Vous pouvez résilier à tout moment en 1 clic depuis vos paramètres." },
  { q: "Qu'est-ce que l'e-invoicing 2026 ?", r: "À partir de 2026, la facturation électronique sera obligatoire entre entreprises françaises. Worthifast vous prépare dès maintenant avec le format Factur-X et le statut d'Opérateur de Dématérialisation." },
  { q: "Puis-je annuler mon abonnement à tout moment ?", r: "Absolument. Pas d'engagement, pas de frais de résiliation. Résiliez en 1 clic depuis vos paramètres. Vous pouvez exporter toutes vos données à tout moment au format standard (FEC, CSV, PDF)." },
  { q: "Quelles fonctionnalités arrivent prochainement ?", r: "Lettrage avancé, gestion multi-exercice et télédéclaration EDI-TDFC sont prévus pour T3 2026. Vous voulez influencer nos priorités ? Parlez-nous directement.", cta: { text: 'Partager mon retour \u2192', href: 'mailto:contact@worthifast.app?subject=Roadmap Worthifast' } },
]

const CREDIBILITY_BADGES = [
  '\uD83C\uDF93 IAE Dijon \u2014 \u00C9cole de Management',
  '\uD83D\uDCCB Valid\u00E9 par des enseignants-chercheurs en comptabilit\u00E9',
  '\uD83C\uDDEA\uD83C\uDDFA Donn\u00E9es h\u00E9berg\u00E9es en Europe \u00B7 Conforme RGPD',
  '\u2705 Conforme e-invoicing 2026 (Factur-X / EN16931)',
]

const STATS = [
  { value: 95, suffix: '%', label: "Précision OCR" },
  { value: 3, suffix: 'h', label: "Gagnées / semaine" },
  { value: 45, suffix: '', label: "Dossiers en 1 écran" },
  { value: 30, suffix: 'j', label: "Essai gratuit" },
]

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [contactForm, setContactForm] = useState({ nom: '', cabinet: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // GSAP animations
  useHeroAnimation()
  useScrollAnimations()

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch('/api/contact/cabinet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      setSent(true)
    } catch { /* silent */ } finally { setSending(false) }
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-[#080810]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-white.svg" alt="Worthifast" width={140} height={34} priority className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/about" className="hover:text-white transition-colors">À propos</Link>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Se connecter
            </Link>
            <Link href="/signup"
              className="group relative px-5 py-2.5 text-sm font-bold rounded-xl text-slate-900 overflow-hidden transition-all">
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-all group-hover:scale-105" />
              <span className="relative">Essai gratuit</span>
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-400" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-[#080810] px-4 py-4 space-y-3"
          >
            {[
              { href: '#features', label: 'Fonctionnalités' },
              { href: '#pricing', label: 'Tarifs' },
              { href: '#faq', label: 'FAQ' },
              { href: '/about', label: 'À propos' },
              { href: '#contact', label: 'Contact' },
            ].map(item => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenu(false)}
                className="block text-sm font-medium text-slate-300 py-1">
                {item.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center px-4 py-2 border border-white/10 rounded-xl text-sm font-medium text-slate-300">Se connecter</Link>
              <Link href="/signup" className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl text-sm font-bold text-slate-900">Essai gratuit</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── HERO — Screenshot Background ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#080810]">
        {/* Screenshot feature clé en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/screenshots/dashboard1.png"
            alt=""
            fill
            className="object-cover object-top opacity-20 scale-110"
            priority
          />
          {/* Overlay gradient multi-couche */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080810]/60 via-[#080810]/40 to-[#080810]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080810]/80 via-transparent to-[#080810]/80" />
          {/* Glow amber centre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        {/* CSS Orbs par-dessus */}
        <FloatingOrbs />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02] z-[2]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 container mx-auto text-center px-4">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 text-amber-400 text-sm mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            L&apos;alternative moderne à Cegid &amp; Sage
          </div>

          {/* H1 */}
          <h1 className="hero-h1 text-6xl md:text-8xl font-black text-white mb-6 leading-none">
            Votre cabinet<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              automatisé
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            OCR factures &rarr; Journal PCG automatique &rarr; 45 clients en 1 écran &rarr; Export CA3 légal.
            <br className="hidden sm:block" />
            <span className="font-semibold text-amber-400">3h/semaine gagnées</span> vs Cegid. Hébergé en France, conforme RGPD.
          </p>

          {/* Pipeline steps */}
          <div className="hero-pipeline flex items-center justify-center gap-3 mb-10 flex-wrap">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={i} className="step flex items-center gap-3">
                <span className="bg-gray-800 border border-amber-500/20 rounded-lg px-3 py-1.5 text-sm text-gray-300 flex items-center gap-1.5">
                  <step.icon className="w-4 h-4 text-amber-400" />
                  {step.label}
                </span>
                {i < PIPELINE_STEPS.length - 1 && <span className="text-amber-500/50">&rarr;</span>}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup"
              className="hero-cta-primary group relative flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-5 text-lg rounded-2xl shadow-2xl shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/50 hover:-translate-y-1">
              Essai gratuit 30 jours
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="mailto:contact@worthifast.app?subject=Demande%20de%20demo%20Worthifast"
              className="hero-cta-secondary group flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/5 px-10 py-5 text-lg rounded-2xl transition-all">
              <Play className="w-4 h-4 text-amber-400" />
              Demander une démo
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {[
              { icon: <span className="text-base">🇫🇷</span>, text: 'Hébergé en France' },
              { icon: <Zap className="w-4 h-4 text-amber-500" />, text: 'Sans carte bancaire' },
              { icon: <Shield className="w-4 h-4 text-amber-500" />, text: 'RGPD natif' },
              { icon: <FileText className="w-4 h-4 text-amber-500" />, text: 'E-invoicing 2026' },
            ].map((t, i) => (
              <span key={i} className="hero-trust flex items-center gap-2">
                {t.icon} {t.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS COUNTERS ── */}
      <section className="py-16 px-4 bg-[#080810] border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black text-white mb-1">
                <span className="counter" data-target={stat.value}>0</span>
                <span className="text-amber-400">{stat.suffix}</span>
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BROWSER MOCKUP SCREENSHOT ── */}
      <section id="demo" className="relative py-20 px-4 bg-[#080810]">
        <div className="max-w-5xl mx-auto" style={{ perspective: '1200px' }}>
          <div className="browser-mockup rounded-xl border border-white/10 shadow-2xl shadow-black/80 overflow-hidden">
            <div className="bg-gray-900 flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-gray-500 text-xs mx-auto">worthifast.vercel.app/dashboard</span>
            </div>
            <Image src="/screenshots/dashboard1.png" alt="Dashboard Worthifast" width={1200} height={700} className="w-full" />
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          OCR &rarr; Journal PCG &rarr; TVA &rarr; Envoi client — tout automatisé
        </p>
      </section>

      {/* ── CRÉDIBILITÉ ── */}
      <section className="credibility-section border-y border-white/5 py-10 px-4 bg-[#0D1220]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3">
          {CREDIBILITY_BADGES.map(badge => (
            <span
              key={badge}
              className="cred-badge inline-flex items-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 font-medium backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* ── FONCTIONNALITÉS (3D Hover Cards) ── */}
      <section id="features" className="features-section py-24 px-4 bg-[#080810] relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[150px]" />

        <div className="max-w-6xl mx-auto relative">
          <div className="gsap-section-header text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ce que Worthifast fait pour vous</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Comptabilité, conformité et collaboration — dans une seule plateforme conçue pour les cabinets français.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(item => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOT CAROUSEL ── */}
      <section className="relative pb-20 pt-4 px-4 bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <ScreenshotCarousel />
        </div>
      </section>

      {/* ── COMPARATIF ── */}
      <div className="comparatif-section bg-[#0D1220]">
        <ComparatifSection />
      </div>

      {/* ── PRICING ── */}
      <div className="pricing-section bg-[#080810]">
        <PricingPlans sectionId="pricing" defaultProfile={3} />
      </div>

      {/* ── SECTION CABINET ── */}
      <section className="cabinet-section py-24 px-4 bg-gradient-to-b from-[#0D1220] to-[#080810] relative overflow-hidden">
        {/* Background orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px]" />

        <div className="cabinet-section-content max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Pour les cabinets 3-10 collaborateurs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            45 dossiers, 1 écran, 0 ressaisie
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10">
            Multi-dossiers, portail client, e-invoicing, connecteurs Cegid &amp; Sage (bientôt).
            Migrez votre cabinet en important votre FEC — on s&apos;occupe du reste.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {['Multi-dossiers illimités', 'Portail client sécurisé', 'E-invoicing 2026 natif', 'Cegid & Sage — bientôt'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <a href="mailto:contact@worthifast.app"
            className="group relative inline-flex items-center gap-2 px-8 py-4 font-bold rounded-2xl text-slate-900 overflow-hidden transition-all shadow-lg shadow-amber-500/20">
            <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-transform group-hover:scale-105" />
            <span className="relative flex items-center gap-2">
              Parler avec l&apos;équipe
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </section>

      {/* ── FAQ (GSAP-animated) ── */}
      <section id="faq" className="faq-section py-24 px-4 bg-[#080810]">
        <div className="max-w-3xl mx-auto">
          <div className="gsap-section-header text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-colors">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-white">{item.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 ml-4" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-sm text-slate-400 leading-relaxed">{item.r}</p>
                        {item.cta && (
                          <a href={item.cta.href} className="inline-block mt-3 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            {item.cta.text}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA (Parallax) ── */}
      <section className="footer-cta-section py-24 px-4 relative overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080810] via-[#0D1B2A] to-[#080810]" />
        <div className="footer-cta-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[150px]" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="gsap-section-header text-4xl sm:text-5xl font-extrabold text-white mb-6">
            Automatisez votre cabinet
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              dès aujourd&apos;hui
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
            30 jours gratuits &middot; Sans carte bancaire &middot; 3h/semaine gagnées vs Cegid
          </p>
          <Link href="/signup"
            className="group relative inline-flex items-center gap-2 px-10 py-5 font-bold rounded-2xl text-slate-900 text-lg overflow-hidden transition-all shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40">
            <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-transform group-hover:scale-105" />
            <span className="relative flex items-center gap-2">
              Essai gratuit 30 jours
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <p className="text-xs text-slate-600 mt-6">
            Sans engagement &middot; Import FEC depuis Cegid/Sage &middot; Support réactif
          </p>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section py-24 px-4 bg-[#0D1220]">
        <div className="max-w-2xl mx-auto">
          <div className="gsap-section-header text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Nous contacter</h2>
            <p className="text-slate-400">Une question ? Notre équipe vous répond sous 24h.</p>
          </div>

          {sent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-white mb-2">Message envoyé !</p>
              <p className="text-slate-400 text-sm">Notre équipe vous contactera dans les 24h.</p>
            </div>
          ) : (
            <form onSubmit={e => void handleContact(e)} className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 space-y-4 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Votre nom *</label>
                  <input required value={contactForm.nom}
                    onChange={e => setContactForm(p => ({ ...p, nom: e.target.value }))}
                    placeholder="Marie Fontaine"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Cabinet / Entreprise</label>
                  <input value={contactForm.cabinet}
                    onChange={e => setContactForm(p => ({ ...p, cabinet: e.target.value }))}
                    placeholder="Cabinet Fontaine & Associés"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email *</label>
                <input required type="email" value={contactForm.email}
                  onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="marie@cabinet-fontaine.fr"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Votre message</label>
                <textarea value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Nombre de dossiers, logiciel actuel, fonctionnalités prioritaires..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="group relative w-full py-3.5 rounded-xl font-bold text-sm text-slate-900 overflow-hidden disabled:opacity-50 transition-all">
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-transform group-hover:scale-105" />
                <span className="relative">{sending ? 'Envoi en cours...' : 'Envoyer \u2192'}</span>
              </button>
              <p className="text-xs text-slate-600 text-center">Vos données ne sont jamais partagées avec des tiers.</p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060912] text-slate-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo-white.svg" alt="Worthifast" width={140} height={34} className="h-8 w-auto" />
              </div>
              <p className="text-sm max-w-xs leading-relaxed">
                La solution comptable intelligente pour les cabinets d&apos;expertise comptable et PME françaises.
              </p>
              <div className="flex items-center gap-2 mt-4 text-xs text-emerald-400 font-medium">
                <span>🇪🇺</span>
                Hébergé en Europe — RGPD conforme
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
              <h4 className="text-sm font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link href="/legal/cgv" className="hover:text-white transition-colors">CGV</Link></li>
                <li><Link href="/legal/cgu" className="hover:text-white transition-colors">CGU</Link></li>
                <li><Link href="/legal/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité (RGPD)</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Worthifast · Conçu à l&apos;IAE Dijon · contact@worthifast.app</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
