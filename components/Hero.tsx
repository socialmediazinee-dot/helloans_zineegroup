'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import InstantLoanSlide from './InstantLoanSlide'


export default function Hero() {
  const { t } = useLanguage()

  const titleLine1 = t('hero.titleLine1')
  const titleLine2 = t('hero.titleLine2')
  const highlight = t('hero.highlight')

  const capitalizedHighlight = highlight.charAt(0).toUpperCase() + highlight.slice(1)

  const parts1 = titleLine1.split(highlight)
  const parts2 = titleLine2.split(highlight)
  const hasHighlight1 = parts1.length > 1
  const hasHighlight2 = parts2.length > 1

  return (
    <div className="hero-section" id="home">
      <div className="hero-container">
        <div className="hero-text-block">
          <span className="highlight-box">
            {hasHighlight1 ? (
              <>
                {parts1[0]}
                <span className="highlight-shimmer">{capitalizedHighlight}</span>
                {parts1.slice(1).join(highlight)}
              </>
            ) : (
              titleLine1
            )}
            <br />
            {hasHighlight2 ? (
              <>
                {parts2[0]}
                <span className="highlight-shimmer">{capitalizedHighlight}</span>
                {parts2.slice(1).join(highlight)}
              </>
            ) : (
              titleLine2
            )}
          </span>
        </div>
        <div className="hero-carousel-content">
          <InstantLoanSlide />
        </div>

      </div>
    </div>
  )
}

