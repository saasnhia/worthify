'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const count = 200

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      spd[i * 3] = (Math.random() - 0.5) * 0.3
      spd[i * 3 + 1] = (Math.random() - 0.5) * 0.3
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.1
    }
    return { positions: pos, speeds: spd }
  }, [])

  // Mouse tracking
  useMemo(() => {
    if (typeof window === 'undefined') return
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  let frameCount = 0
  useFrame((_, delta) => {
    // Limit to ~30fps
    frameCount++
    if (frameCount % 2 !== 0) return

    if (!meshRef.current) return
    const geo = meshRef.current.geometry
    const posAttr = geo.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const time = performance.now() * 0.001

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Wave movement
      arr[i3] += Math.sin(time + speeds[i3]) * delta * 0.3
      arr[i3 + 1] += Math.cos(time + speeds[i3 + 1]) * delta * 0.3
      arr[i3 + 2] += Math.sin(time * 0.5 + speeds[i3 + 2]) * delta * 0.1

      // Mouse attraction (subtle)
      const dx = mouseRef.current.x * 5 - arr[i3]
      const dy = mouseRef.current.y * 4 - arr[i3 + 1]
      arr[i3] += dx * delta * 0.02
      arr[i3 + 1] += dy * delta * 0.02

      // Boundary wrap
      if (arr[i3] > 10) arr[i3] = -10
      if (arr[i3] < -10) arr[i3] = 10
      if (arr[i3 + 1] > 7) arr[i3 + 1] = -7
      if (arr[i3 + 1] < -7) arr[i3 + 1] = 7
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F59E0B"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
