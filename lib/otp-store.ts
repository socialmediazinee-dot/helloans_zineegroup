/**
 * In-memory OTP store with TTL and attempt tracking.
 * For production at scale, replace with Redis.
 */
const store = new Map<string, { otp?: string; sessionId?: string; expiresAt: number; attempts: number }>()
const TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const MAX_STORE_SIZE = 10_000

function normalizeMobile(mobile: string): string {
  return String(mobile).replace(/\D/g, '').slice(-10)
}

function evictExpired() {
  if (store.size < MAX_STORE_SIZE) return
  const now = Date.now()
  store.forEach((entry, key) => {
    if (now > entry.expiresAt) store.delete(key)
  })
}

export function setOtp(mobile: string, otp: string): void {
  evictExpired()
  const key = normalizeMobile(mobile)
  if (key.length !== 10) return
  store.set(key, { otp, expiresAt: Date.now() + TTL_MS, attempts: 0 })
}

export function setSessionId(mobile: string, sessionId: string): void {
  evictExpired()
  const key = normalizeMobile(mobile)
  if (key.length !== 10) return
  store.set(key, { sessionId, expiresAt: Date.now() + TTL_MS, attempts: 0 })
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

function normalizeOtp(otp: string): string {
  return String(otp).replace(/\D/g, '').slice(0, 6)
}

export function consumeOtp(mobile: string, otp: string): boolean {
  const key = normalizeMobile(mobile)
  const entry = store.get(key)
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key)
    return false
  }
  const inputOtp = normalizeOtp(otp)
  if (inputOtp.length !== 6 || entry.otp !== inputOtp) {
    entry.attempts++
    return false
  }
  store.delete(key)
  return true
}

export function consumeSessionId(mobile: string): void {
  store.delete(normalizeMobile(mobile))
}

export function isValidIndianMobile(mobile: string): boolean {
  const key = normalizeMobile(mobile)
  return key.length === 10 && /^[6-9]/.test(key)
}
