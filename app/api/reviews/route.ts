import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'
import { truncate } from '@/lib/sanitize'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = rateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const body = await request.json()
    const name = truncate(body.name, 200)
    const email = truncate(body.email, 200)
    const review = truncate(body.review, 5000)
    const rating = body.rating

    if (!name || !email || !review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Reviews go to social media team; falls back to NOTIFY_EMAIL
    const recipientEmail = process.env.REVIEW_EMAIL || process.env.NOTIFY_EMAIL || 'info@zineegroup.com'
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
    const subject = `New Review from ${name}`

    const emailBody = `
New Review Submission

Name: ${name}
Email: ${email}
Rating: ${rating != null ? `${rating} out of 5 stars` : 'Not provided'}

Review:
${review}

---
This review was submitted through the website review form.
Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim()

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          subject,
          text: emailBody,
        })
      } catch (emailError) {
        console.error('Review email error:', emailError instanceof Error ? emailError.message : 'unknown')
      }
    }

    return NextResponse.json(
      { message: 'Review submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Review error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
