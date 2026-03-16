'use client'

import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  icon: LucideIcon
  color: 'emerald' | 'cyan' | 'violet'
  title: string
  desc: string
}

const colorMap = {
  emerald: {
    card: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
    icon: 'bg-emerald-500/10 text-emerald-400',
  },
  cyan: {
    card: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40',
    icon: 'bg-cyan-500/10 text-cyan-400',
  },
  violet: {
    card: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40',
    icon: 'bg-violet-500/10 text-violet-400',
  },
}

export function FeatureCard({ icon: Icon, color, title, desc }: FeatureCardProps) {
  const colors = colorMap[color]

  return (
    <motion.div
      whileHover={{ rotateY: 6, rotateX: -4, scale: 1.03, y: -8 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`feature-card bg-gradient-to-br ${colors.card} border rounded-2xl p-8 cursor-default shadow-xl hover:shadow-amber-500/10 transition-shadow`}
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors.icon} mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  )
}
