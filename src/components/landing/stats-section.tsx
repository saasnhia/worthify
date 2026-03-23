'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  {
    value: 25, suffix: '%', color: '#F59E0B',
    label: 'Moins cher que Pennylane',
    sublabel: '59 EUR/mois vs 79 EUR minimum',
  },
  {
    value: 30, suffix: 's', color: '#00A878',
    label: 'Traitement OCR facture',
    sublabel: 'Tesseract + Mistral IA France',
  },
  {
    value: 100, suffix: '%', color: '#00A878',
    label: 'Conforme e-invoicing 2026',
    sublabel: 'Factur-X EN16931 natif',
  },
  {
    value: 14, suffix: 'j', color: '#F59E0B',
    label: 'Essai gratuit sans CB',
    sublabel: 'Donnees conservees apres essai',
  },
]

function AnimatedCounter({ target, suffix, color }: { target: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1500
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-white tabular-nums">
      {count}
      <span style={{ color }}>{suffix}</span>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label}
            className="bg-[#0D1117] border border-white/[0.07] rounded-xl p-5 text-center hover:border-[#00A878]/20 transition-all duration-200">
            <AnimatedCounter target={stat.value} suffix={stat.suffix} color={stat.color} />
            <p className="text-sm font-medium text-slate-300 mt-2">{stat.label}</p>
            <p className="text-xs text-slate-600 mt-1">{stat.sublabel}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
