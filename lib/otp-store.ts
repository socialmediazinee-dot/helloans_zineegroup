/**
 * In-memory OTP store with TTL. For production at scale, replace with Redis.
 * Keys: normalized mobile (10 digits). Value: { otp, expiresAt } or { sessionId, expiresAt } for 2Factor.
 */
const store = new Map<string, { otp?: string; sessionId?: string; expiresAt: number }>()
const TTL_MS = 10 * 60 * 1000 // 10 minutes

function normalizeMobile(mobile: string): string {
  return String(mobile).replace(/\D/g, '').slice(-10)
}

export function setOtp(mobile: string, otp: string): void {
  const key = normalizeMobile(mobile)
  if (key.length !== 10) return
  store.set(key, { otp, expiresAt: Date.now() + TTL_MS })
}

/** Store 2Factor.in session ID for a mobile (used when verifying via 2Factor API). */
export function setSessionId(mobile: string, sessionId: string): void {
  const key = normalizeMobile(mobile)
  if (key.length !== 10) return
  store.set(key, { sessionId, expiresAt: Date.now() + TTL_MS })
}

export function getOtp(mobile: string): string | null {
  const key = normalizeMobile(mobile)
  const entry = store.get(key)
  if (!entry || Date.now() > entry.expiresAt || !entry.otp) {
    store.delete(key)
    return null
  }
  return entry.otp
}

export function getSessionId(mobile: string): string | null {
  const key = normalizeMobile(mobile)
  const entry = store.get(key)
  if (!entry || Date.now() > entry.expiresAt || !entry.sessionId) {
    store.delete(key)
    return null
  }
  return entry.sessionId
}

/** Normalize OTP to digits only for comparison (handles spaces when pasting). */
function normalizeOtp(otp: string): string {
  return String(otp).replace(/\D/g, '').slice(0, 6)
}

/** Verify and consume OTP only on success. Wrong code does not delete so user can retry. */
export function consumeOtp(mobile: string, otp: string): boolean {
  const key = normalizeMobile(mobile)
  const entry = store.get(key)
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  const inputOtp = normalizeOtp(otp)
  if (inputOtp.length !== 6 || entry.otp !== inputOtp) {
    return false
  }
  store.delete(key)
  return true
}

/** Remove session after successful 2Factor verify. */
export function consumeSessionId(mobile: string): void {
  store.delete(normalizeMobile(mobile))
}

export function isValidIndianMobile(mobile: string): boolean {
  const key = normalizeMobile(mobile)
  return key.length === 10 && /^[6-9]/.test(key)
}
