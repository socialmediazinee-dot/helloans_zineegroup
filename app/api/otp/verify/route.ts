import { NextRequest, NextResponse } from 'next/server'
import { consumeOtp, getSessionId, consumeSessionId, isValidIndianMobile } from '@/lib/otp-store'
import { getOtpCookie, clearOtpCookie } from '@/lib/verification-cookie'

/** Verify OTP with 2Factor.in API. Returns true if 2Factor says "OTP Matched". */
async function verifyVia2Factor(sessionId: string, otp: string): Promise<boolean> {
  const apiKey = process.env.TWO_FACTOR_API_KEY || process.env.OTP_2FACTOR_API_KEY
  if (!apiKey) return false
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`
  try {
    const res = await fetch(url, { method: 'GET' })
    const data = (await res.json().catch(() => ({}))) as { Status?: string; Details?: string }
    return data.Status === 'Success' && (data.Details === 'OTP Matched' || data.Details === 'OTP matched')
  } catch (e) {
    console.error('2Factor verify error:', e)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mobile = String(body.mobile ?? '').replace(/\D/g, '').slice(-10)
    const otp = String(body.otp ?? '').trim().replace(/\D/g, '')

    if (!isValidIndianMobile(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number.' },
        { status: 400 }
      )
    }

    if (!otp || otp.length < 4 || otp.length > 6) {
      return NextResponse.json(
        { error: 'Please enter the OTP you received (4–6 digits).' },
        { status: 400 }
      )
    }

    // 1) If we have a 2Factor session for this mobile, verify with 2Factor API
    const sessionId = getSessionId(mobile)
    if (sessionId) {
      const otpDigits = otp.replace(/\D/g, '').slice(0, 6)
      const matched = await verifyVia2Factor(sessionId, otpDigits)
      if (matched) {
        consumeSessionId(mobile)
        const res = NextResponse.json({ success: true, message: 'Phone number verified.' })
        res.cookies.set(clearOtpCookie().name, '', { path: '/', maxAge: 0 })
        return res
      }
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      )
    }

    // 2) Cookie (works across serverless: same browser sends cookie on verify)
    const cookieData = await getOtpCookie()
    if (cookieData && cookieData.mobile === mobile) {
      const inputOtp = otp.replace(/\D/g, '').slice(0, 6)
      if (inputOtp.length === 6 && cookieData.otp === inputOtp) {
        const res = NextResponse.json({ success: true, message: 'Phone number verified.' })
        const clear = clearOtpCookie()
        res.cookies.set(clear.name, clear.value, clear.options as Record<string, string | number | boolean>)
        return res
      }
    }

    // 3) In-memory store (single-instance / dev)
    const valid = consumeOtp(mobile, otp)
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      )
    }

    const res = NextResponse.json({ success: true, message: 'Phone number verified.' })
    res.cookies.set(clearOtpCookie().name, '', { path: '/', maxAge: 0 })
    return res
  } catch (e) {
    console.error('OTP verify error:', e)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
