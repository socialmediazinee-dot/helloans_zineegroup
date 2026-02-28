'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
export default function ApplyForLoanPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    pincode: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name
    setFormData({
      ...formData,
      [name]: e.target.value
    })
    if (submitMessage) setSubmitMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/loan-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage(t('apply.successMessage'))
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          pincode: '',
          message: ''
        })
      } else {
        setSubmitMessage(data.error || t('apply.errorMessage'))
      }
    } catch (error) {
      console.error('Error submitting loan application:', error)
      setSubmitMessage(t('apply.errorMessage'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <Header />
      <div className="scrollable-content">
        <main className="main-body apply-for-loan-main">
          <aside className="sidebar left-sidebar"></aside>
          <section className="main-content">
            <div className="contact-page-container apply-for-loan-page-container">
              {/* Header Section */}
              <div className="contact-header">
                <h1 className="contact-title">
                {(() => {
                  const title = t('apply.title')
                  if (title.includes('Apply')) {
                    const [before, after] = title.split('Apply')
                    return <>{before}<span className="loan-title-shimmer">Apply</span>{after}</>
                  }
                  return title
                })()}
              </h1>
                <p className="contact-intro">{t('apply.intro')}</p>
                <div className="loan-benefits">
                  <div className="benefit-item">
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t('apply.quickApproval')}</span>
                  </div>
                  <div className="benefit-item">
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t('apply.lowInterestRates')}</span>
                  </div>
                  <div className="benefit-item">
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t('apply.minimalDoc')}</span>
                  </div>
                  <div className="benefit-item">
                    <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t('apply.flexibleRepayment')}</span>
                  </div>
                </div>
              </div>

              {/* Main Content - Single column professional form (no left phone) */}
              <div className="contact-content-grid apply-for-loan-grid">
                <div className="contact-form-wrapper apply-for-loan-form-wrapper">
                  <form className="contact-form" onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <div className="form-section-header">
                      <h3 className="form-section-title">{t('apply.personalInfo')}</h3>
                    </div>

                    {/* Name Field */}
                    <div className="form-group">
                      <label className="form-label">{t('apply.fullName')} *</label>
                      <div className="form-input-wrapper">
                        <svg className="form-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                          type="text"
                          name="name"
                          placeholder={t('apply.enterFullName')}
                          className="form-input"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email and Phone Row */}
                    <div className="form-row">
                      {/* Email Field */}
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="form-input-wrapper">
                          <svg className="form-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input
                            type="email"
                            name="email"
                            placeholder="your.email@example.com"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Phone Field */}
                      <div className="form-group">
                        <label className="form-label">{t('apply.phoneNumber')} *</label>
                        <div className="form-input-wrapper">
                          <svg className="form-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input
                            type="tel"
                            name="phone"
                            placeholder={t('apply.enterPhone')}
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* City and Pincode Row */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">{t('apply.city')} *</label>
                        <div className="form-input-wrapper">
                          <svg className="form-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input
                            type="text"
                            name="city"
                            placeholder={t('apply.enterCity')}
                            className="form-input"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('apply.pincode')} *</label>
                        <div className="form-input-wrapper">
                          <svg className="form-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <input
                            type="text"
                            name="pincode"
                            placeholder={t('apply.pincodePlaceholder')}
                            className="form-input"
                            value={formData.pincode}
                            onChange={handleChange}
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>
                    </div>


                    {/* Message Field */}
                    <div className="form-group">
                      <label className="form-label">{t('apply.tellUsAbout')} *</label>
                      <textarea
                        name="message"
                        placeholder={t('apply.messagePlaceholder')}
                        className="form-textarea"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Submit Message */}
                    {submitMessage && (
                      <div className={`submit-message ${submitMessage.includes('error') || submitMessage.includes('Error') ? 'error' : 'success'}`}>
                        {submitMessage}
                      </div>
                    )}

                    {/* Submit Button - single line Apply Now (menu bar has two-line + thunder) */}
                    <button
                      type="submit"
                      className="form-submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('apply.submitting') : t('apply.applyNow')}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <aside className="sidebar right-sidebar"></aside>
        </main>
        <Footer />
      </div>
    </div>
  )
}
