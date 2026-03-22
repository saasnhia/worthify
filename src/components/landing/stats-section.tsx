'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 38, suffix: '%', label: 'Moins cher que Pennylane', color: '#F59E0B' },
  { value: 30, suffix: 's', label: "Traitement d'une facture OCR", color: '#00A878' },
  { value: 45, suffix: '', label: 'Dossiers clients en 1 écran', color: '#F59E0B' },
  { value: 14, suffix: 'j', label: "D'essai gratuit sans CB", color: '#00A878' },
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
    <div ref={ref} className="text-4xl md:text-5xl font-black text-white">
      {count}
      <span style={{ color }}>{suffix}</span>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 px-4 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <AnimatedCounter target={stat.value} suffix={stat.suffix} color={stat.color} />
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
