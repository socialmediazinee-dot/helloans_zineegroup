import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, city, pincode, message } = body

    // Validate required fields
    if (!name || !email || !phone || !message || !city || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate phone number (basic validation for Indian numbers)
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 10) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please enter a valid 10-digit phone number.' },
        { status: 400 }
      )
    }

    // Validate pincode (6 digits)
    const pincodeRegex = /^\d{6}$/
    if (!pincodeRegex.test(pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode. Please enter a valid 6-digit pincode.' },
        { status: 400 }
      )
    }

    // Email configuration (NOTIFY_EMAIL = one inbox for all form submissions)
    const recipientEmail = process.env.NOTIFY_EMAIL || process.env.LOAN_EMAIL || 'info@zineegroup.com'
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
    const subject = `New Loan Application from ${name}`

    // Create email body
    const emailBody = `
New Loan Application

Personal Information:
Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
Pincode: ${pincode}

Loan Requirements:
${message}

---
This loan application was submitted through the website application form.
Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim()

    // Send email to business
    try {
      await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: subject,
        text: emailBody,
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'We received your loan application – Zineegroup',
        text: `Hi ${name},\n\nThank you for your loan application. We have received your details and our team will contact you within 24 hours.\n\n— Zineegroup Team`,
      })
    } catch (e) {
      console.error('Confirmation email error:', e)
    }

    return NextResponse.json(
      { message: 'Loan application submitted successfully. Our team will contact you within 24 hours.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing loan application:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
