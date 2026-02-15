import { NextRequest, NextResponse } from 'next/server'
import { setOtp, isValidIndianMobile } from '@/lib/otp-store'
import { setOtpCookie } from '@/lib/verification-cookie'

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

/**
 * 2Factor.in: send OTP via SMS only (manual OTP flow with POST).
 * AUTOGEN can use voice; using POST /SMS/{phone}/{otp} forces SMS delivery.
 * We generate OTP, store locally, and 2Factor sends it by SMS. Verify uses local store.
 */
async function sendVia2FactorSms(mobile: string, otp: string): Promise<boolean> {
  const apiKey = process.env.TWO_FACTOR_API_KEY || process.env.OTP_2FACTOR_API_KEY
  if (!apiKey) return false
  const phone = `91${mobile}`
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}`
  try {
    const res = await fetch(url, { method: 'POST' })
    const data = (await res.json().catch(() => ({}))) as { Status?: string; Details?: string }
    if (data.Status !== 'Success') {
      console.error('2Factor SMS send failed:', res.status, data)
      return false
    }
    return true
  } catch (e) {
    console.error('2Factor SMS error:', e)
    return false
  }
}

async function sendSms(mobile: string, otp: string): Promise<boolean> {
  const provider = process.env.OTP_SMS_PROVIDER // 'msg91' | 'twilio' | undefined
  const authKey = process.env.MSG91_AUTH_KEY
  const twilioSid = process.env.TWILIO_ACCOUNT_SID
  const twilioToken = process.env.TWILIO_AUTH_TOKEN
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER

  if (provider === 'msg91' && authKey) {
    try {
      const params = new URLSearchParams({
        authkey: authKey,
        mobile: `91${mobile}`,
        otp,
        sender: process.env.MSG91_SENDER_ID || 'ZINEEG',
        otp_expiry: '10',
        otp_length: '6',
      })
      const res = await fetch(`https://api.msg91.com/api/sendotp.php?${params.toString()}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok || (data.type && data.type === 'error')) {
        console.error('MSG91 send failed:', res.status, data)
        return false
      }
      return true
    } catch (e) {
      console.error('MSG91 error:', e)
      return false
    }
  }

  if (provider === 'twilio' && twilioSid && twilioToken && twilioFrom) {
    try {
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
          },
          body: new URLSearchParams({
            To: `+91${mobile}`,
            From: twilioFrom,
            Body: `Your verification code is ${otp}. Valid for 10 minutes.`,
          }),
        }
      )
      if (!res.ok) {
        const t = await res.text()
        console.error('Twilio send failed:', res.status, t)
        return false
      }
      return true
    } catch (e) {
      console.error('Twilio error:', e)
      return false
    }
  }

  // Development / no provider: still store OTP so verify works; log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[OTP] Dev mode – OTP for', mobile, ':', otp)
  }
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mobile = String(body.mobile ?? '').trim()

    if (!isValidIndianMobile(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number. Enter a valid 10-digit Indian number.' },
        { status: 400 }
      )
    }

    const otp = generateOtp()
    const normalMobile = mobile.replace(/\D/g, '').slice(-10)
    setOtp(normalMobile, otp)

    // 2Factor.in: use manual SMS endpoint (POST) so OTP is sent by SMS, not voice
    const twoFactorSmsSent = await sendVia2FactorSms(normalMobile, otp)
    if (twoFactorSmsSent) {
      const res = NextResponse.json({ success: true, message: 'OTP sent successfully.' })
      const cookie = setOtpCookie(normalMobile, otp)
      res.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, string | number | boolean>)
      return res
    }

    const sent = await sendSms(normalMobile, otp)
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
    console.error('OTP send error:', e)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
