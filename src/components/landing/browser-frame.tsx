'use client'

interface BrowserFrameProps {
  children: React.ReactNode
  className?: string
  url?: string
}

export function BrowserFrame({ children, className = '', url = 'app.worthifast.fr' }: BrowserFrameProps) {
  return (
    <div className={`rounded-xl overflow-hidden border border-white/10 shadow-2xl ${className}`}>
      <div className="bg-[#1a1a2e] px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 bg-white/5 rounded-md h-6 flex items-center px-3">
          <span className="text-xs text-slate-500">{url}</span>
        </div>
      </div>
      <div className="bg-[#080810]">{children}</div>
    </div>
  )
}
