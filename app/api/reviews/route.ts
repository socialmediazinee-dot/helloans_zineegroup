import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, review, rating } = body

    // Validate required fields
    if (!name || !email || !review) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email configuration (NOTIFY_EMAIL = one inbox for all form submissions)
    const recipientEmail = process.env.NOTIFY_EMAIL || process.env.REVIEW_EMAIL || 'info@zineegroup.com'
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
        console.error('Error sending review email:', emailError)
      }
    } else {
      console.log('Review received (RESEND_API_KEY not set):', { to: recipientEmail, subject, body: emailBody })
    }

    return NextResponse.json(
      { message: 'Review submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
