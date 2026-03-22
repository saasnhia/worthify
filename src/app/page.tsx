'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X as XIcon, CheckCircle2 } from 'lucide-react'
import { HeroSection } from '@/components/landing/hero-section'
import { StatsSection } from '@/components/landing/stats-section'
import { WorkflowSection } from '@/components/landing/workflow-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { ComparatifSection } from '@/components/landing/comparatif-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [contactForm, setContactForm] = useState({ nom: '', cabinet: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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
    <main className="bg-[#080810] text-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-[#080810]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/worthifast-logo-white.svg" alt="Worthifast — Logiciel comptable" width={140} height={34} priority className="h-8 w-auto" />
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
            <Link href="/signup" className="bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Essai gratuit 14j
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-400" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            {mobileMenu ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-white/5 bg-[#080810] px-4 py-4 space-y-3">
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
              <Link href="/signup" className="flex-1 text-center px-4 py-2 bg-[#F59E0B] rounded-xl text-sm font-bold text-black">Essai gratuit</Link>
            </div>
          </div>
        )}
      </nav>

      <HeroSection />
      <StatsSection />
      <WorkflowSection />
      <FeaturesSection />
      <ComparatifSection />
      <SocialProofSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-4 bg-[#0D1220]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Nous contacter</h2>
            <p className="text-slate-400">Une question ? Notre équipe vous répond sous 24h.</p>
          </div>

          {sent ? (
            <div className="bg-[#00A878]/10 border border-[#00A878]/20 rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#00A878] mx-auto mb-4" />
              <p className="text-lg font-semibold text-white mb-2">Message envoyé !</p>
              <p className="text-slate-400 text-sm">Notre équipe vous contactera dans les 24h.</p>
            </div>
          ) : (
            <form onSubmit={e => void handleContact(e)} className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Votre nom *</label>
                  <input required value={contactForm.nom}
                    onChange={e => setContactForm(p => ({ ...p, nom: e.target.value }))}
                    placeholder="Marie Fontaine"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00A878]/50 focus:border-[#00A878]/50 transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Cabinet / Entreprise</label>
                  <input value={contactForm.cabinet}
                    onChange={e => setContactForm(p => ({ ...p, cabinet: e.target.value }))}
                    placeholder="Cabinet Fontaine & Associés"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00A878]/50 focus:border-[#00A878]/50 transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email *</label>
                <input required type="email" value={contactForm.email}
                  onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="marie@cabinet-fontaine.fr"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00A878]/50 focus:border-[#00A878]/50 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Votre message</label>
                <textarea value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Nombre de dossiers, logiciel actuel, fonctionnalités prioritaires..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00A878]/50 focus:border-[#00A878]/50 transition resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                {sending ? 'Envoi en cours...' : 'Envoyer →'}
              </button>
              <p className="text-xs text-slate-600 text-center">Vos données ne sont jamais partagées avec des tiers.</p>
            </form>
          )}
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
