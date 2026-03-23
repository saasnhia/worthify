'use client'

interface BrowserFrameProps {
  children: React.ReactNode
  className?: string
  url?: string
}

export function BrowserFrame({ children, className = '', url = 'app.worthifast.fr' }: BrowserFrameProps) {
  return (
    <div className={`rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl ${className}`}>
      <div className="bg-[#0D1117] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 bg-white/[0.04] rounded-md h-6 flex items-center px-3">
          <span className="text-[11px] text-slate-600">{url}</span>
        </div>
      </div>
      <div className="bg-[#050509]">{children}</div>
    </div>
  )
}
