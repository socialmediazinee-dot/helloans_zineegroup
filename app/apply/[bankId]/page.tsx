'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import AxisBankHeader from '@/components/AxisBankHeader'
import HDFCSinglePageForm from '@/components/HDFCSinglePageForm'
import YesBankSinglePageForm from '@/components/YesBankSinglePageForm'
import AxisSinglePageForm from '@/components/AxisSinglePageForm'
import KotakSinglePageForm from '@/components/KotakSinglePageForm'
import OtpVerification from '@/components/OtpVerification'

const BANK_SLUGS = ['icici', 'indusind', 'yes', 'idfc', 'kotak', 'hdfc', 'axis', 'bajaj', 'au', 'adityabirla'] as const

const bankInfo: Record<string, { name: string; logo: string; color: string; primaryColor: string }> = {
  icici: { name: 'ICICI Bank', logo: '/assets/images/partners/icici.jpg', color: '#E85D04', primaryColor: '#E85D04' },
  indusind: { name: 'IndusInd Bank', logo: '/assets/images/partners/indusind.jpeg', color: '#C4122E', primaryColor: '#C4122E' },
  yes: { name: 'YES Bank', logo: '/assets/banks/yes-bank-logo-png.png', color: '#132744', primaryColor: '#C4122E' },
  idfc: { name: 'IDFC FIRST Bank', logo: '/assets/images/partners/idfc.webp', color: '#E31837', primaryColor: '#E31837' },
  kotak: { name: 'Kotak Mahindra Bank', logo: '/assets/images/Kotak-1.png', color: '#00AEEF', primaryColor: '#00AEEF' },
  hdfc: { name: 'HDFC Bank', logo: '/assets/images/HDFC.png', color: '#004C8A', primaryColor: '#E31837' },
  axis: { name: 'Axis Bank', logo: '/assets/images/AX.png', color: '#8B0040', primaryColor: '#8B0040' },
  bajaj: { name: 'Bajaj Finserv', logo: '/assets/images/partners/bajaj.png', color: '#0076b8', primaryColor: '#0076b8' },
  au: { name: 'AU Small Finance Bank', logo: '/assets/images/partners/au.png', color: '#003366', primaryColor: '#003366' },
  adityabirla: { name: 'Aditya Birla Finance', logo: '/assets/images/partners/abfl.webp', color: '#a02030', primaryColor: '#a02030' },
}

const LOAN_TYPE_LABELS: Record<string, string> = {
  'personal-loans': 'Personal Loan',
  'business-loans': 'Business Loan',
  'home-loans': 'Home Loan',
  'education-loans': 'Education Loan',
  'gold-loans': 'Gold Loan',
  'credit-cards': 'Credit Card',
  'insurance': 'Insurance',
  'overdraft': 'Overdraft',
  'secure-loans': 'Secure Loan',
  'used-car-loan': 'Used Car Loan',
}

function getBankThemeClass(bankId: string): string {
  const map: Record<string, string> = {
    icici: 'icici-bank-theme',
    indusind: 'indusind-bank-theme',
    yes: 'yes-bank-theme',
    idfc: 'idfc-bank-theme',
    kotak: 'kotak-bank-theme',
    hdfc: 'hdfc-bank-theme',
    axis: 'axis-bank-theme',
    bajaj: 'hdfc-bank-theme',
    au: 'hdfc-bank-theme',
    adityabirla: 'hdfc-bank-theme',
  }
  return map[bankId] || 'hdfc-bank-theme'
}

function getBankLayoutConfig(bankId: string): { hasFixedHeader: boolean; paddingTop: string; showHeroBanner: boolean } {
  if (bankId === 'axis') return { hasFixedHeader: true, paddingTop: '85px', showHeroBanner: false }
  if (bankId === 'hdfc') return { hasFixedHeader: false, paddingTop: '0', showHeroBanner: true }
  return { hasFixedHeader: false, paddingTop: '0', showHeroBanner: true }
}

export default function BankApplicationPage({ params }: { params: { bankId: string } }) {
  const searchParams = useSearchParams()
  const bankId = params.bankId
  const bank = bankInfo[bankId] || bankInfo.hdfc
  const loanTypeSlug = searchParams.get('loanType') || 'personal-loans'
  const loanLabel = LOAN_TYPE_LABELS[loanTypeSlug] || 'Personal Loan'

  const [formData, setFormData] = useState({
    mobileNumber: '',
    day: '',
    month: '',
    year: '',
    sourceOfIncome: 'salaried',
    consentPersonalData: false,
    consentPersonalizedOffers: false,
    consentPerfios: false,
    panCard: null as File | null,
    aadhaarCard: null as File | null,
    // PNB specific fields
    existingCustomer: '',
    referredBy: '',
    loanPurpose: '',
    loanAmount: '',
    gender: '',
    maritalStatus: '',
    email: '',
    name: '',
    residentialStatus: '',
    panNo: '',
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentDistrict: '',
    permanentCity: '',
    permanentState: '',
    permanentPincode: '',
    presentAddressLine1: '',
    presentAddressLine2: '',
    presentDistrict: '',
    presentCity: '',
    presentState: '',
    presentPincode: '',
    sameAsPresentAddress: false,
    sameAsPermanentAddress: false,
  })

  const [activePrimaryTab, setActivePrimaryTab] = useState('personal')
  const [activeSecondaryTab, setActiveSecondaryTab] = useState('personal')

  const [panPreview, setPanPreview] = useState<string | null>(null)
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [appliedData, setAppliedData] = useState<Record<string, unknown> | null>(null)
  const [mobileVerified, setMobileVerified] = useState(false)
  const canProceed = !!(
    formData.mobileNumber.length === 10 &&
    formData.day && formData.month && formData.year &&
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'panCard' | 'aadhaarCard') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert(`Please upload a valid image file (JPG, JPEG, PNG, WEBP, or GIF) for ${field === 'panCard' ? 'PAN Card' : 'Aadhaar Card'}`)
        e.target.value = ''
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File size should be less than 5MB for ${field === 'panCard' ? 'PAN Card' : 'Aadhaar Card'}`)
        e.target.value = ''
        return
      }

      setFormData(prev => ({
        ...prev,
        [field]: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        if (field === 'panCard') {
          setPanPreview(reader.result as string)
        } else {
          setAadhaarPreview(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFile = (field: 'panCard' | 'aadhaarCard') => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }))
    if (field === 'panCard') {
      setPanPreview(null)
    } else {
      setAadhaarPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canProceed) return

    setIsSubmitting(true)

    try {
      // Convert files to base64
      const panCardBase64 = formData.panCard ? await fileToBase64(formData.panCard) : null
      const aadhaarCardBase64 = formData.aadhaarCard ? await fileToBase64(formData.aadhaarCard) : null

      const response = await fetch('/api/bank-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankId,
          bankName: bank.name,
          loanType: loanTypeSlug,
          loanLabel,
          mobileNumber: formData.mobileNumber,
          day: formData.day,
          month: formData.month,
          year: formData.year,
          sourceOfIncome: formData.sourceOfIncome,
          loanAmount: searchParams.get('amount') || '',
          tenure: searchParams.get('tenure') || '',
          tenureUnit: searchParams.get('tenureUnit') || 'Yr',
          consentPersonalData: formData.consentPersonalData,
          consentPersonalizedOffers: formData.consentPersonalizedOffers,
          consentPerfios: formData.consentPerfios,
          panCard: panCardBase64 ? {
            data: panCardBase64,
            filename: formData.panCard!.name,
            contentType: formData.panCard!.type
          } : null,
          aadhaarCard: aadhaarCardBase64 ? {
            data: aadhaarCardBase64,
            filename: formData.aadhaarCard!.name,
            contentType: formData.aadhaarCard!.type
          } : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsApplied(true)
        console.log('Application submitted successfully:', data)
      } else {
        alert(data.error || 'There was an error submitting your application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting bank application:', error)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHdfcSinglePageSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bank-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankId: 'hdfc',
          bankName: bank.name,
          loanType: loanTypeSlug,
          loanLabel: data.loanLabel || loanLabel,
          mobileNumber: data.mobileNumber,
          day: data.day,
          month: data.month,
          year: data.year,
          sourceOfIncome: data.sourceOfIncome,
          consentPersonalData: data.consentPersonalData,
          consentPersonalizedOffers: data.consentPersonalizedOffers,
          consentEligibility: data.consentEligibility,
          pan: data.pan,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          gender: data.gender,
          personalEmail: data.personalEmail,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          addressLine3: data.addressLine3,
          pincode: data.pincode,
          city: data.city,
          state: data.state,
          residenceType: data.residenceType,
          addressDeclaration: data.addressDeclaration,
          employerName: data.employerName,
          monthlyIncome: data.monthlyIncome,
          monthlyEmis: data.monthlyEmis,
          workEmail: data.workEmail,
        }),
      })
      const resData = await response.json()
      if (response.ok) {
        setAppliedData(data)
        setIsApplied(true)
      } else {
        alert(resData.error || 'There was an error submitting your application. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting HDFC application:', err)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleYesSinglePageSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bank-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankId: 'yes',
          bankName: bank.name,
          loanType: loanTypeSlug,
          loanLabel: data.loanLabel || loanLabel,
          name: data.name,
          pan: data.pan,
          isYesBankCustomer: data.isYesBankCustomer,
        }),
      })
      const resData = await response.json()
      if (response.ok) {
        setAppliedData(data)
        setIsApplied(true)
      } else {
        alert(resData.error || 'There was an error submitting your application. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting Yes Bank application:', err)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAxisSinglePageSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bank-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankId: 'axis',
          bankName: bank.name,
          loanType: loanTypeSlug,
          loanLabel: data.loanLabel || loanLabel,
          ...data,
        }),
      })
      const resData = await response.json()
      if (response.ok) {
        setAppliedData(data)
        setIsApplied(true)
      } else {
        alert(resData.error || 'There was an error submitting your application. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting Axis application:', err)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKotakSinglePageSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/bank-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankId: 'kotak',
          bankName: bank.name,
          loanType: loanTypeSlug,
          loanLabel: data.loanLabel || loanLabel,
          mobileNumber: data.mobileNumber,
          ...data,
        }),
      })
      const resData = await response.json()
      if (response.ok) {
        setAppliedData(data)
        setIsApplied(true)
      } else {
        alert(resData.error || 'There was an error submitting your application. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting Kotak application:', err)
      alert('There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1] // Remove data:image/...;base64, prefix
        resolve(base64String)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Inject dynamic styles for bank colors
  useEffect(() => {
    const styleId = `bank-dynamic-styles-${bankId}`
    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `
      .bank-app-page-wrapper .eligibility-button:not(.disabled):hover {
        background: ${bank.primaryColor} !important;
        box-shadow: 0 4px 12px ${bank.primaryColor}40 !important;
      }
    `

    // Hide vector background on all bank apply pages
    const vectorBg = document.getElementById('vectorBackground')
    if (vectorBg) {
      vectorBg.style.display = 'none'
    }

    return () => {
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
      if (vectorBg) {
        vectorBg.style.display = ''
      }
    }
  }, [bankId, bank.primaryColor])

  // Check if bank has a custom header banner image
  const bankHeaderImages: Record<string, string> = {
    hdfc: '/assets/images/hdfc_form.png',
  }
  const hasHeaderImage = bankHeaderImages[bankId]
  const layout = getBankLayoutConfig(bankId)
  const themeClass = getBankThemeClass(bankId)

  /* HDFC: single-page form (all important fields on one page) */
  if (bankId === 'hdfc') {
    return (
      <div className={`bank-app-page-wrapper ${themeClass}`} style={{ position: 'relative', minHeight: '100vh' }}>
        {isApplied && appliedData && (
          <div className="application-success-overlay">
            <div className="success-content-overlay">
              <div className="success-message-box">
                <div className="success-icon-large">✓</div>
                <h2 className="success-title">Applied</h2>
                <p className="success-message">Our team will reach out to you shortly</p>
              </div>
              <div className="application-details-overlay">
                <h3 className="details-title">Application Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Mobile Number:</span>
                    <span className="detail-value">+91 {String(appliedData.mobileNumber || '')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{String(appliedData.day)}/{String(appliedData.month)}/{String(appliedData.year)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{[appliedData.firstName, appliedData.middleName, appliedData.lastName].filter(Boolean).map(String).join(' ')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Source of Income:</span>
                    <span className="detail-value">{String(appliedData.sourceOfIncome) === 'salaried' ? 'Salaried' : 'Self Employed / Professionals / Business'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isApplied && (
          <HDFCSinglePageForm
            bank={bank}
            loanLabel={loanLabel}
            onSubmit={handleHdfcSinglePageSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    )
  }

  if (bankId === 'yes') {
    return (
      <div className={`bank-app-page-wrapper ${themeClass}`} style={{ position: 'relative', minHeight: '100vh' }}>
        {isApplied && appliedData && (
          <div className="application-success-overlay">
            <div className="success-content-overlay">
              <div className="success-message-box">
                <div className="success-icon-large">✓</div>
                <h2 className="success-title">Applied</h2>
                <p className="success-message">Our team will reach out to you shortly</p>
              </div>
              <div className="application-details-overlay">
                <h3 className="details-title">Application Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{String(appliedData.name || '')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">PAN:</span>
                    <span className="detail-value">{String(appliedData.pan || '')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isApplied && (
          <YesBankSinglePageForm bank={bank} loanLabel={loanLabel} onSubmit={handleYesSinglePageSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    )
  }

  if (bankId === 'axis') {
    return (
      <div className={`bank-app-page-wrapper ${themeClass}`} style={{ position: 'relative', minHeight: '100vh' }}>
        {isApplied && appliedData && (
          <div className="application-success-overlay">
            <div className="success-content-overlay">
              <div className="success-message-box">
                <div className="success-icon-large">✓</div>
                <h2 className="success-title">Applied</h2>
                <p className="success-message">Our team will reach out to you shortly</p>
              </div>
              <div className="application-details-overlay">
                <h3 className="details-title">Application Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{String(appliedData.nameAsPerPan || '')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Company:</span>
                    <span className="detail-value">{String(appliedData.companyName || '')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isApplied && (
          <AxisSinglePageForm bank={bank} loanLabel={loanLabel} onSubmit={handleAxisSinglePageSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    )
  }

  if (bankId === 'kotak') {
    return (
      <div className={`bank-app-page-wrapper ${themeClass}`} style={{ position: 'relative', minHeight: '100vh' }}>
        {isApplied && appliedData && (
          <div className="application-success-overlay">
            <div className="success-content-overlay">
              <div className="success-message-box">
                <div className="success-icon-large">✓</div>
                <h2 className="success-title">Applied</h2>
                <p className="success-message">Our team will reach out to you shortly</p>
              </div>
              <div className="application-details-overlay">
                <h3 className="details-title">Application Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{String(appliedData.fullName || '')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Mobile:</span>
                    <span className="detail-value">+91 {String(appliedData.mobileNumber || '')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isApplied && (
          <KotakSinglePageForm bank={bank} loanLabel={loanLabel} onSubmit={handleKotakSinglePageSubmit} isSubmitting={isSubmitting} />
        )}
      </div>
    )
  }

  return (
    <div
      className={`bank-app-page-wrapper ${themeClass}`}
      style={{
        marginTop: 0,
        paddingTop: layout.hasFixedHeader ? '85px' : 0,
        position: 'relative',
        minHeight: layout.hasFixedHeader ? '100vh' : undefined
      }}
    >
      {/* Axis: fixed header only */}
      {bankId === 'axis' && <AxisBankHeader />}

      {/* HDFC: optional header image or full hero */}
      {bankId === 'hdfc' && hasHeaderImage && (
        <div className="bank-hero bank-hero-hdfc-image" style={{ position: isApplied ? 'fixed' : 'relative', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <Image src={bankHeaderImages.hdfc} alt={`${bank.name} ${loanLabel} Offer`} width={1920} height={400} className="hdfc-banner-image" priority style={{ width: '100%', height: 'auto', opacity: isApplied ? 0.3 : 1 }} />
        </div>
      )}
      {bankId === 'hdfc' && !hasHeaderImage && (
        <div className="bank-hero bank-hero-hdfc">
          <div className="bank-hero-bar" style={{ backgroundColor: bank.color }}>
            <div className="bank-hero-bar-inner">
              <Image src={bank.logo} alt={bank.name} width={150} height={50} className="bank-hero-logo" />
            </div>
          </div>
          <div className="bank-app-banner">
            <div className="banner-content">
              <div className="banner-text-section">
                <h1 className="banner-headline">
                  <span className="banner-text-dark">Hey there !</span><br />
                  <span className="banner-text-dark">Your </span>
                  <span className="highlight-red" style={{ color: bank.primaryColor }}>{loanLabel} Offer</span>
                  <span className="banner-text-dark"> is waiting inside.</span>
                </h1>
                <div className="banner-features-box">
                  <div className="banner-feature-item"><svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Quick Funds</span></div>
                  <div className="banner-feature-divider"></div>
                  <div className="banner-feature-item"><svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="10" cy="13" r="2" fill="#E31837"/><line x1="8" y1="13" x2="12" y2="13" stroke="#E31837" strokeWidth="2"/></svg><span>No Physical Documentation</span></div>
                  <div className="banner-feature-divider"></div>
                  <div className="banner-feature-item"><svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Fast Loan Process</span></div>
                </div>
              </div>
              <div className="banner-image-section">
                <div className="banner-person-image">
                  <div className="person-illustration">
                    <div className="person-head">👨</div>
                    <div className="person-phone">
                      <div className="phone-screen">
                        <div className="phone-logo-small">HDFC</div>
                        <div className="phone-checkmark">✓</div>
                        <div className="phone-text">Loan Approved</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ICICI: bank bar with logo + name only */}
      {bankId === 'icici' && (
        <div className="bank-hero bank-hero-icici">
          <div className="bank-hero-bar bank-hero-bar-icici">
            <div className="bank-hero-bar-inner">
              <Image src={bank.logo} alt={bank.name} width={140} height={44} className="bank-hero-logo" />
              <span className="bank-hero-brand-text">ICICI BANK</span>
            </div>
          </div>
        </div>
      )}

      {/* IndusInd: bank bar with logo + name only */}
      {bankId === 'indusind' && (
        <div className="bank-hero bank-hero-indusind">
          <div className="bank-hero-bar bank-hero-bar-indusind">
            <div className="bank-hero-bar-inner">
              <Image src={bank.logo} alt={bank.name} width={140} height={44} className="bank-hero-logo" />
              <span className="bank-hero-brand-text">INDUSIND BANK</span>
            </div>
          </div>
        </div>
      )}

      {/* YES Bank: bank bar with logo + name only */}
      {bankId === 'yes' && (
        <div className="bank-hero bank-hero-yes">
          <div className="bank-hero-bar bank-hero-bar-yes">
            <div className="bank-hero-bar-inner">
              <Image src={bank.logo} alt={bank.name} width={140} height={44} className="bank-hero-logo" />
              <span className="bank-hero-brand-text">YES BANK</span>
            </div>
          </div>
        </div>
      )}

      {/* IDFC: bank bar with logo + name only */}
      {bankId === 'idfc' && (
        <div className="bank-hero bank-hero-idfc">
          <div className="bank-hero-bar bank-hero-bar-idfc">
            <div className="bank-hero-bar-inner">
              <Image src={bank.logo} alt={bank.name} width={140} height={44} className="bank-hero-logo" />
              <span className="bank-hero-brand-text">IDFC FIRST BANK</span>
            </div>
          </div>
        </div>
      )}

      {/* Kotak: bank bar with logo + name only */}
      {bankId === 'kotak' && (
        <div className="bank-hero bank-hero-kotak">
          <div className="bank-hero-bar bank-hero-bar-kotak">
            <div className="bank-hero-bar-inner">
              <Image src={bank.logo} alt={bank.name} width={140} height={44} className="bank-hero-logo" />
              <span className="bank-hero-brand-text">KOTAK MAHINDRA BANK</span>
            </div>
          </div>
        </div>
      )}

      {/* Bajaj / AU / Aditya Birla: bank bar (for overdraft etc.) */}
      {(bankId === 'bajaj' || bankId === 'au' || bankId === 'adityabirla') && (
        <div className="bank-hero bank-hero-icici">
          <div className="bank-hero-bar bank-hero-bar-icici" style={{ background: bank.primaryColor }}>
            <div className="bank-hero-bar-inner">
              <Image src={bank.logo} alt={bank.name} width={140} height={44} className="bank-hero-logo" />
              <span className="bank-hero-brand-text">{bank.name.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay (IDFC: "Application submitted" + Thank you at bottom) */}
      {isApplied && (
        <div className="application-success-overlay">
          <div className="success-content-overlay">
            <div className="success-message-box">
              <div className="success-icon-large">✓</div>
              <h2 className="success-title">{bankId === 'idfc' ? 'Application submitted' : 'Applied'}</h2>
              <p className="success-message">{bankId === 'idfc' ? 'Our team will reach out to you shortly.' : 'Our team will reach out to you shortly'}</p>
              {bankId === 'idfc' && <p className="success-thank-you">Thank you</p>}
            </div>
            <div className="application-details-overlay">
              <h3 className="details-title">Application Details</h3>
              <div className="details-grid">
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
                  <span className="detail-value">{formData.sourceOfIncome === 'salaried' ? 'Salaried' : 'Self Employed / Professionals / Business'}</span>
                </div>
                {formData.panCard && (
                  <div className="detail-item">
                    <span className="detail-label">PAN Card:</span>
                    <span className="detail-value">✓ Uploaded ({formData.panCard.name})</span>
                  </div>
                )}
                {formData.aadhaarCard && (
                  <div className="detail-item">
                    <span className="detail-label">Aadhaar Card:</span>
                    <span className="detail-value">✓ Uploaded ({formData.aadhaarCard.name})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Card - layout class per bank for distinct form styling */}
      {!isApplied && (
        <div className={`bank-app-form-container bank-form-layout bank-form-layout-${bankId}`}>
          <div className="bank-app-form-card">
            <>
              <h2 className="form-welcome-title">Apply for {loanLabel} – {bank.name}</h2>
              <p className="form-welcome-subtitle">Welcome! Check your {loanLabel} offer</p>

                <form onSubmit={handleSubmit} className="bank-app-form">
                  {/* Mobile Number */}
                  <div className="form-field-group">
                    <label className="form-field-label">Your registered mobile number</label>
                    <div className="mobile-input-wrapper">
                      <span className="country-code">+91</span>
                      <input
                        type="tel"
                        name="mobileNumber"
                        className="form-input-mobile"
                        placeholder="Enter 10-digit number"
                        value={formData.mobileNumber}
                        onChange={(e) => {
                          handleChange(e)
                          setMobileVerified(false)
                        }}
                        maxLength={10}
                        required
                      />
                    </div>
                    <OtpVerification
                      mobile={formData.mobileNumber}
                      onVerified={() => setMobileVerified(true)}
                      verified={mobileVerified}
                    />
                    <p className="form-hint-text">Please have it handy to verify OTP</p>
                  </div>

                  {/* Date of Birth */}
                  <div className="form-field-group">
                    <label className="form-field-label">Your Date of Birth</label>
                    <div className="dob-inputs">
                      <input
                        type="text"
                        name="day"
                        className="dob-input"
                        placeholder="DD"
                        value={formData.day}
                        onChange={handleChange}
                        maxLength={2}
                        required
                      />
                      <input
                        type="text"
                        name="month"
                        className="dob-input"
                        placeholder="MM"
                        value={formData.month}
                        onChange={handleChange}
                        maxLength={2}
                        required
                      />
                      <input
                        type="text"
                        name="year"
                        className="dob-input"
                        placeholder="YYYY"
                        value={formData.year}
                        onChange={handleChange}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  {/* PAN Number */}
                  <div className="form-field-group">
                    <label className="form-field-label">PAN Number</label>
                    <input
                      type="text"
                      name="panNo"
                      className="form-input form-input-pan"
                      placeholder="e.g. ABCDE1234F"
                      value={formData.panNo}
                      onChange={handleChange}
                      maxLength={10}
                      required
                    />
                    <p className="form-hint-text">5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)</p>
                  </div>

                  {/* Source of Income */}
                  <div className="form-field-group">
                    <label className="form-field-label">Your source of income</label>
                    <div className="radio-group-bank">
                      <label className={`radio-option-bank ${formData.sourceOfIncome === 'salaried' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="sourceOfIncome"
                          value="salaried"
                          checked={formData.sourceOfIncome === 'salaried'}
                          onChange={handleChange}
                          required
                        />
                        <div className="radio-content">
                          <span className="radio-label">Salaried</span>
                          {formData.sourceOfIncome === 'salaried' && (
                            <div className="info-box-yellow">
                              Income verification or salary proof maybe required for processing loan request
                            </div>
                          )}
                        </div>
                      </label>
                      <label className={`radio-option-bank ${formData.sourceOfIncome === 'self-employed' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="sourceOfIncome"
                          value="self-employed"
                          checked={formData.sourceOfIncome === 'self-employed'}
                          onChange={handleChange}
                        />
                        <div className="radio-content">
                          <span className="radio-label">Self Employed / Professionals / Business</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* PAN Card Upload */}
                  <div className="form-field-group">
                    <label className="form-field-label">Upload PAN Card</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="panCard"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(e) => handleFileChange(e, 'panCard')}
                        className="file-input-hidden"
                      />
                      <label htmlFor="panCard" className="file-upload-label">
                        <span className="file-upload-icon">📄</span>
                        <span className="file-upload-text">
                          {formData.panCard ? formData.panCard.name : 'Choose file (JPG, JPEG, PNG, WEBP, GIF - Max 5MB)'}
                        </span>
                      </label>
                      {panPreview && (
                        <div className="file-preview-container">
                          <img src={panPreview} alt="PAN Card Preview" className="file-preview-image" />
                          <button
                            type="button"
                            onClick={() => removeFile('panCard')}
                            className="file-remove-button"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="form-hint-text">Accepted formats: JPG, JPEG, PNG, WEBP, GIF (Max 5MB)</p>
                  </div>

                  {/* Aadhaar Card Upload */}
                  <div className="form-field-group">
                    <label className="form-field-label">Upload Aadhaar Card</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="aadhaarCard"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(e) => handleFileChange(e, 'aadhaarCard')}
                        className="file-input-hidden"
                      />
                      <label htmlFor="aadhaarCard" className="file-upload-label">
                        <span className="file-upload-icon">📄</span>
                        <span className="file-upload-text">
                          {formData.aadhaarCard ? formData.aadhaarCard.name : 'Choose file (JPG, JPEG, PNG, WEBP, GIF - Max 5MB)'}
                        </span>
                      </label>
                      {aadhaarPreview && (
                        <div className="file-preview-container">
                          <img src={aadhaarPreview} alt="Aadhaar Card Preview" className="file-preview-image" />
                          <button
                            type="button"
                            onClick={() => removeFile('aadhaarCard')}
                            className="file-remove-button"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="form-hint-text">Accepted formats: JPG, JPEG, PNG, WEBP, GIF (Max 5MB)</p>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="consent-group">
                    <label className="consent-checkbox-label">
                      <input
                        type="checkbox"
                        name="consentPersonalData"
                        checked={formData.consentPersonalData}
                        onChange={handleChange}
                        required
                      />
                      <span><span className="required-asterisk">*</span> I hereby consent to collection and processing of my data for availing this loan and relevant services in the manner described in the notice <a href="#" className="consent-link-text" style={{ color: bank.primaryColor }}>here</a></span>
                    </label>
                    <label className="consent-checkbox-label">
                      <input
                        type="checkbox"
                        name="consentPerfios"
                        checked={formData.consentPerfios}
                        onChange={handleChange}
                        required
                      />
                      <span><span className="required-asterisk">*</span> I have read, understood, and hereby accept the <a href="#" className="consent-link-text" style={{ color: bank.primaryColor }}>Privacy Policy</a> of {bank.name} Ltd. I/we hereby give the consent in relation to Requested Products. I Agree to <a href="#" className="consent-link-text" style={{ color: bank.primaryColor }}>Perfios T&C</a></span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`eligibility-button ${!canProceed ? 'disabled' : ''}`}
                    disabled={!canProceed || isSubmitting}
                    style={canProceed ? {
                      background: bank.primaryColor,
                      boxShadow: `0 4px 12px ${bank.primaryColor}40`
                    } : {}}
                  >
                    {isSubmitting ? 'Submitting...' : 'Apply Now'}
                  </button>

                  {/* Footer Text */}
                  <p className="form-footer-text">
                    For full details read our <a href="#" className="footer-link" style={{ color: bank.primaryColor }}>Terms & Conditions</a> and <a href="#" className="footer-link" style={{ color: bank.primaryColor }}>Privacy Policy</a>
                  </p>
                </form>
            </>
          </div>
        </div>
      )}
    </div>
  )
}

// PNB Form Structure Component
function PNBFormStructure({
  formData,
  handleChange,
  handleSubmit,
  bank,
  activePrimaryTab,
  setActivePrimaryTab,
  activeSecondaryTab,
  setActiveSecondaryTab,
  canProceed,
  isSubmitting,
}: {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  bank: any
  activePrimaryTab: string
  setActivePrimaryTab: (tab: string) => void
  activeSecondaryTab: string
  setActiveSecondaryTab: (tab: string) => void
  canProceed: boolean
  isSubmitting: boolean
}) {
  const handleAddressCopy = (type: 'permanent' | 'present') => {
    if (type === 'permanent') {
      if (formData.sameAsPresentAddress) {
        // Copy present address to permanent
        // This would need to be handled in the parent component
      }
    } else {
      if (formData.sameAsPermanentAddress) {
        // Copy permanent address to present
        // This would need to be handled in the parent component
      }
    }
  }

  return (
    <div className="pnb-form-wrapper">
      {/* Primary Tabs */}
      <div className="pnb-primary-tabs">
        <button
          type="button"
          className={`pnb-primary-tab ${activePrimaryTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActivePrimaryTab('personal')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
            <circle cx="12" cy="13" r="2"></circle>
          </svg>
          Personal Details
        </button>
        <button
          type="button"
          className={`pnb-primary-tab ${activePrimaryTab === 'employment' ? 'active' : ''}`}
          onClick={() => setActivePrimaryTab('employment')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Employment Details
        </button>
        <button
          type="button"
          className={`pnb-primary-tab ${activePrimaryTab === 'asset' ? 'active' : ''}`}
          onClick={() => setActivePrimaryTab('asset')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          Asset Details
        </button>
      </div>

      {/* Secondary Tabs - Only show for Personal Details */}
      {activePrimaryTab === 'personal' && (
        <div className="pnb-secondary-tabs">
          <button
            type="button"
            className={`pnb-secondary-tab ${activeSecondaryTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveSecondaryTab('personal')}
          >
            Personal Details
          </button>
          <button
            type="button"
            className={`pnb-secondary-tab ${activeSecondaryTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveSecondaryTab('address')}
          >
            Address Details
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="pnb-form">
        {activePrimaryTab === 'personal' && activeSecondaryTab === 'personal' && (
          <div className="pnb-form-content">
            <div className="pnb-mandatory-note">The fields with * are mandatory.</div>

            <div className="pnb-form-two-column">
              {/* Left Column */}
              <div className="pnb-form-column">
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Are you an existing PNB customer *</label>
                  <div className="pnb-radio-group">
                    <label className="pnb-radio-label">
                      <input
                        type="radio"
                        name="existingCustomer"
                        value="yes"
                        checked={formData.existingCustomer === 'yes'}
                        onChange={handleChange}
                        required
                      />
                      <span>Yes</span>
                    </label>
                    <label className="pnb-radio-label">
                      <input
                        type="radio"
                        name="existingCustomer"
                        value="no"
                        checked={formData.existingCustomer === 'no'}
                        onChange={handleChange}
                        required
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Referred by</label>
                  <select
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    className="pnb-form-select"
                  >
                    <option value="">- SELECT -</option>
                    <option value="friend">Friend</option>
                    <option value="relative">Relative</option>
                    <option value="colleague">Colleague</option>
                    <option value="advertisement">Advertisement</option>
                  </select>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Loan Purpose *</label>
                  <select
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleChange}
                    className="pnb-form-select"
                    required
                  >
                    <option value="">- SELECT -</option>
                    <option value="medical">Medical</option>
                    <option value="education">Education</option>
                    <option value="wedding">Wedding</option>
                    <option value="home-renovation">Home Renovation</option>
                    <option value="debt-consolidation">Debt Consolidation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Loan Amount *</label>
                  <input
                    type="text"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className="pnb-form-input"
                    placeholder="Enter loan amount"
                    required
                  />
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="pnb-form-select"
                    required
                  >
                    <option value="">- SELECT -</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Marital Status *</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="pnb-form-select"
                    required
                  >
                    <option value="">- SELECT -</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Mobile No *</label>
                  <div className="pnb-mobile-wrapper">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="pnb-form-input"
                      placeholder="Enter mobile number"
                      maxLength={10}
                      required
                    />
                    <button type="button" className="pnb-verify-button">Verify</button>
                  </div>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pnb-form-input"
                    placeholder="Enter email address"
                    required
                  />
                  <a href="#" className="pnb-privacy-link">Privacy policy</a>
                </div>
              </div>

              {/* Right Column */}
              <div className="pnb-form-column">
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Loan Type *</label>
                  <input
                    type="text"
                    value="PERSONAL LOAN"
                    className="pnb-form-input pnb-readonly"
                    readOnly
                  />
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pnb-form-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Date of Birth *</label>
                  <input
                    type="text"
                    name="dob"
                    value={`${formData.day || 'DD'}/${formData.month || 'MM'}/${formData.year || 'YYYY'}`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 8) {
                        const day = value.slice(0, 2)
                        const month = value.slice(2, 4)
                        const year = value.slice(4, 8)
                        handleChange({ target: { name: 'day', value: day } } as any)
                        handleChange({ target: { name: 'month', value: month } } as any)
                        handleChange({ target: { name: 'year', value: year } } as any)
                      }
                    }}
                    className="pnb-form-input"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">Residential Status *</label>
                  <select
                    name="residentialStatus"
                    value={formData.residentialStatus}
                    onChange={handleChange}
                    className="pnb-form-select"
                    required
                  >
                    <option value="">- SELECT -</option>
                    <option value="resident-indian">Resident Indian</option>
                    <option value="nri">NRI</option>
                    <option value="pio">PIO</option>
                  </select>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">
                    <input
                      type="checkbox"
                      name="consentPersonalData"
                      checked={formData.consentPersonalData}
                      onChange={handleChange}
                      required
                    />
                    <span className="pnb-consent-text">
                      I authorise PNB and its representatives to call me or sms me with reference to my application, this consent will override any registration for dnd/ndnc. I have read and acknowledged pnb bank's data privacy notice
                    </span>
                  </label>
                </div>

                <div className="pnb-form-field">
                  <label className="pnb-form-label">PAN No *</label>
                  <input
                    type="text"
                    name="panNo"
                    value={formData.panNo}
                    onChange={handleChange}
                    className="pnb-form-input"
                    placeholder="Enter PAN number"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activePrimaryTab === 'personal' && activeSecondaryTab === 'address' && (
          <div className="pnb-form-content">
            <div className="pnb-address-section">
              <div className="pnb-address-column">
                <h3 className="pnb-address-title">Permanent Address</h3>
                <label className="pnb-checkbox-label">
                  <input
                    type="checkbox"
                    name="sameAsPresentAddress"
                    checked={formData.sameAsPresentAddress}
                    onChange={handleChange}
                  />
                  <span>Same as Present address</span>
                </label>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    name="permanentAddressLine1"
                    value={formData.permanentAddressLine1}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Address Line 2 *</label>
                  <input
                    type="text"
                    name="permanentAddressLine2"
                    value={formData.permanentAddressLine2}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">District *</label>
                  <input
                    type="text"
                    name="permanentDistrict"
                    value={formData.permanentDistrict}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">City *</label>
                  <input
                    type="text"
                    name="permanentCity"
                    value={formData.permanentCity}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">State *</label>
                  <input
                    type="text"
                    name="permanentState"
                    value={formData.permanentState}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Pincode *</label>
                  <input
                    type="text"
                    name="permanentPincode"
                    value={formData.permanentPincode}
                    onChange={handleChange}
                    className="pnb-form-input"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div className="pnb-address-column">
                <h3 className="pnb-address-title">Present Address</h3>
                <label className="pnb-checkbox-label">
                  <input
                    type="checkbox"
                    name="sameAsPermanentAddress"
                    checked={formData.sameAsPermanentAddress}
                    onChange={handleChange}
                  />
                  <span>Same as Permanent address</span>
                </label>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    name="presentAddressLine1"
                    value={formData.presentAddressLine1}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Address Line 2 *</label>
                  <input
                    type="text"
                    name="presentAddressLine2"
                    value={formData.presentAddressLine2}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">District *</label>
                  <input
                    type="text"
                    name="presentDistrict"
                    value={formData.presentDistrict}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">City *</label>
                  <input
                    type="text"
                    name="presentCity"
                    value={formData.presentCity}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">State *</label>
                  <input
                    type="text"
                    name="presentState"
                    value={formData.presentState}
                    onChange={handleChange}
                    className="pnb-form-input"
                    required
                  />
                </div>
                <div className="pnb-form-field">
                  <label className="pnb-form-label">Pincode *</label>
                  <input
                    type="text"
                    name="presentPincode"
                    value={formData.presentPincode}
                    onChange={handleChange}
                    className="pnb-form-input"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activePrimaryTab === 'employment' && (
          <div className="pnb-form-content">
            <p className="pnb-placeholder-text">Employment Details section - To be implemented</p>
          </div>
        )}

        {activePrimaryTab === 'asset' && (
          <div className="pnb-form-content">
            <p className="pnb-placeholder-text">Asset Details section - To be implemented</p>
          </div>
        )}

        <div className="pnb-form-actions">
          <button
            type="submit"
            className={`pnb-submit-button ${!canProceed ? 'disabled' : ''}`}
            disabled={!canProceed || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}
