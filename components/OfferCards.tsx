'use client'

import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import RupeeIcon from '@/components/RupeeIcon'
import styles from './OfferCards.module.css'

const SPEED_MS = 28

export default function OfferCards() {
  const { t } = useLanguage()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [typedLength, setTypedLength] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cards = useMemo(
    () => [
      {
        id: '1',
        icon: '💰',
        mainLine1: <><RupeeIcon size={22} />1100</>,
        mainLine2: 'CASHBACK',
        accent: 'gold',
        reveal: {
          line1: t('features.offer1BackLine1'),
          line2: t('features.offer1BackLine2'),
          desc: t('features.offer1Desc'),
        },
      },
      {
        id: '2',
        icon: '🎁',
        mainLine1: <><RupeeIcon size={22} />3100</>,
        mainLine2: 'CASHBACK',
        accent: 'blue',
        reveal: {
          line1: t('features.offer2BackLine1'),
          line2: t('features.offer2BackLine2'),
          desc: t('features.offer2Desc'),
        },
      },
      {
        id: '3',
        icon: '🤝',
        mainLine1: 'Helloans',
        mainLine2: 'Promise',
        accent: 'green',
        reveal: {
          line1: t('features.promiseBackLine1'),
          line2: t('features.promiseBackLine2'),
          desc: t('features.promiseDesc'),
        },
      },
    ],
    [t]
  )

  const fullTextByCard = useMemo(() => {
    return Object.fromEntries(
      cards.map((c) => [
        c.id,
        [c.reveal.line1, c.reveal.line2, c.reveal.desc].join('\n'),
      ])
    )
  }, [cards])

  const fullText = hoveredId ? fullTextByCard[hoveredId] ?? '' : ''
  const visibleText = fullText.slice(0, typedLength)
  const isComplete = typedLength >= fullText.length

  useEffect(() => {
    if (!hoveredId) return
    setTypedLength(0)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [hoveredId])

  useEffect(() => {
    if (!hoveredId || typedLength >= fullText.length) return
    timerRef.current = setTimeout(() => {
      setTypedLength((n) => n + 1)
    }, SPEED_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [hoveredId, typedLength, fullText.length])

  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setHoveredId(null)
    setTypedLength(0)
  }

  return (
    <section className={styles.section} id="about">
      <h2 className={styles.title}>
        <span className="highlight-box">
          Our <span className="highlight-shimmer">Offers</span>
        </span>
      </h2>
      <p className={styles.subtitle}>       </p>

      <div className={styles.container}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${styles[`accent_${card.accent}`] || ''}`}
            onMouseEnter={() => setHoveredId(card.id)}
            onMouseLeave={handleLeave}
          >
            <div className={styles.border} />
            <div className={styles.cornerDot} />
            <div className={styles.cornerDotBR} />

            <div className={styles.content}>
              <div className={styles.mainBlock}>
                {card.icon && (
                  <span className={styles.cardIcon}>{card.icon}</span>
                )}
                <span className={styles.mainLine1}>{card.mainLine1}</span>
                <span className={styles.mainLine2}>{card.mainLine2}</span>
              </div>

              <div className={styles.revealBlock}>
                {hoveredId === card.id && (
                  <div className={styles.typewriter}>
                    <span className={styles.typewriterText}>{visibleText}</span>
                    {!isComplete && (
                      <span className={styles.cursor} aria-hidden>|</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
