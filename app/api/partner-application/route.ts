import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/rate-limit'
import { truncate } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
        const { allowed } = rateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
        if (!allowed) {
            return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
        }

        const body = await request.json()
        const name = truncate(body.name, 200)
        const companyName = truncate(body.companyName, 300)
        const email = truncate(body.email, 200)
        const phone = truncate(body.phone, 20)
        const city = truncate(body.city, 200)
        const message = truncate(body.message, 5000)

        if (!name || !companyName || !email || !phone || !city || !message) {
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

        // Email configuration (NOTIFY_EMAIL = one inbox for all form submissions)
        const recipientEmail = process.env.NOTIFY_EMAIL || process.env.PARTNER_EMAIL || 'info@zineegroup.com'
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
        const subject = `New Partner Application from ${name} - ${companyName}`

        // Create email body
        const emailBody = `
New Partner Application

Personal Information:
Name: ${name}
Company Name: ${companyName}
Email: ${email}
Phone: ${phone}
City: ${city}

Message:
${message}

---
This partner application was submitted through the website "Become a Partner" form.
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
            console.error('Partner email error:', emailError instanceof Error ? emailError.message : 'unknown')
        }

        try {
            await resend.emails.send({
                from: fromEmail,
                to: email,
                subject: 'We received your partner application – Zineegroup',
                text: `Hi ${name},\n\nThank you for your interest in partnering with us. We have received your application and will review it and contact you within 48 hours.\n\n— Zineegroup Team`,
            })
        } catch (e) {
            console.error('Confirmation email error:', e instanceof Error ? e.message : 'unknown')
        }

        return NextResponse.json(
            { message: 'Thank you for your interest in partnering with us. We will review your application and contact you within 48 hours.' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Partner application error:', error instanceof Error ? error.message : 'unknown')
        return NextResponse.json(
            { error: 'Something went wrong. Please try again later.' },
            { status: 500 }
        )
    }
}
