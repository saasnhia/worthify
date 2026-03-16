'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ─── Dashboard 3D flottant (pièce centrale) ───────────────────────────────
function FloatingDashboard() {
  const meshRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.003
    // Mouse interaction
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x, pointer.y * 0.15, 0.05
    )
    meshRef.current.rotation.y += pointer.x * 0.002
    // Float wave
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
  })

  const barHeights = [0.2, 0.5, 0.35, 0.7, 0.45, 0.8]

  return (
    <group ref={meshRef} position={[0.8, 0, 0]}>
      {/* Main dashboard body */}
      <RoundedBox args={[3.2, 2, 0.12]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color="#0f1117"
          metalness={0.8}
          roughness={0.2}
          emissive="#1a1a2e"
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      {/* Inner screen (slightly forward) */}
      <RoundedBox args={[2.9, 1.7, 0.01]} radius={0.05} smoothness={4} position={[0, 0, 0.07]}>
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#0066ff"
          emissiveIntensity={0.05}
        />
      </RoundedBox>

      {/* KPI lines */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={`kpi-${i}`} position={[x, 0.4, 0.08]}>
          <boxGeometry args={[0.6, 0.08, 0.005]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.6}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Chart bars */}
      {barHeights.map((h, i) => (
        <mesh key={`bar-${i}`} position={[-0.9 + i * 0.36, -0.3 + h * 0.3, 0.08]}>
          <boxGeometry args={[0.18, h * 0.6, 0.005]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#F59E0B' : '#10B981'}
            emissive={i % 2 === 0 ? '#F59E0B' : '#10B981'}
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}

      {/* Amber glow border */}
      <RoundedBox args={[3.28, 2.08, 0.10]} radius={0.09} smoothness={4}>
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.15}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </RoundedBox>
    </group>
  )
}

// ─── Sphères orbitales dorées ──────────────────────────────────────────────
function OrbitalSpheres() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.1
  })

  const spheres: { pos: [number, number, number]; size: number; color: string }[] = [
    { pos: [2.4, 0.8, 0], size: 0.12, color: '#F59E0B' },
    { pos: [-2.2, -0.6, 0.5], size: 0.08, color: '#10B981' },
    { pos: [1.8, -1.2, -0.3], size: 0.1, color: '#3B82F6' },
    { pos: [-1.6, 1.1, 0.2], size: 0.07, color: '#F59E0B' },
    { pos: [0.5, 1.8, -0.4], size: 0.09, color: '#8B5CF6' },
  ]

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={s.pos}>
            <sphereGeometry args={[s.size, 16, 16]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={0.8}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// ─── Particules de fond ────────────────────────────────────────────────────
function BackgroundParticles() {
  const count = 120
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }
    return arr
  }, [])

  const ref = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#F59E0B"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Canvas Principal ──────────────────────────────────────────────────────
export function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'auto' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#F59E0B" />
        <pointLight position={[-5, -5, 3]} intensity={0.6} color="#3B82F6" />
        <pointLight position={[0, 3, 4]} intensity={0.8} color="#ffffff" />

        <BackgroundParticles />
        <OrbitalSpheres />
        <FloatingDashboard />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
