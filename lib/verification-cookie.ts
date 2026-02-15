/**
 * Signed verification cookies so OTP/email codes work across serverless instances.
 * Send sets a cookie; verify reads it. No in-memory dependency across requests.
 */
import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_OTP = 'v_otp'
const COOKIE_EMAIL = 'v_email'
const MAX_AGE = 10 * 60 // 10 minutes
const SECRET = process.env.VERIFICATION_COOKIE_SECRET || process.env.TWO_FACTOR_API_KEY || 'dev-secret-change-in-prod'

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
}

function verify(payload: string, signature: string): boolean {
  const expected = sign(payload)
  const a = Buffer.from(signature, 'base64url')
  const b = Buffer.from(expected, 'base64url')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/** Set signed cookie for OTP (mobile + otp). Call from send response. */
export function setOtpCookie(mobile: string, otp: string): { name: string; value: string; options: Record<string, unknown> } {
  const payload = JSON.stringify({
    m: mobile.replace(/\D/g, '').slice(-10),
    o: otp.replace(/\D/g, '').slice(0, 6),
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  })
  const b64 = Buffer.from(payload, 'utf8').toString('base64url')
  const value = `${b64}.${sign(b64)}`
  return {
    name: COOKIE_OTP,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: MAX_AGE,
    },
  }
}

/** Read and verify OTP cookie; return { mobile, otp } or null. */
export async function getOtpCookie(): Promise<{ mobile: string; otp: string } | null> {
  const c = await cookies()
  const raw = c.get(COOKIE_OTP)?.value
  if (!raw) return null
  const [b64, sig] = raw.split('.')
  if (!b64 || !sig || !verify(b64, sig)) return null
  let data: { m?: string; o?: string; exp?: number }
  try {
    data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (!data.m || !data.o || !data.exp || data.exp < Math.floor(Date.now() / 1000)) return null
  return { mobile: data.m, otp: data.o }
}

/** Clear OTP cookie (after successful verify). */
export function clearOtpCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_OTP,
    value: '',
    options: { httpOnly: true, path: '/', maxAge: 0 },
  }
}

/** Set signed cookie for email verification. */
export function setEmailCookie(email: string, code: string): { name: string; value: string; options: Record<string, unknown> } {
  const payload = JSON.stringify({
    e: email.trim().toLowerCase(),
    c: code.replace(/\D/g, '').slice(0, 6),
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  })
  const b64 = Buffer.from(payload, 'utf8').toString('base64url')
  const value = `${b64}.${sign(b64)}`
  return {
    name: COOKIE_EMAIL,
    value,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: MAX_AGE,
    },
  }
}

/** Read and verify email cookie; return { email, code } or null. */
export async function getEmailCookie(): Promise<{ email: string; code: string } | null> {
  const c = await cookies()
  const raw = c.get(COOKIE_EMAIL)?.value
  if (!raw) return null
  const [b64, sig] = raw.split('.')
  if (!b64 || !sig || !verify(b64, sig)) return null
  let data: { e?: string; c?: string; exp?: number }
  try {
    data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (!data.e || !data.c || !data.exp || data.exp < Math.floor(Date.now() / 1000)) return null
  return { email: data.e, code: data.c }
}

/** Clear email verification cookie. */
export function clearEmailCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_EMAIL,
    value: '',
    options: { httpOnly: true, path: '/', maxAge: 0 },
  }
}
