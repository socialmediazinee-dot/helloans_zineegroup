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

    const formData = await request.formData()

    const name = truncate(formData.get('name') as string, 200)
    const email = truncate(formData.get('email') as string, 200)
    const phone = truncate(formData.get('phone') as string, 20)
    const panNumber = truncate(formData.get('panNumber') as string, 10)
    const city = truncate(formData.get('city') as string, 200)
    const pincode = truncate(formData.get('pincode') as string, 10)
    const loanType = truncate(formData.get('loanType') as string, 100)
    const loanAmount = truncate(formData.get('loanAmount') as string, 20)
    const employmentType = truncate(formData.get('employmentType') as string, 100)
    const monthlyIncome = truncate(formData.get('monthlyIncome') as string, 20)
    const message = truncate(formData.get('message') as string, 5000)

    if (!name || !phone || !city || !pincode || !loanType || !loanAmount || !employmentType || !monthlyIncome) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
    }

    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please enter a valid 10-digit phone number.' },
        { status: 400 }
      )
    }

    const pincodeRegex = /^\d{6}$/
    if (!pincodeRegex.test(pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode. Please enter a valid 6-digit pincode.' },
        { status: 400 }
      )
    }

    const recipientEmail = process.env.NOTIFY_EMAIL || process.env.LOAN_EMAIL || 'info@zineegroup.com'
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
    const subject = `New Loan Application from ${name}`

    const formattedAmount = loanAmount ? '₹ ' + Number(loanAmount).toLocaleString('en-IN') : 'N/A'
    const formattedIncome = monthlyIncome ? '₹ ' + Number(monthlyIncome).toLocaleString('en-IN') : 'N/A'
    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    const emailBody = [
      'New Loan Application',
      '',
      `Full Name        : ${name}`,
      `Email            : ${email || 'Not provided'}`,
      `Phone            : ${phone} (OTP Verified)`,
      `PAN Number       : ${panNumber || 'Not provided'}`,
      `City             : ${city}`,
      `Pincode          : ${pincode}`,
      '',
      `Loan Type        : ${loanType}`,
      `Loan Amount      : ${formattedAmount}`,
      `Employment Type  : ${employmentType}`,
      `Monthly Income   : ${formattedIncome}`,
      '',
      `Message          : ${message || 'None'}`,
      '',
      '---',
      `Submitted at: ${submittedAt}`,
      'Phone number was verified via OTP.',
    ].join('\n')

    // Build attachments from uploaded files
    const attachments: { filename: string; content: Buffer }[] = []
    const files = formData.getAll('documents')
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        attachments.push({ filename: file.name, content: buffer })
      }
    }

    try {
      await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject,
        text: emailBody,
        attachments: attachments.length > 0 ? attachments : undefined,
      })
    } catch (emailError) {
      console.error('Loan email error:', emailError instanceof Error ? emailError.message : 'unknown')
    }

    if (email) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'We received your loan application – Zineegroup',
          text: `Hi ${name},\n\nThank you for your loan application. We have received your details and our team will contact you within 24 hours.\n\n— Zineegroup Team`,
        })
      } catch (e) {
        console.error('Confirmation email error:', e instanceof Error ? e.message : 'unknown')
      }
    }

    return NextResponse.json(
      { message: 'Loan application submitted successfully. Our team will contact you within 24 hours.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Loan application error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
