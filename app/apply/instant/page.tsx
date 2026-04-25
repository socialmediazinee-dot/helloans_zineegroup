'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import OtpVerification from '@/components/OtpVerification'

const LOAN_TYPE_LABELS: Record<string, string> = {
  'personal-loans': 'Personal Loan',
  'business-loans': 'Business Loan',
}

const BRAND_COLOR = '#1d4ed8'
const BRAND_GRADIENT = `linear-gradient(135deg, #1d4ed8, #2563eb)`

export default function InstantApplyPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <InstantApplyContent />
    </Suspense>
  )
}

function InstantApplyContent() {
  const searchParams = useSearchParams()

  const loanTypeSlug = searchParams.get('loanType') || 'personal-loans'
  const loanLabel = LOAN_TYPE_LABELS[loanTypeSlug] || 'Personal Loan'

  const [formTitleLabel, setFormTitleLabel] = useState(loanLabel)
  useEffect(() => {
    const slug = searchParams.get('loanType') || 'personal-loans'
    setFormTitleLabel(LOAN_TYPE_LABELS[slug] || 'Personal Loan')
  }, [searchParams])

  const [formData, setFormData] = useState({
    mobileNumber: '',
    email: '',
    day: '',
    month: '',
    year: '',
    sourceOfIncome: 'salaried',
    employerName: '',
    pincode: '',
    city: '',
    consentPersonalData: false,
    consentPersonalizedOffers: false,
    consentPerfios: false,
    panNo: '',
    panCard: null as File | null,
    aadhaarCard: null as File | null,
    payslip: null as File | null,
    bankStatement: null as File | null,
    additionalDoc: null as File | null,
    addressProof: null as File | null,
  })

  const [panPreview, setPanPreview] = useState<string | null>(null)
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null)
  const [filePreviews, setFilePreviews] = useState<Record<string, string | null>>({})
  const [openLegalModal, setOpenLegalModal] = useState<'privacy' | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [mobileVerified, setMobileVerified] = useState(false)

  const dobError = (() => {
    const { day, month, year } = formData
    if (!day || !month || !year) return ''
    const d = parseInt(day, 10)
    const m = parseInt(month, 10)
    const y = parseInt(year, 10)
    if (isNaN(d) || isNaN(m) || isNaN(y)) return ''
    if (d < 1 || d > 31) return 'Invalid day'
    if (m < 1 || m > 12) return 'Invalid month'
    if (year.length < 4) return ''
    if (y < 1900 || y > new Date().getFullYear()) return 'Invalid year'
    const dob = new Date(y, m - 1, d)
    if (dob.getDate() !== d || dob.getMonth() !== m - 1) return 'Invalid date'
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--
    if (age < 18) return 'You must be at least 18 years old to apply'
    return ''
  })()

  const isDobValid = !!(
    formData.day && formData.month && formData.year &&
    formData.year.length === 4 && !dobError
  )

  const canProceed = !!(
    formData.mobileNumber.length === 10 &&
    isDobValid &&
    formData.consentPersonalData &&
    formData.consentPerfios &&
    mobileVerified
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  type DocField = 'panCard' | 'aadhaarCard' | 'payslip' | 'bankStatement' | 'additionalDoc' | 'addressProof'

  const DOC_LABELS: Record<DocField, string> = {
    panCard: 'PAN Card',
    aadhaarCard: 'Aadhaar Card',
    payslip: 'Payslip',
    bankStatement: 'Bank Statement',
    additionalDoc: 'Additional Document',
    addressProof: 'Address Proof',
  }

  const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  const PDF_TYPES = ['application/pdf']
  const ALL_DOC_TYPES = [...IMAGE_TYPES, ...PDF_TYPES]

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, field: DocField, allowPdf = false) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validTypes = allowPdf ? ALL_DOC_TYPES : IMAGE_TYPES
    if (!validTypes.includes(file.type)) {
      const formats = allowPdf ? 'JPG, PNG, WEBP, GIF, or PDF' : 'JPG, PNG, WEBP, or GIF'
      alert(`Please upload a valid file (${formats}) for ${DOC_LABELS[field]}`)
      e.target.value = ''
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert(`File size must be under 2 MB for ${DOC_LABELS[field]}.`)
      e.target.value = ''
      return
    }
    setFormData(prev => ({ ...prev, [field]: file }))
    if (field === 'panCard' || field === 'aadhaarCard') {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (field === 'panCard') setPanPreview(reader.result as string)
        else setAadhaarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setFilePreviews(prev => ({ ...prev, [field]: reader.result as string }))
      reader.readAsDataURL(file)
    } else {
      setFilePreviews(prev => ({ ...prev, [field]: null }))
    }
  }

  const removeDoc = (field: DocField) => {
    setFormData(prev => ({ ...prev, [field]: null }))
    if (field === 'panCard') setPanPreview(null)
    else if (field === 'aadhaarCard') setAadhaarPreview(null)
    else setFilePreviews(prev => ({ ...prev, [field]: null }))
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve((reader.result as string).split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canProceed) return
    setIsSubmitting(true)
    try {
      const toAttachment = async (file: File | null) => {
        if (!file) return null
        return { data: await fileToBase64(file), filename: file.name, contentType: file.type }
      }
      const [panCardAtt, aadhaarCardAtt, payslipAtt, bankStatementAtt, additionalDocAtt, addressProofAtt] = await Promise.all([
        toAttachment(formData.panCard),
        toAttachment(formData.aadhaarCard),
        toAttachment(formData.payslip),
        toAttachment(formData.bankStatement),
        toAttachment(formData.additionalDoc),
        toAttachment(formData.addressProof),
      ])
      const response = await fetch('/api/bank-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankId: 'direct',
          bankName: 'Helloans Direct',
          loanType: loanTypeSlug,
          loanLabel,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          panNo: formData.panNo,
          day: formData.day,
          month: formData.month,
          year: formData.year,
          sourceOfIncome: formData.sourceOfIncome,
          employerName: formData.employerName,
          pincode: formData.pincode,
          city: formData.city,
          loanAmount: searchParams.get('amount') || '',
          tenure: searchParams.get('tenure') || '',
          tenureUnit: searchParams.get('tenureUnit') || 'Yr',
          consentPersonalData: formData.consentPersonalData,
          consentPersonalizedOffers: formData.consentPersonalizedOffers,
          consentPerfios: formData.consentPerfios,
          panCard: panCardAtt,
          aadhaarCard: aadhaarCardAtt,
          payslip: payslipAtt,
          bankStatement: bankStatementAtt,
          additionalDoc: additionalDocAtt,
          addressProof: addressProofAtt,
        }),
      })
      const data = await response.json()
      if (response.ok) setIsApplied(true)
      else alert(data.error || 'There was an error submitting your application. Please try again.')
    } catch {
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const vectorBg = document.getElementById('vectorBackground')
    if (vectorBg) vectorBg.style.display = 'none'
    return () => { if (vectorBg) vectorBg.style.display = '' }
  }, [])

  const renderFileUpload = (field: DocField, label: string, required: boolean, allowPdf: boolean, hint?: string) => {
    const preview = field === 'panCard' ? panPreview : field === 'aadhaarCard' ? aadhaarPreview : filePreviews[field]
    const file = formData[field]
    const isPdf = file && !preview
    const accept = allowPdf
      ? 'image/jpeg,image/jpg,image/png,image/webp,image/gif,application/pdf'
      : 'image/jpeg,image/jpg,image/png,image/webp,image/gif'
    const hintText = allowPdf ? 'JPG, PNG, PDF (Max 2MB)' : 'JPG, PNG, WEBP (Max 2MB)'

    return (
      <div className="form-field-group">
        <label className="form-field-label">
          {label} {required && <span className="required-asterisk">*</span>}
          {!required && <span className="form-optional-tag">(Optional)</span>}
        </label>
        {hint && <p className="form-hint-text" style={{ marginTop: '-2px', marginBottom: '8px' }}>{hint}</p>}
        <div className="file-upload-wrapper">
          <input type="file" id={field} accept={accept} onChange={(e) => handleDocUpload(e, field, allowPdf)} className="file-input-hidden" />
          {file ? (
            <div className="file-preview-container">
              {preview ? (
                <img src={preview} alt={`${label} Preview`} className="file-preview-image" />
              ) : isPdf ? (
                <div className="file-preview-pdf">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="file-preview-name">{file.name}</span>
                </div>
              ) : null}
              <button type="button" onClick={() => removeDoc(field)} className="file-remove-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
              </button>
            </div>
          ) : (
            <label htmlFor={field} className="file-upload-label">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span className="file-upload-text">Upload {label}</span>
              <span className="file-upload-hint">{hintText}</span>
            </label>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bank-app-page-wrapper hdfc-bank-theme" style={{ marginTop: 0, position: 'relative', minHeight: '100vh' }}>
      {/* Header */}
      <div className="bank-apply-header" style={{ background: BRAND_GRADIENT }}>
        <div className="bank-apply-header-inner">
          <div className="bank-apply-header-left">
            <Image src="/assets/images/Logo-Helloans.png" alt="Helloans" width={130} height={44} className="bank-hero-logo zinee-logo" />
          </div>
          <div className="bank-apply-header-right">
            <div className="bank-apply-header-features">
              <div className="bank-apply-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Quick Approval</span>
              </div>
              <div className="bank-apply-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                <span>Minimal Docs</span>
              </div>
              <div className="bank-apply-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success */}
      {isApplied && (
        <div className="application-success-overlay">
          <div className="success-content-overlay">
            <div className="success-message-box">
              <div className="success-icon-large">&#10003;</div>
              <h2 className="success-title">Application Submitted</h2>
              <p className="success-message">Our team will reach out to you shortly</p>
            </div>
            <div className="application-details-overlay">
              <h3 className="details-title">Application Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Loan Type:</span>
                  <span className="detail-value">{formTitleLabel}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile Number:</span>
                  <span className="detail-value">+91 {formData.mobileNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">{formData.day}/{formData.month}/{formData.year}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Source of Income:</span>
                  <span className="detail-value">{formData.sourceOfIncome === 'salaried' ? 'Salaried' : 'Self Employed / Business'}</span>
                </div>
                {formData.email && (
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{formData.email}</span>
                  </div>
                )}
                {formData.city && (
                  <div className="detail-item">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">{formData.city}{formData.pincode ? ` - ${formData.pincode}` : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {!isApplied && (
        <div className="bank-app-form-container bank-form-layout">
          <div className="bank-app-form-card">
            <div className="form-card-header">
              <h2 className="form-welcome-title">Apply for {formTitleLabel}</h2>
              <p className="form-welcome-subtitle">Complete the form below to check your eligibility</p>
            </div>

            <form onSubmit={handleSubmit} className="bank-app-form">
              {/* 1: Verification */}
              <div className="form-section">
                <div className="form-section-label">
                  <span className="form-section-number">1</span>
                  <span>Verification</span>
                </div>
                <div className="form-field-group">
                  <label className="form-field-label">Mobile Number <span className="required-asterisk">*</span></label>
                  <div className="mobile-input-wrapper">
                    <span className="country-code">+91</span>
                    <input type="tel" name="mobileNumber" className="form-input-mobile" placeholder="Enter 10-digit number" value={formData.mobileNumber} onChange={(e) => { handleChange(e); setMobileVerified(false) }} maxLength={10} required />
                  </div>
                  <OtpVerification mobile={formData.mobileNumber} onVerified={() => setMobileVerified(true)} verified={mobileVerified} />
                </div>
                <div className="form-field-group">
                  <label className="form-field-label">Email</label>
                  <input type="email" name="email" className="form-input" placeholder="e.g. name@example.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              {/* 2: Personal Details */}
              <div className="form-section">
                <div className="form-section-label">
                  <span className="form-section-number">2</span>
                  <span>Personal Details</span>
                </div>
                <div className="form-field-group">
                  <label className="form-field-label">Date of Birth <span className="required-asterisk">*</span></label>
                  <div className="dob-inputs">
                    <input type="text" name="day" className={`dob-input ${dobError ? 'dob-input-error' : ''}`} placeholder="DD" value={formData.day} onChange={handleChange} maxLength={2} required />
                    <input type="text" name="month" className={`dob-input ${dobError ? 'dob-input-error' : ''}`} placeholder="MM" value={formData.month} onChange={handleChange} maxLength={2} required />
                    <input type="text" name="year" className={`dob-input ${dobError ? 'dob-input-error' : ''}`} placeholder="YYYY" value={formData.year} onChange={handleChange} maxLength={4} required />
                  </div>
                  {dobError && <p className="form-error-text">{dobError}</p>}
                </div>
                <div className="form-field-group">
                  <label className="form-field-label">PAN Number <span className="required-asterisk">*</span></label>
                  <input type="text" name="panNo" className="form-input form-input-pan" placeholder="e.g. ABCDE1234F" value={formData.panNo} onChange={handleChange} maxLength={10} style={{ textTransform: 'uppercase' }} required />
                  <p className="form-hint-text">Format: 5 letters, 4 digits, 1 letter</p>
                </div>
                <div className="form-field-group">
                  <label className="form-field-label">Source of Income <span className="required-asterisk">*</span></label>
                  <div className="radio-group-bank">
                    <label className={`radio-option-bank ${formData.sourceOfIncome === 'salaried' ? 'selected' : ''}`}>
                      <input type="radio" name="sourceOfIncome" value="salaried" checked={formData.sourceOfIncome === 'salaried'} onChange={handleChange} required />
                      <div className="radio-content">
                        <span className="radio-label">Salaried</span>
                        {formData.sourceOfIncome === 'salaried' && <div className="info-box-yellow">Salary proof may be required for processing</div>}
                      </div>
                    </label>
                    <label className={`radio-option-bank ${formData.sourceOfIncome === 'self-employed' ? 'selected' : ''}`}>
                      <input type="radio" name="sourceOfIncome" value="self-employed" checked={formData.sourceOfIncome === 'self-employed'} onChange={handleChange} />
                      <div className="radio-content">
                        <span className="radio-label">Self Employed / Business</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="form-field-group">
                  <label className="form-field-label">Employer Name</label>
                  <input type="text" name="employerName" className="form-input" placeholder="e.g. Tata Consultancy Services" value={formData.employerName} onChange={handleChange} />
                </div>
              </div>

              {/* 3A: KYC Documents */}
              <div className="form-section">
                <div className="form-section-label">
                  <span className="form-section-number">3A</span>
                  <span>KYC Documents</span>
                </div>
                <div className="form-uploads-row">
                  <div className="form-field-half">{renderFileUpload('panCard', 'PAN Card', true, false)}</div>
                  <div className="form-field-half">{renderFileUpload('aadhaarCard', 'Aadhaar Card', true, false)}</div>
                </div>
              </div>

              {/* 3B: Income Documents */}
              <div className="form-section">
                <div className="form-section-label">
                  <span className="form-section-number">3B</span>
                  <span>Income Documents</span>
                </div>
                <div className="form-uploads-row">
                  <div className="form-field-half">{renderFileUpload('payslip', 'Payslip', true, true)}</div>
                  <div className="form-field-half">{renderFileUpload('bankStatement', 'Bank Statement', true, true)}</div>
                </div>
                {renderFileUpload('additionalDoc', 'Additional Documents', false, true, 'Form 16 / 26 AS, Previous Loan Statement, Repayment Schedule, etc.')}
              </div>

              {/* 4: Address */}
              <div className="form-section">
                <div className="form-section-label">
                  <span className="form-section-number">4</span>
                  <span>Current Address Proof</span>
                </div>
                <div className="form-uploads-row">
                  <div className="form-field-half">
                    <div className="form-field-group">
                      <label className="form-field-label">Pincode</label>
                      <input type="text" name="pincode" className="form-input" placeholder="e.g. 110018" value={formData.pincode} onChange={handleChange} maxLength={6} />
                    </div>
                  </div>
                  <div className="form-field-half">
                    <div className="form-field-group">
                      <label className="form-field-label">City</label>
                      <input type="text" name="city" className="form-input" placeholder="e.g. New Delhi" value={formData.city} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                {renderFileUpload('addressProof', 'Address Proof', true, true, 'Aadhaar Card, Rent Agreement, Electricity Bill, Voter ID, or Passport')}
              </div>

              {/* Consent & Submit */}
              <div className="form-section">
                <div className="consent-group">
                  <label className="consent-checkbox-label">
                    <input type="checkbox" name="consentPersonalData" checked={formData.consentPersonalData} onChange={handleChange} required />
                    <span><span className="required-asterisk">*</span> I consent to collection and processing of my data for this loan application.</span>
                  </label>
                  <label className="consent-checkbox-label">
                    <input type="checkbox" name="consentPerfios" checked={formData.consentPerfios} onChange={handleChange} required />
                    <span><span className="required-asterisk">*</span> I accept the Privacy Policy and agree to the Terms &amp; Conditions.</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className={`eligibility-button ${!canProceed ? 'disabled' : ''}`}
                  disabled={!canProceed || isSubmitting}
                  style={canProceed ? { background: BRAND_GRADIENT, boxShadow: `0 6px 20px ${BRAND_COLOR}35` } : {}}
                >
                  {isSubmitting ? 'Submitting...' : 'Apply Now'}
                </button>
                <p className="form-footer-text">
                  By applying, you agree to our{' '}
                  <button type="button" className="footer-link footer-link-button" style={{ color: BRAND_COLOR }} onClick={() => setOpenLegalModal('privacy')}>T&amp;C</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {openLegalModal === 'privacy' && (
        <div className="legal-modal-backdrop" onClick={() => setOpenLegalModal(null)}>
          <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="legal-modal-close" onClick={() => setOpenLegalModal(null)}>✕</button>
            <h2 className="legal-modal-title shimmer-text">Privacy Policy</h2>
            <div className="legal-modal-body">
              <p><strong>Privacy Policy</strong> explains how we collect, use, store and share your personal data.</p>
              <p>We collect personal, financial, device and transaction information when you use our products or services.</p>
              <p>Data is used for application processing, credit checks, fraud prevention, security, legal compliance, and improving services.</p>
              <p>Your data may be shared with lending partners, service providers, and regulators when necessary.</p>
              <p>We store data as long as required by law or business needs and use security measures to protect it.</p>
              <p>You can review, correct or withdraw consent for your data by contacting us.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
