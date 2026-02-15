'use client'

import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

const partners = [
  { image: '/assets/images/CB.png', alt: 'Canara Bank', className: 'partner-card-1' },
  { image: '/assets/images/AX.png', alt: 'Axis Bank', className: 'partner-card-2' },
  { image: '/assets/images/HDFC.png', alt: 'HDFC Bank', className: 'partner-card-3' },
  { image: '/assets/images/Kotak-1.png', alt: 'Kotak Bank', className: 'partner-card-4' },
  { image: '/assets/images/PNB.png', alt: 'PNB Bank', className: 'partner-card-5' },
  { image: '/assets/images/BOB.png', alt: 'Bank of Baroda', className: 'partner-card-6' },
]

export default function Partners() {
  const { t } = useLanguage()

  return (
    <section
      className="partners-section"
      aria-label="Partners – continuous scroll, pauses on hover"
    >
      <h2 className="section-title">
        <span className="highlight-box">
          Our <span className="highlight-shimmer">Authorized</span> Partners
        </span>
      </h2>
      <div className="partners-slideshow">
        <div className="partners-slideshow-viewport">
          <div className="partners-slideshow-track">
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className={`partner-logo partners-slide-item ${partner.className}`}>
                <Image
                  src={partner.image}
                  alt={partner.alt}
                  width={150}
                  height={80}
                  style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
