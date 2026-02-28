import { NextRequest, NextResponse } from 'next/server'
import { setOtp, isValidIndianMobile } from '@/lib/otp-store'
import { setOtpCookie } from '@/lib/verification-cookie'
import { rateLimit } from '@/lib/rate-limit'

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

async function sendViaFast2Sms(mobile: string, otp: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY
  if (!apiKey) return false
  const params = new URLSearchParams({
    authorization: apiKey,
    route: 'q',
    message: `Your Zinee Group verification code is ${otp}. Valid for 10 minutes.`,
    numbers: mobile,
  })
  try {
    const res = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`, {
      method: 'GET',
    })
    const data = await res.json().catch(() => ({}))
    if (data.return === true || data.status_code === 200) {
      return true
    }
    console.error('Fast2SMS send failed:', res.status)
    return false
  } catch (e) {
    console.error('Fast2SMS error:', e instanceof Error ? e.message : 'unknown')
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = rateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const body = await request.json()
    const mobile = String(body.mobile ?? '').trim()

    if (!isValidIndianMobile(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number. Enter a valid 10-digit Indian number.' },
        { status: 400 }
      )
    }

    const normalMobile = mobile.replace(/\D/g, '').slice(-10)
    const otp = generateOtp()
    setOtp(normalMobile, otp)

    const sent = await sendViaFast2Sms(normalMobile, otp)
    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send OTP. Please try again later.' },
        { status: 502 }
      )
    }

    const res = NextResponse.json({ success: true, message: 'OTP sent successfully.' })
    const cookie = setOtpCookie(normalMobile, otp)
    res.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, string | number | boolean>)
    return res
  } catch (e) {
    console.error('OTP send error:', e instanceof Error ? e.message : 'unknown')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
