'use client'

import { useState } from 'react'
import Image from 'next/image'
import RupeeIcon from '@/components/RupeeIcon'

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Other']

export default function KotakSinglePageForm({
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
  const formatPan = (value: string) => {
    const v = value.replace(/\s/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    if (v.length <= 5) return v
    if (v.length <= 9) return `${v.slice(0, 5)} ${v.slice(5)}`
    return `${v.slice(0, 5)} ${v.slice(5, 9)} ${v.slice(9, 10)}`
  }

  const [existingCustomer, setExistingCustomer] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    pan: '',
    fullName: '',
    mobileNumber: '',
    personalEmail: '',
    employmentType: 'salaried',
    netMonthlySalary: '',
    currentCity: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const canSubmit =
    formData.pan.replace(/\s/g, '').length >= 10 &&
    formData.fullName.trim() &&
    formData.mobileNumber.length === 10 &&
    formData.netMonthlySalary.trim() &&
    formData.currentCity.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || isSubmitting) return
    await onSubmit({
      ...formData,
      existingCustomer,
      loanLabel,
      bankName: bank.name,
    })
  }

  if (existingCustomer === null) {
    return (
      <div className="kotak-single-page">
        <header className="kotak-single-header">
          <Image src={bank.logo} alt={bank.name} width={160} height={48} className="kotak-single-logo" />
        </header>
        <div className="kotak-single-choice-wrap">
          <h2 className="kotak-single-choice-title">Are you an existing customer?</h2>
          <p className="kotak-single-choice-hint">Please select an option to continue</p>
          <div className="kotak-single-choice-btns">
            <button type="button" className="kotak-single-choice-btn kotak-single-choice-yes" onClick={() => setExistingCustomer(true)} style={{ backgroundColor: bank.primaryColor }}>
              Yes, I&apos;m an existing customer
            </button>
            <button type="button" className="kotak-single-choice-btn kotak-single-choice-no" onClick={() => setExistingCustomer(false)}>
              No, I&apos;m new here
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="kotak-single-page">
      <header className="kotak-single-header">
        <Image src={bank.logo} alt={bank.name} width={160} height={48} className="kotak-single-logo" />
        <div className="kotak-single-steps">
          <span className="active">1 Application</span>
          <span>2 Offer</span>
          <span>3 Disbursal</span>
        </div>
      </header>
      <div className="kotak-single-form-wrap">
        <h2 className="kotak-single-title">Apply now to get a Personal Loan!</h2>
        <p className="kotak-single-subtitle">Fill in the required details and our representative will get in touch with you soon.</p>
        <ul className="kotak-single-features">
          <li>Get up to Rs.35 lakh</li>
          <li>Flexible Tenure</li>
          <li>Swift Approvals</li>
        </ul>
        <form onSubmit={handleSubmit} className="kotak-single-form">
          <div className="kotak-single-field">
            <label>PAN Number</label>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={(e) => setFormData(prev => ({ ...prev, pan: formatPan(e.target.value.replace(/\s/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '')) }))}
              placeholder="XXXXX XXXX X"
              maxLength={12}
              required
            />
          </div>
          <div className="kotak-single-field">
            <label>Full name (as per PAN)</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter here" required />
          </div>
          <div className="kotak-single-field">
            <label>Mobile number</label>
            <div className="kotak-single-mobile">
              <span className="kotak-single-country">+91</span>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Enter 10-digit number" maxLength={10} required />
            </div>
          </div>
          <div className="kotak-single-field">
            <label>Personal email ID</label>
            <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} placeholder="Enter email" />
          </div>
          <div className="kotak-single-field">
            <label>Employment Type</label>
            <div className="kotak-single-employment">
              <label className={formData.employmentType === 'salaried' ? 'selected' : ''}>
                <input type="radio" name="employmentType" value="salaried" checked={formData.employmentType === 'salaried'} onChange={handleChange} /> Salaried
              </label>
              <label className={formData.employmentType === 'self-employed' ? 'selected' : ''}>
                <input type="radio" name="employmentType" value="self-employed" checked={formData.employmentType === 'self-employed'} onChange={handleChange} /> Self-employed
              </label>
            </div>
          </div>
          <div className="kotak-single-field">
            <label>Net monthly in-hand salary</label>
            <div className="kotak-single-rupee">
              <span><RupeeIcon size={16} /></span>
              <input type="text" name="netMonthlySalary" value={formData.netMonthlySalary} onChange={handleChange} placeholder="Enter net monthly salary" inputMode="numeric" required />
            </div>
            <p className="kotak-single-hint">Do not include incentives, bonuses or any one-time payments.</p>
          </div>
          <div className="kotak-single-field">
            <label>Your Current City</label>
            <div className="kotak-single-cities">
              {CITIES.map(c => (
                <button key={c} type="button" className={formData.currentCity === c ? 'selected' : ''} onClick={() => setFormData(prev => ({ ...prev, currentCity: c }))} style={formData.currentCity === c ? { backgroundColor: bank.primaryColor } : {}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="kotak-single-submit" disabled={!canSubmit || isSubmitting} style={{ backgroundColor: canSubmit ? bank.primaryColor : '#94a3b8' }}>
            {isSubmitting ? 'Submitting...' : 'Verify with OTP'}
          </button>
        </form>
        <p className="kotak-single-docs">For a quick loan application process, keep these documents handy: PAN Card, Aadhaar Card, Last 3 month&apos;s bank statements of salary account or net banking credentials.</p>
      </div>
    </div>
  )
}
