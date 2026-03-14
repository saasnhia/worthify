'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  // 1. WOW effect — Dashboard KPIs, la vue que le prospect voit en premier
  {
    src: '/screenshots/dashboard1.png',
    title: 'Tableau de bord cabinet — Tous vos KPIs en 1 écran',
    description: 'Dossiers actifs, factures en retard, alertes, trésorerie et OCR — pilotage complet instantané.',
  },
  // 2. Workflow — OCR factures, la feature la plus différenciante
  {
    src: '/screenshots/factureocr.png',
    title: 'OCR intelligent — 12 factures classées automatiquement',
    description: 'Fournisseur, montants HT/TVA et référence extraits à 95%+ de confiance. Classement PCG automatique.',
  },
  // 3. Profondeur financière — Trésorerie, BFR, recouvrement
  {
    src: '/screenshots/dashboard2.png',
    title: 'Trésorerie, BFR et recouvrement clients',
    description: 'Solde bancaire, BFR, encours client, DSO et balance âgée — indicateurs décisionnels en temps réel.',
  },
  // 4. Banking — Transactions avec rapprochement
  {
    src: '/screenshots/transactionn.png',
    title: 'Transactions bancaires et rapprochement',
    description: 'Import CSV, catégorisation PCG automatique et statut de rapprochement par transaction.',
  },
  // 5. Automatisation — Balance âgée + recommandations IA
  {
    src: '/screenshots/screen3.png',
    title: 'Balance âgée, rapprochements et IA',
    description: 'Suivi fournisseurs, rapprochements validés, import universel et recommandations comptables IA.',
  },
]

export function ScreenshotCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = SLIDES[current]

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-emerald-500/20 rounded-3xl blur-2xl opacity-60" />

      {/* Slide container */}
      <div className="relative bg-[#0A1628] rounded-2xl border border-white/10 shadow-2xl shadow-emerald-500/10 overflow-hidden">
        {/* Browser chrome */}
        <div className="bg-[#0D1B2A] px-4 py-3 flex items-center gap-2 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white/10 rounded-md h-5 w-48 mx-auto" />
          </div>
        </div>

        {/* Slide content */}
        <div className="relative aspect-[16/9] bg-[#0A1628] overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-contain"
                priority={current === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pb-4 px-6 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg font-bold text-white mb-1">{slide.title}</p>
                <p className="text-slate-300 text-sm">{slide.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center justify-center hover:bg-white/20 transition-colors z-20"
        aria-label="Slide précédente"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center justify-center hover:bg-white/20 transition-colors z-20"
        aria-label="Slide suivante"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1)
              setCurrent(i)
            }}
            className="relative w-2 h-2 rounded-full transition-colors"
            aria-label={`Aller à la slide ${i + 1}`}
          >
            <span className={`block w-full h-full rounded-full ${
              i === current ? 'bg-emerald-400' : 'bg-white/30'
            }`} />
            {i === current && (
              <motion.span
                layoutId="carouselDot"
                className="absolute inset-0 bg-emerald-400 rounded-full"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
