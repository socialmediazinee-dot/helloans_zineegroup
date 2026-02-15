import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, message } = body

        // Validate required fields
        if (!name || !email || !phone || !message) {
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
        const recipientEmail = process.env.NOTIFY_EMAIL || process.env.CONTACT_EMAIL || 'info@zineegroup.com'
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
        const subject = `New Contact Form Submission from ${name}`

        // Create email body
        const emailBody = `
New Contact Form Submission

Contact Information:
Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

---
This message was submitted through the website contact form.
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
                subject: 'We received your message – Zineegroup',
                text: `Hi ${name},\n\nThank you for contacting us. We have received your message and will get back to you within 24 hours.\n\nYour message:\n${message}\n\n— Zineegroup Team`,
            })
        } catch (e) {
            console.error('Confirmation email error:', e)
        }

        return NextResponse.json(
            { message: 'Thank you for contacting us. We will get back to you within 24 hours.' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error processing contact form:', error)
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        )
    }
}
