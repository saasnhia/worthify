'use client'

const ORBS = [
  { size: 'w-[400px] h-[400px]', pos: 'top-[10%] left-[15%]', delay: '0s', duration: '8s', animClass: 'animate-float-1' },
  { size: 'w-[350px] h-[350px]', pos: 'top-[30%] right-[10%]', delay: '2s', duration: '12s', animClass: 'animate-float-2' },
  { size: 'w-[300px] h-[300px]', pos: 'bottom-[20%] left-[25%]', delay: '4s', duration: '16s', animClass: 'animate-float-3' },
  { size: 'w-[250px] h-[250px]', pos: 'top-[60%] right-[30%]', delay: '1s', duration: '10s', animClass: 'animate-float-1' },
  { size: 'w-[200px] h-[200px]', pos: 'bottom-[10%] right-[15%]', delay: '3s', duration: '14s', animClass: 'animate-float-2' },
]

export function FloatingOrbs() {
  return (
    <>
      <style jsx global>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -20px) scale(1.05); }
          50% { transform: translate(-10px, 20px) scale(0.95); }
          75% { transform: translate(20px, 10px) scale(1.02); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 15px) scale(1.03); }
          66% { transform: translate(15px, -25px) scale(0.97); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(20px, -30px) scale(1.04); }
          40% { transform: translate(-20px, -10px) scale(0.96); }
          60% { transform: translate(-30px, 20px) scale(1.02); }
          80% { transform: translate(10px, 30px) scale(0.98); }
        }
        .animate-float-1 { animation: float-1 var(--duration) ease-in-out infinite; animation-delay: var(--delay); }
        .animate-float-2 { animation: float-2 var(--duration) ease-in-out infinite; animation-delay: var(--delay); }
        .animate-float-3 { animation: float-3 var(--duration) ease-in-out infinite; animation-delay: var(--delay); }
      `}</style>
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {ORBS.map((orb, i) => (
          <div
            key={i}
            className={`absolute ${orb.size} ${orb.pos} ${orb.animClass} bg-amber-500/10 rounded-full blur-3xl`}
            style={{
              '--delay': orb.delay,
              '--duration': orb.duration,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  )
}
