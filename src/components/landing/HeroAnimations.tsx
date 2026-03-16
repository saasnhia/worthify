'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useHeroAnimation() {
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // Just make everything visible
      gsap.set('.hero-badge, .hero-h1, .hero-subtitle, .hero-pipeline .step, .hero-cta-primary, .hero-cta-secondary, .hero-trust', {
        opacity: 1, y: 0, scale: 1,
      })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.from('.hero-badge', { y: -40, opacity: 0, duration: 0.5 })
      .from('.hero-h1', { y: 80, opacity: 0, duration: 0.9 })
      .from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.7 }, '-=0.4')
      .from('.hero-pipeline .step', { scale: 0, opacity: 0, stagger: 0.15, duration: 0.5 }, '-=0.3')
      .from('.hero-cta-primary', { y: 30, opacity: 0, duration: 0.5 }, '-=0.2')
      .from('.hero-cta-secondary', { y: 30, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.hero-trust', { y: 20, opacity: 0, stagger: 0.1, duration: 0.4 }, '-=0.3')

    return () => {
      tl.kill()
    }
  }, [])
}

export function useScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Feature cards
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: '.features-section', start: 'top 75%' },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Animated counters
      gsap.utils.toArray<HTMLElement>('.counter').forEach((el) => {
        const target = +(el.dataset.target ?? '0')
        gsap.to(el, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      // Pricing cards
      gsap.from('.pricing-card', {
        scrollTrigger: { trigger: '.pricing-section', start: 'top 70%' },
        y: 80,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: 'back.out(1.2)',
      })

      // Credibility badges
      gsap.from('.cred-badge', {
        scrollTrigger: { trigger: '.credibility-section', start: 'top 80%' },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
      })

      // FAQ items
      gsap.from('.faq-item', {
        scrollTrigger: { trigger: '.faq-section', start: 'top 75%' },
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
      })

      // Footer CTA parallax
      gsap.to('.footer-cta-bg', {
        scrollTrigger: {
          trigger: '.footer-cta-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: -80,
        ease: 'none',
      })

      // Browser mockup
      gsap.from('.browser-mockup', {
        scrollTrigger: { trigger: '.browser-mockup', start: 'top 80%' },
        y: 60,
        opacity: 0,
        rotateX: 15,
        duration: 1,
        ease: 'power3.out',
        transformOrigin: 'center bottom',
      })

      // Section headers
      gsap.utils.toArray<HTMLElement>('.gsap-section-header').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 80%' },
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        })
      })

      // Comparatif section
      gsap.from('.comparatif-section', {
        scrollTrigger: { trigger: '.comparatif-section', start: 'top 75%' },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Contact form
      gsap.from('.contact-section', {
        scrollTrigger: { trigger: '.contact-section', start: 'top 75%' },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      })

      // Cabinet section
      gsap.from('.cabinet-section-content', {
        scrollTrigger: { trigger: '.cabinet-section', start: 'top 75%' },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    })

    return () => ctx.revert()
  }, [])
}
