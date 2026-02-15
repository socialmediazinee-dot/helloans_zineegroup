import { NextRequest, NextResponse } from 'next/server'
import { consumeEmailCode, isValidEmail } from '@/lib/email-verify-store'
import { getEmailCookie, clearEmailCookie } from '@/lib/verification-cookie'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const code = String(body.code ?? '').trim().replace(/\D/g, '')

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    const codeDigits = code.replace(/\D/g, '').slice(0, 6)
    if (!codeDigits || codeDigits.length !== 6) {
      return NextResponse.json(
        { error: 'Please enter the 6-digit code from your email.' },
        { status: 400 }
      )
    }

    // 1) Cookie (works across serverless)
    const cookieData = await getEmailCookie()
    if (cookieData && cookieData.email === email) {
      if (cookieData.code === codeDigits) {
        const res = NextResponse.json({ success: true, message: 'Email verified.' })
        const clear = clearEmailCookie()
        res.cookies.set(clear.name, clear.value, clear.options as Record<string, string | number | boolean>)
        return res
      }
    }

    // 2) In-memory store
    const valid = consumeEmailCode(email, codeDigits)
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please request a new one.' },
        { status: 400 }
      )
    }

    const res = NextResponse.json({ success: true, message: 'Email verified.' })
    res.cookies.set(clearEmailCookie().name, '', { path: '/', maxAge: 0 })
    return res
  } catch (e) {
    console.error('Email verify error:', e)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
