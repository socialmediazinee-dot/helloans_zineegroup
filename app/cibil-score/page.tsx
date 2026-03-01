'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import OtpVerification from '@/components/OtpVerification'
import styles from './cibil.module.css'

export default function CibilScorePage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    panNumber: '',
    dob: '',
    mobileNumber: '',
    email: '',
    city: '',
    pincode: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [mobileVerified, setMobileVerified] = useState(false)

  // Accordion state for Knowledge Hub
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'panNumber') {
      setFormData({ ...formData, [name]: value.toUpperCase() })
    } else if (name === 'mobileNumber' && value.length <= 10) {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '') })
      setMobileVerified(false)
    } else if (name !== 'mobileNumber') {
      setFormData({ ...formData, [name]: value })
    }
    if (submitMessage) setSubmitMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    try {
      const response = await fetch('/api/cibil-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        setSubmitMessage(t('cibil.formSuccess') || 'Your CIBIL score enquiry has been submitted. We will contact you via email.')
        setMobileVerified(false)
        setFormData({
          name: '',
          panNumber: '',
          dob: '',
          mobileNumber: '',
          email: '',
          city: '',
          pincode: ''
        })
      } else {
        setSubmitMessage(data.error || 'There was an error. Please try again.')
      }
    } catch {
      setSubmitMessage('There was an error submitting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const knowledgeHubData = [
    {
      title: "Golden Rules (RBI & CIBIL)",
      content: (
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }}>
          <li><strong>Payment Discipline (35% Weight):</strong> Pay EMIs and credit card bills on time. Even a single missed payment can impact your score significantly.</li>
          <li><strong>Credit Utilization Ratio (30% Weight):</strong> Keep your credit usage below 30% of your total limit. (e.g., If limit is ₹1 Lakh, use &lt; ₹30,000).</li>
          <li><strong>Credit Mix (10% Weight):</strong> Maintain a healthy balance of secured (Home/Auto Loan) and unsecured (Credit Card/Personal Loan) credit.</li>
        </ul>
      )
    },
    {
      title: "New RBI Guidelines (2026)",
      content: (
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }}>
          <li><strong>Faster Updates:</strong> Banks now report to bureaus every 15 days (bi-monthly), so clearing dues reflects faster!</li>
          <li><strong>Real-Time Alerts:</strong> You will receive SMS/Email alerts whenever your credit report is accessed.</li>
          <li><strong>Right to Correction:</strong> Credit bureaus must resolve grievances within 30 days or pay a penalty.</li>
        </ul>
      )
    },
    {
      title: "Pro Tips for a 750+ Score",
      content: (
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem' }}>
          <li><strong>Don't Close Old Cards:</strong> The length of your credit history matters (15% Weight). Keep old cards active for a longer history.</li>
          <li><strong>Monitor Co-signed Loans:</strong> If you are a guarantor, the borrower's default affects <em>your</em> score.</li>
          <li><strong>Avoid "Hungry" Behavior:</strong> Multiple loan applications in a short time lead to "Hard Inquiries" which lower your score.</li>
        </ul>
      )
    }
  ]

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main style={{ flexGrow: 1, width: '100%' }}>
        {/* Modern Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.blob1}></div>
            <div className={styles.blob2}></div>
          </div>

          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <h1 className={styles.headline}>
                  Check Your <span className={styles.textShimmer}>CIBIL Score</span> Instantly
                </h1>
                <p className={styles.subheadline}>
                  Get your detailed credit report for free. Trusted by millions of Indians for accurate credit insights.
                </p>

                <div className={styles.trustBadges}>
                  <div className={styles.trustBadge}>
                    <div className={styles.iconBoxGreen}>
                      <svg width="20" height="20" className={styles.textGreen} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className={styles.trustText}>100% Secure</span>
                  </div>
                  <div className={styles.trustBadge}>
                    <div className={styles.iconBoxBlue}>
                      <svg width="20" height="20" className={styles.textBlue} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className={styles.trustText}>Updated Timely</span>
                  </div>
                </div>
              </div>

              {/* Premium Form Card */}
              <div className={styles.formWrapper}>
                <div className={styles.formDeco}></div>
                <div className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <h3 className={styles.formTitle}>
                      <span className={styles.iconSquare}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </span>
                      Check Your CIBIL Score
                    </h3>
                    <p className={styles.formSubtitle}>Fill in the details below to get your score instantly.</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {t('cibil.formNameLabel') || 'Name as per PAN Card'} <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Rahul Kumar"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div>
                        <label className={styles.label}>
                          {t('cibil.formPanLabel') || 'PAN Number'} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          placeholder="ABCDE1234F"
                          className={styles.input}
                          value={formData.panNumber}
                          onChange={handleChange}
                          maxLength={10}
                          style={{ textTransform: 'uppercase' }}
                          required
                        />
                      </div>
                      <div>
                        <label className={styles.label}>
                          {t('cibil.formDobLabel') || 'Date of Birth'} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          className={styles.input}
                          value={formData.dob}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div>
                        <label className={styles.label}>
                          {t('cibil.formMobileLabel') || 'Mobile Number'} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          placeholder="9876543210"
                          className={styles.input}
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          maxLength={10}
                          required
                        />
                        <div className={styles.verificationBlock}>
                          <OtpVerification
                            mobile={formData.mobileNumber}
                            onVerified={() => setMobileVerified(true)}
                            verified={mobileVerified}
                            className={styles.otpVerification}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={styles.label}>
                        {t('cibil.formEmailLabel') || 'Email ID'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="rahul@example.com"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                      />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div>
                        <label className={styles.label}>
                          {t('cibil.formCityLabel') || 'City'} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Mumbai"
                          className={styles.input}
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className={styles.label}>
                          {t('cibil.formPincodeLabel') || 'Pincode'} <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          placeholder="400001"
                          className={styles.input}
                          value={formData.pincode}
                          onChange={handleChange}
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    {submitMessage && (
                      <div className={styles.message + ' ' + (submitMessage.toLowerCase().includes('success') ? styles.messageSuccess : styles.messageError)}>
                        {submitMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !mobileVerified}
                      className={styles.submitButton}
                    >
                      {isSubmitting ? (
                        <>
                          <svg width="20" height="20" className={styles.animateSpin} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('cibil.formSubmitting') || 'Checking Score...'}
                        </>
                      ) : (
                        <>
                          Submit Now
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </>
                      )}
                    </button>

                    <p className={styles.disclaimer}>
                      {t('cibil.contactEmailOnly') || 'We will contact you via email securely. No spam guarantee.'}
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Glassmorphism Style */}
        <section className={styles.sectionGlass}>
          <div className={styles.heroBackground} style={{ opacity: 0.5 }}>
            <div className={styles.blob1} style={{ width: '300px', height: '300px', top: '20%', right: '20%' }}></div>
            <div className={styles.blob2} style={{ width: '400px', height: '400px', bottom: '10%', left: '10%' }}></div>
          </div>
          <div className={styles.container}>

            <div className={styles.glassCard}>
              <h2 className={styles.sectionTitle}>
                Why You Should Check Your CIBIL Score with Helloans (and It&#39;s Free!)
              </h2>
              <div className={styles.divider} style={{ marginBottom: '2rem' }}></div>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIconBox}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className={styles.featureText}>
                    <span className={styles.textShimmer}>Unlock</span> Exclusive Loan & Credit Card Deals from top lenders.
                  </div>
                </div>

                <div className={styles.featureItem}>
                  <div className={styles.featureIconBox}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div className={styles.featureText}>
                    <span className={styles.textShimmer}>Safe & Secure</span> Credit Score Check - 100% Effortless.
                  </div>
                </div>

                <div className={styles.featureItem}>
                  <div className={styles.featureIconBox}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div className={styles.featureText}>
                    <span className={styles.textShimmer}>Simplified</span> Credit Report Insights & Expert Tips.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Score Ranges Visual */}
        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t('cibil.creditScoreRange') || 'What is the range of the Credit Score?'}</h2>
              <p className={styles.subheadline} style={{ margin: '0 auto' }}>A higher score opens doors to better financial opportunities.</p>
            </div>

            <div className={styles.scoreRangeContainer}>
              {[
                { range: '300-549', label: 'Poor', classSuffix: 'Poor' },
                { range: '550-649', label: 'Average', classSuffix: 'Average' },
                { range: '650-749', label: 'Good', classSuffix: 'Good' },
                { range: '750-900', label: 'Excellent', classSuffix: 'Excellent' }
              ].map((tier, idx) => (
                <div key={idx} className={`${styles.rangeCard} ${styles['range' + tier.classSuffix]}`}>
                  <div className={`${styles.rangeLabel} ${styles['label' + tier.classSuffix]}`}>{tier.label}</div>
                  <div className={styles.rangeValue}>{tier.range}</div>
                  <div className={`${styles.rangeBar} ${styles['bar' + tier.classSuffix]}`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CIBIL Info Content */}
        <section className={styles.infoSection}>
          <div className={styles.infoContainer}>
            <div className={styles.infoIntro}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.textShimmer}>CIBIL</span> — India&apos;s Credit Bureau
              </h2>
              <div className={styles.infoDivider}></div>
              <p className={styles.infoIntroText}>
                CIBIL is India&apos;s credit information repository, licensed by the Reserve Bank of India. It maintains credit records of individuals and businesses by collecting data from banks, NBFCs, and other financial institutions. Based on this data, a <strong>CIBIL Score</strong> and a detailed <strong>Credit Information Report (CIR)</strong> is generated that lenders use to evaluate creditworthiness.
              </p>
              <p className={styles.infoIntroText} style={{ marginTop: '1rem' }}>
                The CIBIL Score is a <strong>three-digit number ranging from 300 to 900</strong> that represents your credit health. A higher score indicates responsible credit behavior and increases the likelihood of loan or credit card approval at better interest rates.
              </p>
            </div>

            <div className={styles.infoGrid}>
              {/* Repayment History */}
              <div className={styles.infoCard}>
                <div className={`${styles.infoCardIcon} ${styles.infoCardIconAmber}`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className={styles.infoCardTitle}>Repayment History</h3>
                <p className={styles.infoCardText}>
                  This is the most important factor. Paying EMIs and credit card dues on time positively impacts the score, while late payments, defaults, or settlements reduce it significantly.
                </p>
              </div>

              {/* New Credit & Hard Inquiries */}
              <div className={styles.infoCard}>
                <div className={`${styles.infoCardIcon} ${styles.infoCardIconPurple}`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className={styles.infoCardTitle}>New Credit & Hard Inquiries</h3>
                <p className={styles.infoCardText}>
                  Applying for multiple loans or credit cards with &ldquo;Positive Borrowing&rdquo; during inquiries results in a matured CIBIL score. &ldquo;No borrowing&rdquo; after inquiries has a negative impact on CIBIL.
                </p>
              </div>

              {/* Data Reporting - full width */}
              <div className={`${styles.infoCard} ${styles.infoCardFull}`}>
                <div className={`${styles.infoCardIcon} ${styles.infoCardIconSlate}`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <h3 className={styles.infoCardTitle}>Data Reporting & Updates</h3>
                <p className={styles.infoCardText}>
                  Banks and financial institutions report credit data to CIBIL on a monthly basis. Any changes in repayment behavior typically reflect in the report within <strong>15–30 days</strong>. Regular monitoring helps identify errors and track your financial progress.
                </p>
              </div>
            </div>

            <div className={styles.infoNote}>
              Regular monitoring of your CIBIL score helps identify errors early and track your financial progress over time.
            </div>
          </div>
        </section>

        {/* Knowledge Hub - Accordion */}
        <section className={styles.section}>
          <div className={styles.accordionContainer}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.expertAdvice} ${styles.textShimmer}`}>Expert Advice</div>
              <h2 className={styles.sectionTitle} style={{ marginTop: '0' }}>Master Your Credit Score</h2>
              <p className={styles.subheadline} style={{ margin: '1rem auto 0' }}>Essential guidelines from RBI and banking experts to keep your financial health in check.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {knowledgeHubData.map((item, index) => (
                <div key={index} className={styles.accordionItem}>
                  <button
                    className={styles.accordionButton}
                    onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                  >
                    <span className={styles.accordionTitle}>
                      <span className={styles.accordionNumber}>
                        {index + 1}
                      </span>
                      {item.title}
                    </span>
                    <svg
                      width="20" height="20"
                      className={`${styles.textSlate} ${activeAccordion === index ? styles.rotate180 : ''}`}
                      style={{ transition: 'transform 0.3s' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`${styles.accordionContent} ${activeAccordion === index ? styles.accordionContentOpen : ''}`}
                  >
                    <div className={styles.accordionInner}>
                      {item.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
