'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const TEST_EMAIL = 'k613624@gmail.com'

function TestEmailOutContent() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    const sent = searchParams.get('sent')
    const error = searchParams.get('error')
    if (sent === '1') {
      setResult({ ok: true, message: `Email sent to ${TEST_EMAIL}. Check your inbox (and spam).` })
    } else if (sent === '0' || error) {
      let msg = 'Something went wrong. Check the server logs.'
      if (error) {
        try {
          msg = decodeURIComponent(error)
        } catch {
          msg = error
        }
      }
      setResult({ ok: false, message: msg })
    }
  }, [searchParams])

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Test email out</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Form data and images are sent to <strong>{TEST_EMAIL}</strong> via Resend.
      </p>

      {/* Plain form POST – works even when JS fails (no fetch). API redirects back with ?sent=1 or ?sent=0&error=... */}
      <form
        action="/api/test-email-out"
        method="POST"
        encType="multipart/form-data"
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Name</span>
          <input
            type="text"
            name="name"
            defaultValue=""
            placeholder="Your name"
            style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 8 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            defaultValue=""
            placeholder="your@email.com"
            style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 8 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Message</span>
          <textarea
            name="message"
            defaultValue=""
            placeholder="Your message"
            rows={4}
            style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 8, resize: 'vertical' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Images (optional)</span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            style={{ padding: 8, border: '1px dashed #cbd5e1', borderRadius: 8 }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: '12px 20px',
            background: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Send to k613624@gmail.com
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 8,
            background: result.ok ? '#f0fdf4' : '#fef2f2',
            color: result.ok ? '#166534' : '#991b1b',
            border: `1px solid ${result.ok ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {result.ok ? '✓ ' : '✗ '}
          {result.message}
        </div>
      )}
    </div>
  )
}

export default function TestEmailOutPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 520, margin: '40px auto', padding: 24 }}>Loading…</div>}>
      <TestEmailOutContent />
    </Suspense>
  )
}
