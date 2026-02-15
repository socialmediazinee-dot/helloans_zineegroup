'use client'

import React, { useState } from 'react'

export interface EmailVerificationProps {
  email: string
  onVerified: () => void
  verified: boolean
  disabled?: boolean
  className?: string
  sendButtonLabel?: string
  verifyButtonLabel?: string
}

export default function EmailVerification({
  email,
  onVerified,
  verified,
  disabled = false,
  className = '',
  sendButtonLabel = 'Send verification code',
  verifyButtonLabel = 'Verify',
}: EmailVerificationProps) {
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cleanEmail = String(email).trim().toLowerCase()
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)

  const handleSend = async () => {
    if (!isValid || disabled || verified) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/email-verify/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Failed to send code')
        return
      }
      setSent(true)
    } catch {
      setError('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!isValid || code.length !== 6 || disabled || verified) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/email-verify/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Invalid code')
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
        <span className="otp-verification-badge">✓ Email verified</span>
      </div>
    )
  }

  return (
    <div className={`otp-verification ${className}`}>
      <div className="otp-verification-actions">
        <button
          type="button"
          className="otp-verification-send"
          onClick={handleSend}
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
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="otp-verification-input"
              disabled={disabled}
            />
            <button
              type="button"
              className="otp-verification-verify"
              onClick={handleVerify}
              disabled={code.length !== 6 || disabled || loading}
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
