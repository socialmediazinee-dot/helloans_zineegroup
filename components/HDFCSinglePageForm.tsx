'use client'

import { useState } from 'react'
import Image from 'next/image'

const RESIDENCE_TYPES = [
  { value: '', label: 'Select One' },
  { value: 'owned', label: 'Owned' },
  { value: 'rented', label: 'Rented' },
  { value: 'parental', label: 'Parental' },
  { value: 'company', label: 'Company Provided' },
]

export default function HDFCSinglePageForm({
  bank,
  loanLabel,
  onSubmit,
  isSubmitting,
}: {
  bank: { name: string; logo: string; color: string; primaryColor: string }
  loanLabel: string
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  isSubmitting: boolean
}) {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    day: '',
    month: '',
    year: '',
    sourceOfIncome: 'salaried',
    pan: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    personalEmail: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pincode: '',
    city: '',
    state: '',
    residenceType: '',
    addressDeclaration: false,
    employerName: '',
    monthlyIncome: '',
    monthlyEmis: '',
    workEmail: '',
    consentPersonalData: false,
    consentPersonalizedOffers: false,
    consentEligibility: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const formatPan = (value: string) => {
    const v = value.replace(/\s/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (v.length <= 5) return v
    if (v.length <= 9) return `${v.slice(0, 5)} ${v.slice(5)}`
    return `${v.slice(0, 5)} ${v.slice(5, 9)} ${v.slice(9, 10)}`
  }

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, pan: formatPan(raw) }))
  }

  const canSubmit =
    formData.mobileNumber.length === 10 &&
    formData.day &&
    formData.month &&
    formData.year &&
    formData.pan.length >= 10 &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.gender &&
    formData.personalEmail.trim() &&
    formData.addressLine1.trim() &&
    formData.pincode.length >= 6 &&
    formData.city.trim() &&
    formData.state.trim() &&
    formData.residenceType &&
    formData.addressDeclaration &&
    formData.employerName.trim() &&
    formData.monthlyIncome.trim() &&
    formData.consentPersonalData &&
    formData.consentEligibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || isSubmitting) return
    await onSubmit({
      ...formData,
      loanLabel,
      bankName: bank.name,
    })
  }

  return (
    <div className="hdfc-single-page">
      {/* Header: logo + Help */}
      <div className="hdfc-single-header" style={{ backgroundColor: bank.color }}>
        <div className="hdfc-single-header-inner">
          <Image src={bank.logo} alt={bank.name} width={140} height={44} className="hdfc-single-logo" />
          <a href="#" className="hdfc-single-help">Help</a>
        </div>
      </div>

      {/* Banner */}
      <div className="hdfc-single-banner">
        <div className="hdfc-single-banner-inner">
          <h1 className="hdfc-single-banner-title">
            Hey there! Your <span style={{ color: bank.primaryColor }}>{loanLabel} Offer</span> is waiting inside.
          </h1>
          <div className="hdfc-single-banner-features">
            <span>Quick Funds</span>
            <span className="hdfc-single-banner-divider">|</span>
            <span>No Physical Documentation</span>
            <span className="hdfc-single-banner-divider">|</span>
            <span>Fast Loan Process</span>
          </div>
          <p className="hdfc-single-banner-tc">T&C apply</p>
        </div>
      </div>

      <div className="hdfc-single-form-wrap">
        <p className="hdfc-single-intro">Please provide following details to process your application</p>

        <form onSubmit={handleSubmit} className="hdfc-single-form">
          {/* Personal Details */}
          <section className="hdfc-single-section">
            <h2 className="hdfc-single-section-title">PERSONAL DETAILS</h2>
            <div className="hdfc-single-fields">
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your PAN</label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handlePanChange}
                  placeholder="XXXXX XXXX X"
                  maxLength={12}
                  className="hdfc-single-input"
                  required
                />
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your full name (as per PAN)</label>
                <div className="hdfc-single-info-box">
                  If your name on PAN is &quot;Amit K Dubey&quot; then please fill further details as &quot;Amit&quot; &quot;K&quot; &quot;Dubey&quot;
                </div>
                <div className="hdfc-single-name-row">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name (as per PAN)"
                    className="hdfc-single-input"
                    required
                  />
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle Name (as per PAN)"
                    className="hdfc-single-input"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name (as per PAN)"
                    className="hdfc-single-input"
                    required
                  />
                </div>
                <p className="hdfc-single-hint">Leave blank if not present in PAN</p>
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your gender</label>
                <div className="hdfc-single-radio-row">
                  <label className="hdfc-single-radio-label">
                    <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required />
                    <span>Male</span>
                  </label>
                  <label className="hdfc-single-radio-label">
                    <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                    <span>Female</span>
                  </label>
                  <label className="hdfc-single-radio-label">
                    <input type="radio" name="gender" value="neutral" checked={formData.gender === 'neutral'} onChange={handleChange} />
                    <span>Gender Neutral</span>
                  </label>
                </div>
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your Personal Email Address</label>
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  placeholder="Enter Details"
                  className="hdfc-single-input"
                  required
                />
              </div>
            </div>
          </section>

          {/* Contact & DOB */}
          <section className="hdfc-single-section">
            <h2 className="hdfc-single-section-title">CONTACT & ELIGIBILITY</h2>
            <div className="hdfc-single-fields">
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your registered mobile number</label>
                <div className="hdfc-single-mobile-wrap">
                  <span className="hdfc-single-country-code">+91</span>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className="hdfc-single-input"
                    required
                  />
                </div>
                <p className="hdfc-single-hint">Please have it handy to verify OTP</p>
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your Date of Birth</label>
                <div className="hdfc-single-dob-row">
                  <input type="text" name="day" value={formData.day} onChange={handleChange} placeholder="DD" maxLength={2} className="hdfc-single-input hdfc-single-dob" required />
                  <input type="text" name="month" value={formData.month} onChange={handleChange} placeholder="MM" maxLength={2} className="hdfc-single-input hdfc-single-dob" required />
                  <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="YYYY" maxLength={4} className="hdfc-single-input hdfc-single-dob" required />
                </div>
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your source of income</label>
                <div className="hdfc-single-radio-row">
                  <label className={`hdfc-single-radio-label ${formData.sourceOfIncome === 'salaried' ? 'selected' : ''}`}>
                    <input type="radio" name="sourceOfIncome" value="salaried" checked={formData.sourceOfIncome === 'salaried'} onChange={handleChange} required />
                    <span>Salaried</span>
                  </label>
                  <label className={`hdfc-single-radio-label ${formData.sourceOfIncome === 'self-employed' ? 'selected' : ''}`}>
                    <input type="radio" name="sourceOfIncome" value="self-employed" checked={formData.sourceOfIncome === 'self-employed'} onChange={handleChange} />
                    <span>Self Employed / Professionals / Business</span>
                  </label>
                </div>
                {formData.sourceOfIncome === 'salaried' && (
                  <div className="hdfc-single-info-box">Income verification or salary proof maybe required for processing loan request</div>
                )}
              </div>
            </div>
          </section>

          {/* Current Address */}
          <section className="hdfc-single-section">
            <h2 className="hdfc-single-section-title">YOUR CURRENT RESIDENTIAL ADDRESS</h2>
            <p className="hdfc-single-section-sub">Would be used for communication purposes</p>
            <div className="hdfc-single-fields">
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Address line 1</label>
                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Enter Details" className="hdfc-single-input" required />
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Address line 2</label>
                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Enter Details" className="hdfc-single-input" />
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Address line 3 (Optional)</label>
                <input type="text" name="addressLine3" value={formData.addressLine3} onChange={handleChange} placeholder="Enter Details" className="hdfc-single-input" />
              </div>
              <div className="hdfc-single-field-row">
                <div className="hdfc-single-field">
                  <label className="hdfc-single-label">PIN Code</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter Details" maxLength={6} className="hdfc-single-input" required />
                </div>
                <div className="hdfc-single-field">
                  <label className="hdfc-single-label">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Start Typing" className="hdfc-single-input" required />
                </div>
                <div className="hdfc-single-field">
                  <label className="hdfc-single-label">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Start Typing" className="hdfc-single-input" required />
                </div>
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Residence Type</label>
                <select name="residenceType" value={formData.residenceType} onChange={handleChange} className="hdfc-single-select" required>
                  {RESIDENCE_TYPES.map(opt => (
                    <option key={opt.value || 'select'} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <label className="hdfc-single-checkbox-label">
                <input type="checkbox" name="addressDeclaration" checked={formData.addressDeclaration} onChange={handleChange} required />
                <span><span className="required-asterisk">*</span> I hereby declare the above address as current address (as well as communication address) and the same should be updated in bank records.</span>
              </label>
            </div>
          </section>

          {/* Employment */}
          <section className="hdfc-single-section">
            <h2 className="hdfc-single-section-title">EMPLOYMENT DETAILS</h2>
            <div className="hdfc-single-fields">
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your employer / company name</label>
                <input
                  type="text"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleChange}
                  placeholder="Start Typing"
                  className="hdfc-single-input"
                  required
                />
                <p className="hdfc-single-hint">Type minimum 3 letters and pick from the list</p>
                <div className="hdfc-single-info-box">
                  Please enter full legal name of your employer, for example, if you work in TCS, please enter &quot;Tata Consultancy Services&quot; and select the option from the list.
                </div>
              </div>
              <div className="hdfc-single-field-row">
                <div className="hdfc-single-field">
                  <label className="hdfc-single-label">Your monthly net income (salary)</label>
                  <div className="hdfc-single-rupee-wrap">
                    <span className="hdfc-single-rupee">₹</span>
                    <input
                      type="text"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      placeholder="Enter Details"
                      className="hdfc-single-input"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>
                <div className="hdfc-single-field">
                  <label className="hdfc-single-label">Your ongoing monthly EMIs (if any)</label>
                  <div className="hdfc-single-rupee-wrap">
                    <span className="hdfc-single-rupee">₹</span>
                    <input
                      type="text"
                      name="monthlyEmis"
                      value={formData.monthlyEmis}
                      onChange={handleChange}
                      placeholder="Enter Details"
                      className="hdfc-single-input"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
              <div className="hdfc-single-field">
                <label className="hdfc-single-label">Your work email address</label>
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  placeholder="Enter Details"
                  className="hdfc-single-input"
                />
                <p className="hdfc-single-hint">Necessary for faster processing of your application</p>
              </div>
            </div>
          </section>

          {/* Consents */}
          <section className="hdfc-single-section hdfc-single-consent-section">
            <label className="hdfc-single-checkbox-label">
              <input type="checkbox" name="consentPersonalData" checked={formData.consentPersonalData} onChange={handleChange} required />
              <span><span className="required-asterisk">*</span> I hereby consent to collection and processing of my data for availing this loan and relevant services in the manner described in the notice <a href="#" style={{ color: bank.primaryColor }}>here</a></span>
            </label>
            <label className="hdfc-single-checkbox-label">
              <input type="checkbox" name="consentPersonalizedOffers" checked={formData.consentPersonalizedOffers} onChange={handleChange} />
              <span>I hereby consent to processing of my Data for sending me personalized offers on other products and services of {bank.name}, its affiliates, and partners through Call, SMS, WhatsApp, Email or other channels in the manner described in the notice <a href="#" style={{ color: bank.primaryColor }}>here</a></span>
            </label>
            <label className="hdfc-single-checkbox-label">
              <input type="checkbox" name="consentEligibility" checked={formData.consentEligibility} onChange={handleChange} required />
              <span><span className="required-asterisk">*</span> I hereby give my consent to use the above information to check my eligibility & agree to abide by the Terms and Conditions laid down by the Bank</span>
            </label>
            <button
              type="submit"
              className="hdfc-single-submit"
              disabled={!canSubmit || isSubmitting}
              style={{ backgroundColor: canSubmit ? bank.primaryColor : '#94a3b8' }}
            >
              {isSubmitting ? 'Submitting...' : 'View Loan Eligibility >>'}
            </button>
          </section>
        </form>
      </div>

      {/* Footer */}
      <footer className="hdfc-single-footer" style={{ backgroundColor: bank.color }}>
        <div className="hdfc-single-footer-inner">
          <span>© Copyright {bank.name} Ltd.</span>
          <a href="#" className="hdfc-single-save">Save For later</a>
        </div>
      </footer>
    </div>
  )
}
