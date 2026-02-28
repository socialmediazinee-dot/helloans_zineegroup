import { NextRequest, NextResponse } from 'next/server'
import { consumeOtp, isValidIndianMobile } from '@/lib/otp-store'
import { getOtpCookie, clearOtpCookie } from '@/lib/verification-cookie'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = rateLimit(ip, { maxRequests: 10, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a minute.' }, { status: 429 })
    }

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
    console.error('OTP verify error:', e instanceof Error ? e.message : 'unknown')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
