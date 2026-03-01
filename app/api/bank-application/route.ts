import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { truncate } from '@/lib/sanitize'

const MAX_BODY_SIZE = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

function validateFile(file: { data?: string; contentType?: string; filename?: string }, label: string): string | null {
  if (!file?.data) return null
  if (file.data.length > MAX_BODY_SIZE) return `${label} file is too large (max ~7.5 MB).`
  if (file.contentType && !ALLOWED_FILE_TYPES.includes(file.contentType)) return `${label} file type not allowed.`
  return null
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = rateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const contentLength = parseInt(request.headers.get('content-length') || '0', 10)
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }

    const body = await request.json()

    const {
      bankId,
      bankName,
      loanType,
      loanLabel,
      mobileNumber,
      email,
      panNo,
      day,
      month,
      year,
      sourceOfIncome,
      loanAmount,
      tenure,
      tenureUnit,
      consentPersonalData,
      consentPersonalizedOffers,
      consentPerfios,
      panCard,
      aadhaarCard,
      payslip,
      bankStatement,
      additionalDoc,
      addressProof,
      pan,
      firstName,
      middleName,
      lastName,
      gender,
      personalEmail,
      typeOfLoan,
      addressLine1,
      addressLine2,
      addressLine3,
      pincode,
      city,
      state,
      residenceType,
      addressDeclaration,
      employerName,
      monthlyIncome,
      monthlyEmis,
      workEmail,
      consentEligibility,
    } = body

    if (!bankId) {
      return NextResponse.json({ error: 'Missing bankId' }, { status: 400 })
    }

    if (bankId === 'yes') {
      if (!body.name || !body.pan || String(body.pan).replace(/\s/g, '').length < 10) {
        return NextResponse.json({ error: 'Name and valid PAN are required' }, { status: 400 })
      }
    } else if (bankId === 'axis') {
      if (!body.nameAsPerPan || !body.companyName) {
        return NextResponse.json({ error: 'Name and Company name are required' }, { status: 400 })
      }
    } else if (bankId === 'kotak') {
      const phoneRegex = /^[6-9]\d{9}$/
      if (!body.mobileNumber || !phoneRegex.test(body.mobileNumber)) {
        return NextResponse.json({ error: 'Valid 10-digit mobile number is required' }, { status: 400 })
      }
      if (!body.fullName) {
        return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
      }
    } else {
      if (!mobileNumber || !day || !month || !year || !sourceOfIncome) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(mobileNumber)) {
        return NextResponse.json({ error: 'Invalid phone number. Please enter a valid 10-digit phone number.' }, { status: 400 })
      }
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (date.getDate() !== parseInt(day) || date.getMonth() !== parseInt(month) - 1 || date.getFullYear() !== parseInt(year)) {
        return NextResponse.json({ error: 'Invalid date of birth' }, { status: 400 })
      }
    }

    for (const [fileObj, label] of [
      [panCard, 'PAN Card'], [aadhaarCard, 'Aadhaar'], [payslip, 'Payslip'],
      [bankStatement, 'Bank Statement'], [additionalDoc, 'Additional Doc'], [addressProof, 'Address Proof'],
    ] as const) {
      const err = validateFile(fileObj as any, label as string)
      if (err) return NextResponse.json({ error: err }, { status: 400 })
    }

    const recipientEmail = process.env.NOTIFY_EMAIL || process.env.LOAN_EMAIL || 'info@zineegroup.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || 'onboarding@resend.dev'
    const loanTypeDisplay = loanLabel || (loanType ? String(loanType).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '')
    const subject = `New ${bankName || 'Bank'} Loan Application${loanTypeDisplay ? ` – ${loanTypeDisplay}` : ''}`

    const dateOfBirth = (day && month && year) ? `${day}/${month}/${year}` : ''
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')
    const resolvedPan = panNo || pan || body.pan || ''

    // Build simple plain-text email: Field Name : Value
    const lines: string[] = [
      `New Loan Application – ${bankName || bankId}`,
      '',
      '─────────────────────────────────────',
      '',
    ]

    const addField = (label: string, value: string | undefined | null | boolean) => {
      if (value === undefined || value === null || value === '') return
      const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
      lines.push(`${label}: ${display}`)
    }

    addField('Bank', bankName || bankId)
    addField('Bank ID', bankId)
    addField('Loan Type', loanTypeDisplay || loanType)
    lines.push('')

    addField('Mobile Number', mobileNumber ? `+91 ${mobileNumber}` : body.mobileNumber ? `+91 ${body.mobileNumber}` : '')
    addField('Email', email || personalEmail || body.personalEmail || body.email)
    addField('PAN Number', resolvedPan)
    addField('Date of Birth', dateOfBirth || body.dateOfBirth)
    addField('Full Name', fullName || body.name || body.fullName || body.nameAsPerPan)
    addField('Gender', gender || body.gender)
    addField('Source of Income', sourceOfIncome === 'salaried' ? 'Salaried' : sourceOfIncome === 'self-employed' ? 'Self Employed / Business' : sourceOfIncome)
    addField('Employer / Company', employerName || body.companyName)
    lines.push('')

    addField('Address Line 1', addressLine1)
    addField('Address Line 2', addressLine2)
    addField('Address Line 3', addressLine3)
    addField('Pincode', pincode)
    addField('City', city || body.currentCity)
    addField('State', state)
    addField('Residence Type', residenceType)
    addField('Address Declaration', addressDeclaration)
    lines.push('')

    if (loanAmount) addField('Loan Amount', `₹ ${parseInt(loanAmount).toLocaleString('en-IN')}`)
    addField('Tenure', tenure ? `${tenure} ${tenureUnit === 'Yr' ? 'Years' : 'Months'}` : '')
    if (monthlyIncome) addField('Monthly Net Income', `₹ ${monthlyIncome}`)
    if (monthlyEmis) addField('Monthly EMIs', `₹ ${monthlyEmis}`)
    addField('Work Email', workEmail)
    addField('Net Monthly Salary', body.netMonthlySalary)
    addField('Salary Bank', body.salaryBankAccount)
    lines.push('')

    addField('Personal Data Consent', consentPersonalData)
    addField('Personalized Offers Consent', consentPersonalizedOffers)
    if (consentPerfios !== undefined) addField('Perfios T&C Consent', consentPerfios)
    if (consentEligibility !== undefined) addField('Eligibility & T&C Consent', consentEligibility)
    lines.push('')

    const docNames: string[] = []
    if (panCard?.data) docNames.push(`PAN Card (${panCard.filename || 'pan-card'})`)
    if (aadhaarCard?.data) docNames.push(`Aadhaar Card (${aadhaarCard.filename || 'aadhaar'})`)
    if (payslip?.data) docNames.push(`Payslip (${payslip.filename || 'payslip'})`)
    if (bankStatement?.data) docNames.push(`Bank Statement (${bankStatement.filename || 'bank-statement'})`)
    if (additionalDoc?.data) docNames.push(`Additional Doc (${additionalDoc.filename || 'additional-doc'})`)
    if (addressProof?.data) docNames.push(`Address Proof (${addressProof.filename || 'address-proof'})`)
    addField('Documents Attached', docNames.length > 0 ? docNames.join(', ') : 'None')

    lines.push('')
    lines.push('─────────────────────────────────────')

    // Append all raw form fields for completeness
    const attachmentKeys = ['panCard', 'aadhaarCard', 'payslip', 'bankStatement', 'additionalDoc', 'addressProof']
    const rawFields = Object.entries(body)
      .filter(([k]) => !attachmentKeys.includes(k))
      .map(([k, v]) => {
        if (v == null) return null
        if (typeof v === 'object' && v !== null && 'data' in v) return `${k}: [file attached]`
        const val = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : (typeof v === 'object' ? JSON.stringify(v) : String(v))
        return `${k}: ${val}`
      })
      .filter(Boolean) as string[]

    if (rawFields.length > 0) {
      lines.push('')
      lines.push('All submitted fields:')
      lines.push(...rawFields)
    }

    lines.push('')
    lines.push('---')
    lines.push(`Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`)

    const emailBody = lines.filter(l => l !== undefined).join('\n')

    // Build attachments from uploaded files
    const attachments: Array<{ filename: string; content: string; contentType?: string }> = []
    if (panCard?.data) attachments.push({ filename: panCard.filename || 'pan-card.jpg', content: panCard.data, contentType: panCard.contentType || 'image/jpeg' })
    if (aadhaarCard?.data) attachments.push({ filename: aadhaarCard.filename || 'aadhaar-card.jpg', content: aadhaarCard.data, contentType: aadhaarCard.contentType || 'image/jpeg' })
    if (payslip?.data) attachments.push({ filename: payslip.filename || 'payslip.pdf', content: payslip.data, contentType: payslip.contentType || 'application/pdf' })
    if (bankStatement?.data) attachments.push({ filename: bankStatement.filename || 'bank-statement.pdf', content: bankStatement.data, contentType: bankStatement.contentType || 'application/pdf' })
    if (additionalDoc?.data) attachments.push({ filename: additionalDoc.filename || 'additional-doc.pdf', content: additionalDoc.data, contentType: additionalDoc.contentType || 'application/pdf' })
    if (addressProof?.data) attachments.push({ filename: addressProof.filename || 'address-proof.pdf', content: addressProof.data, contentType: addressProof.contentType || 'application/pdf' })


    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key')

      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key') {
        const emailData: any = {
          from: fromEmail,
          to: recipientEmail,
          subject,
          text: emailBody,
        }
        if (attachments.length > 0) emailData.attachments = attachments

        await resend.emails.send(emailData)
      }
    } catch (emailError: any) {
      console.error('Email send failed:', emailError instanceof Error ? emailError.message : 'unknown')
    }

    const userEmail = email || personalEmail || body.personalEmail || body.email
    if (userEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail) && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key') {
      try {
        const { Resend } = await import('resend')
        const resendConf = new Resend(process.env.RESEND_API_KEY)
        await resendConf.emails.send({
          from: fromEmail,
          to: userEmail,
          subject: 'We received your loan application – Zineegroup',
          text: `Thank you for your ${bankName || 'bank'} loan application. We have received your details and our team will be in touch.\n\n— Zineegroup Team`,
        })
      } catch (e) {
        console.error('Confirmation email error:', e instanceof Error ? e.message : 'unknown')
      }
    }

    return NextResponse.json(
      {
        message: 'Loan application submitted successfully. Our team will contact you shortly.',
        applicationId: `APP-${Date.now()}-${bankId.toUpperCase()}`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Bank application error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
