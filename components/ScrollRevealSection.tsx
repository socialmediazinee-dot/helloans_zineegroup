'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

type ScrollRevealSectionProps = {
  children: ReactNode
  /** Optional extra class names to merge with the reveal styles */
  className?: string
  /** Small delay in ms to stagger multiple sections */
  delay?: number
}

export default function ScrollRevealSection({
  children,
  className = '',
  delay = 0,
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [disableTransitionOnce, setDisableTransitionOnce] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollYRef = useRef<number>(0)
  const scrollDirRef = useRef<'up' | 'down'>('down')

  // Track scroll direction so we can animate only on scroll-down.
  useEffect(() => {
    lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0

    const onScroll = () => {
      const y = window.scrollY
      scrollDirRef.current = y > lastScrollYRef.current ? 'down' : 'up'
      lastScrollYRef.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Entering viewport:
            // - scroll DOWN: animate in (with optional delay)
            // - scroll UP: show instantly (no transition)
            const dir = scrollDirRef.current

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
              timeoutRef.current = null
            }

            if (dir === 'up') {
              setDisableTransitionOnce(true)
              setIsVisible(true)
              // Re-enable transitions after paint so future scroll-down entries animate.
              requestAnimationFrame(() => {
                requestAnimationFrame(() => setDisableTransitionOnce(false))
              })
              return
            }

            timeoutRef.current = setTimeout(() => {
              setIsVisible(true)
            }, delay)
          } else {
            // Leaving viewport: hide so it can animate again on re‑entry
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
              timeoutRef.current = null
            }
            setDisableTransitionOnce(false)
            setIsVisible(false)
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px',
      }
    )

    observer.observe(element)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      observer.disconnect()
    }
  }, [delay])

  return (
    <section
      ref={ref}
      className={`scroll-reveal-section ${isVisible ? 'is-visible' : ''} ${
        disableTransitionOnce ? 'no-reveal-transition' : ''
      } ${className}`.trim()}
    >
      {children}
    </section>
  )
}

