'use client'

import { useRef, useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import InstantLoanSlide from './InstantLoanSlide'

export default function Carousel() {
  const { t } = useLanguage()

  const slides = [
    {
      id: 1,
      type: 'instant-loan',
      title: 'INSTANT LOAN',
      subtitle: 'Personal Loan from Fi Money',
      banks: [
        { name: 'Axis Bank', slug: 'axis', logo: '/assets/banks/axis-bank-logo.png', link: 'https://axis-card.mymoneymantra.com?sms=false&btb=true&utm_source=axs&utm_medium=mmm&utm_campaign=axs-mmm-941530', color: '#A3195B' },
        { name: 'Bajaj Finserv', slug: 'bajaj', logo: '/assets/banks/bajaj.jpg', link: 'https://www.bajajfinservmarkets.in/apply-for-personal-loan-finservmarkets/?utm_source=B2B&utm_medium=E-referral&utm_campaign=OA&utm_content=MYMONEYMANTRA_FINTECH_PRIVATE_LIMITED', color: '#0066CC' },
        { name: 'Aditya Birla', slug: 'adityabirla', logo: '/assets/banks/adityabirla.svg', link: 'https://abflbl.mymoneymantra.com/?btb=true&utm_source=abfl&utm_medium=mmm&utm_campaign=abfl-mmm-941530', color: '#CB2035' },
        { name: 'HDFC Bank', slug: 'hdfc', logo: '/assets/banks/hdfc-bank-logo.svg', link: 'https://hdfcbank.mymoneymantra.com?sms=false&btb=true&utm_source=hdfc&utm_medium=mmm&utm_campaign=hdfc-mmm-941530', color: '#004C8F' },
        { name: 'ICICI Bank', slug: 'icici', logo: '/assets/banks/ICICI-logo-white.svg', link: 'https://icicibank.mymoneymantra.com?sms=false&btb=true&utm_source=icici&utm_medium=mmm&utm_campaign=icici-mmm-941530', color: '#DB620A' },
        { name: 'IDFC First Bank', slug: 'idfcfirst', logo: '/assets/banks/IDFC-logo.svg', link: 'https://idfcfirstpl.mymoneymantra.com?sms=false&btb=true&utm_source=idfcpl&utm_medium=mmm&utm_campaign=idfcpl-mmm-941530', color: '#9D1D27' },
        { name: 'IndusInd Bank', slug: 'indusind', logo: '/assets/images/partners/indusind.jpeg', link: 'https://induseasycredit.indusind.com/customer/personal-loan/new-lead?utm_source=assisted&utm_medium=IBLV899&utm_campaign=Personal-Loan&utm_content=1', color: '#C4122E' },
        { name: 'Kotak Mahindra', slug: 'kotak', logo: '/assets/banks/kotak.svg', link: 'https://kotakbank.mymoneymantra.com?sms=false&btb=true&utm_source=kotak&utm_medium=mmm&utm_campaign=kotak-mmm-941530', color: '#EC1C24' },
        { name: 'L&T Finance', slug: 'lnt', logo: '/assets/banks/l_and_t.png', link: 'https://lntfinance.mymoneymantra.com?sms=false&btb=true&utm_source=lnt&utm_medium=mmm&utm_campaign=lnt-mmm-941530', color: '#FFC20E' },
        { name: 'Tata Capital', slug: 'tata', logo: '/assets/banks/tata.jpg', link: 'https://tatacapitalbl.mymoneymantra.com/?sms=false&btb=true&utm_source=tatabl&utm_medium=mmm&utm_campaign=tatabl-mmm-941530', color: '#1F5FA1' },
        { name: 'Yes Bank', slug: 'yes', logo: '/assets/banks/yes-bank-logo-png.png', link: 'https://popcard.mymoneymantra.com?sms=false&btb=true&utm_source=yescc&utm_medium=mmm&utm_campaign=yescc-mmm-941530', color: '#2E5C9A' },
      ]
    },
    {
      id: 2,
      type: 'credit-card',
      title: 'CREDIT CARDS',
      subtitle: 'Best Credit Card Offers',
      banks: [
        { name: 'YES Bank', slug: 'yes', logo: '/assets/banks/yes-bank-logo-png.png', color: '#006BB4', link: 'https://popcard.mymoneymantra.com?sms=false&btb=true&utm_source=yescc&utm_medium=mmm&utm_campaign=yescc-mmm-941530' },
        { name: 'Bank of Baroda', slug: 'bob', color: '#FF6600', link: 'https://bobcard.mymoneymantra.com?sms=false&btb=true&utm_source=bobcc&utm_medium=mmm&utm_campaign=bobcc-mmm-941530' },
        { name: 'Federal Bank', slug: 'federal', color: '#0066CC', link: 'https://federalcc.mymoneymantra.com?sms=false&btb=true&utm_source=fedcc&utm_medium=mmm&utm_campaign=fedcc-mmm-941530' },
        { name: 'AU Bank', slug: 'au', color: '#FF9900', link: 'https://aucc.mymoneymantra.com/?sms=false&btb=true&utm_source=aucc&utm_medium=mmm&utm_campaign=aucc-mmm-941530' },
        { name: 'SBI Card', slug: 'sbi', color: '#288CC8', link: 'https://sbicard.mymoneymantra.com?sms=false&btb=true&utm_source=sbcc&utm_medium=mmm&utm_campaign=sbcc-mmm-941530' },
        { name: 'Axis Bank', slug: 'axis', logo: '/assets/banks/axis-bank-logo.png', color: '#8C1D2C', link: 'https://axis-card.mymoneymantra.com?sms=false&btb=true&utm_source=axs&utm_medium=mmm&utm_campaign=axs-mmm-941530' },
      ]
    },
    {
      id: 3,
      type: 'business-loan',
      title: 'BUSINESS LOAN',
      subtitle: 'Loans for Your Business',
      banks: [
        { name: 'Protium', slug: 'protium', color: '#003366', link: 'https://protium.mymoneymantra.com/?sms=false&btb=true&utm_source=protium&utm_medium=mmm&utm_campaign=protium-mmm-941530' },
        { name: 'Muthoot', slug: 'muthoot', color: '#ED1C24', link: 'https://muthoot.mymoneymantra.com/?sms=false&btb=true&v1=EDI&utm_source=medi&utm_medium=mmm&utm_campaign=medi-mmm-941530' },
        { name: 'ABFL', slug: 'abfl', logo: '/assets/banks/adityabirla.svg', color: '#FFCC00', link: 'https://abflbl.mymoneymantra.com/?btb=true&utm_source=abfl&utm_medium=mmm&utm_campaign=abfl-mmm-941530' },
        { name: 'Tata Capital', slug: 'tata', logo: '/assets/banks/tata.jpg', color: '#0066CC', link: 'https://tatacapitalbl.mymoneymantra.com/?sms=false&btb=true&utm_source=tatabl&utm_medium=mmm&utm_campaign=tatabl-mmm-941530' },
      ]
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (isPaused) {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
      return
    }

    autoAdvanceTimerRef.current = setInterval(handleNext, 6000)
    return () => {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
    }
  }, [currentIndex, isPaused])

  return (
    <section className="flip-carousel-section" id="apply">
      <div
        className="carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="carousel-wrapper">
          <div className="slide">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-modern-item ${index === currentIndex ? 'active' : ''}`}
              >
                <InstantLoanSlide />
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="carousel-navigation-wrapper">
            <button
              className="carousel-nav-button carousel-nav-button-prev"
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="carousel-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="carousel-nav-button carousel-nav-button-next"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
