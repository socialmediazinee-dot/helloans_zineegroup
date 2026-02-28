import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { setEmailCode, isValidEmail } from '@/lib/email-verify-store'
import { setEmailCookie } from '@/lib/verification-cookie'
import { rateLimit } from '@/lib/rate-limit'

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = rateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const body = await request.json()
    const email = String(body.email ?? '').trim()

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const code = generateCode()
    const normalEmail = email.trim().toLowerCase()
    setEmailCode(normalEmail, code)

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: normalEmail,
      subject: 'Your verification code – Zineegroup',
      text: `Your email verification code is: ${code}\n\nThis code is valid for 10 minutes. If you didn't request this, please ignore this email.\n\n— Zineegroup`,
    })

    if (error) {
      console.error('Email verify send error:', error)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 502 }
      )
    }

    const res = NextResponse.json({ success: true, message: 'Verification code sent to your email.' })
    const cookie = setEmailCookie(normalEmail, code)
    res.cookies.set(cookie.name, cookie.value, cookie.options as Record<string, string | number | boolean>)
    return res
  } catch (e) {
    console.error('Email verify send error:', e instanceof Error ? e.message : 'unknown')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
