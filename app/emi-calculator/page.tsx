'use client'

import EmiCalculatorWithComparison from '@/components/EmiCalculatorWithComparison'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EmiCalculatorPage() {
  const { t } = useLanguage()
  return (
    <div className="page-container">
      <Header />
      <div className="scrollable-content">
        <main className="loan-page-main">
          <div className="loan-page-container">
            <div className="loan-page-header">
              <h1>
                {(() => {
                  const title = t('emi.pageTitle')
                  const idx = title.indexOf(' ')
                  if (idx === -1) return <span className="shimmer-text">{title}</span>
                  return <><span className="shimmer-text">{title.substring(0, idx)}</span>{title.substring(idx)}</>
                })()}
              </h1>
              <p>{t('emi.pageDesc')}</p>
            </div>
            <EmiCalculatorWithComparison />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

