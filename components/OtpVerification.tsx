'use client'

import React, { useState } from 'react'

export interface OtpVerificationProps {
  mobile: string
  onVerified: () => void
  verified: boolean
  disabled?: boolean
  className?: string
  sendButtonLabel?: string
  verifyButtonLabel?: string
}

export default function OtpVerification({
  mobile,
  onVerified,
  verified,
  disabled = false,
  className = '',
  sendButtonLabel = 'Send OTP',
  verifyButtonLabel = 'Verify',
}: OtpVerificationProps) {
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cleanMobile = String(mobile).replace(/\D/g, '')
  const isValid = cleanMobile.length === 10 && /^[6-9]/.test(cleanMobile)

  const handleSendOtp = async () => {
    if (!isValid || disabled || verified) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanMobile }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP')
        return
      }
      setSent(true)
    } catch {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!isValid || otp.length !== 6 || disabled || verified) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanMobile, otp }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Invalid OTP')
        return
      }
      onVerified()
    } catch {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className={`otp-verification otp-verification--verified ${className}`}>
        <span className="otp-verification-badge">✓ Phone verified</span>
      </div>
    )
  }

  return (
    <div className={`otp-verification ${className}`}>
      <div className="otp-verification-actions">
        <button
          type="button"
          className="otp-verification-send"
          onClick={handleSendOtp}
          disabled={!isValid || disabled || loading}
        >
          {loading && !sent ? 'Sending...' : sendButtonLabel}
        </button>
        {sent && (
          <div className="otp-verification-verify-row">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="otp-verification-input"
              disabled={disabled}
            />
            <button
              type="button"
              className="otp-verification-verify"
              onClick={handleVerify}
              disabled={otp.length !== 6 || disabled || loading}
            >
              {loading ? 'Verifying...' : verifyButtonLabel}
            </button>
          </div>
        )}
      </div>
      {error && <p className="otp-verification-error">{error}</p>}
    </div>
  )
}
