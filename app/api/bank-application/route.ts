import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { escHtml, truncate } from '@/lib/sanitize'

const MAX_BODY_SIZE = 10 * 1024 * 1024 // 10 MB (base64 docs are large)
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
      /* HDFC single-page form fields */
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

    // Bank-specific validation
    if (!bankId) {
      return NextResponse.json({ error: 'Missing bankId' }, { status: 400 })
    }
    if (bankId === 'yes') {
      const name = body.name
      const panYes = body.pan
      if (!name || !panYes || String(panYes).replace(/\s/g, '').length < 10) {
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
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(mobileNumber)) {
        return NextResponse.json(
          { error: 'Invalid phone number. Please enter a valid 10-digit phone number.' },
          { status: 400 }
        )
      }
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (date.getDate() !== parseInt(day) || date.getMonth() !== parseInt(month) - 1 || date.getFullYear() !== parseInt(year)) {
        return NextResponse.json(
          { error: 'Invalid date of birth' },
          { status: 400 }
        )
      }
    }

    const dateOfBirth = (day && month && year) ? `${day}/${month}/${year}` : ''

    // Validate uploaded files
    for (const [fileObj, label] of [
      [panCard, 'PAN Card'], [aadhaarCard, 'Aadhaar'], [payslip, 'Payslip'],
      [bankStatement, 'Bank Statement'], [additionalDoc, 'Additional Doc'], [addressProof, 'Address Proof'],
    ] as const) {
      const err = validateFile(fileObj as any, label as string)
      if (err) return NextResponse.json({ error: err }, { status: 400 })
    }

    const recipientEmail = process.env.NOTIFY_EMAIL || process.env.LOAN_EMAIL || 'info@zineegroup.com'
    const loanTypeDisplay = loanLabel || (loanType ? String(loanType).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '')
    const subject = `New ${bankName || 'Bank'} Loan Application${loanTypeDisplay ? ` – ${loanTypeDisplay}` : ''}`
    
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')
    const hasHdfcFields = pan || firstName || lastName || personalEmail || addressLine1 || employerName || monthlyIncome
    const nameYes = body.name
    const panYes = body.pan
    const nameAsPerPan = body.nameAsPerPan
    const companyName = body.companyName
    const fullNameKotak = body.fullName

    // Create email body (bank-specific sections)
    const personalSectionYes = bankId === 'yes' && (nameYes || panYes) ? `
Name: ${nameYes || '-'}
PAN: ${panYes || '-'}` : ''
    const personalSectionAxis = bankId === 'axis' && (nameAsPerPan || companyName) ? `
PAN Number: ${body.pan || '-'}
Name as per PAN: ${nameAsPerPan || '-'}
Company Name: ${companyName || '-'}
Gender: ${body.gender || '-'}
Date of Birth: ${body.dateOfBirth || '-'}
Net Monthly Salary: ${body.netMonthlySalary || '-'}
Salary Bank: ${body.salaryBankAccount || '-'}
Address: ${body.addressLine1 || ''} ${body.addressLine2 || ''}
PIN: ${body.pincode || ''} City: ${body.city || ''} State: ${body.state || ''}` : ''
    const personalSectionKotak = bankId === 'kotak' && (fullNameKotak || body.mobileNumber) ? `
PAN Number: ${body.pan || '-'}
Full Name: ${fullNameKotak || '-'}
Mobile: +91 ${body.mobileNumber || '-'}
Email: ${body.personalEmail || '-'}
Employment: ${body.employmentType || '-'}
Net Monthly Salary: ${body.netMonthlySalary || '-'}
City: ${body.currentCity || '-'}` : ''
    const personalSectionDefault = !personalSectionYes && !personalSectionAxis && !personalSectionKotak ? `
Mobile Number: +91 ${mobileNumber || '-'}
Date of Birth: ${dateOfBirth || '-'}
Source of Income: ${sourceOfIncome === 'salaried' ? 'Salaried' : 'Self Employed / Professionals / Business'}
${pan ? `PAN: ${pan}` : ''}
${fullName ? `Full Name: ${fullName}` : ''}
${gender ? `Gender: ${gender}` : ''}
${personalEmail ? `Personal Email: ${personalEmail}` : ''}` : ''

    // Build "all form data" for email (every field, excluding file content)
    const attachmentKeys = ['panCard', 'aadhaarCard', 'payslip', 'bankStatement', 'additionalDoc', 'addressProof']
    const allFormFields = Object.entries(body)
      .filter(([k]) => !attachmentKeys.includes(k))
      .map(([k, v]) => {
        if (v == null) return null
        if (typeof v === 'object' && v !== null && 'data' in v && typeof (v as any).data === 'string') return `${k}: [file attached: ${(v as any).filename || k}]`
        const val = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : (typeof v === 'object' ? JSON.stringify(v) : String(v))
        return `${k}: ${val}`
      })
      .filter(Boolean) as string[]
    const allFormFieldsText = allFormFields.length ? `\n\nComplete form data:\n${allFormFields.join('\n')}` : ''
    const allFormFieldsHtml = allFormFields.length ? allFormFields.map(s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\n') : ''

    const emailBody = `
New Bank Loan Application

Loan Type: ${loanTypeDisplay || loanType || 'Not specified'}

Bank Information:
Bank: ${bankName || bankId}
Bank ID: ${bankId}

Personal Information:${personalSectionYes}${personalSectionAxis}${personalSectionKotak}${personalSectionDefault}

${hasHdfcFields ? `
Address:
${addressLine1 ? `Address Line 1: ${addressLine1}` : ''}
${addressLine2 ? `Address Line 2: ${addressLine2}` : ''}
${addressLine3 ? `Address Line 3: ${addressLine3}` : ''}
${pincode ? `PIN Code: ${pincode}` : ''}
${city ? `City: ${city}` : ''}
${state ? `State: ${state}` : ''}
${residenceType ? `Residence Type: ${residenceType}` : ''}
Address Declaration: ${addressDeclaration ? 'Yes' : 'No'}

Employment:
${employerName ? `Employer/Company: ${employerName}` : ''}
${monthlyIncome ? `Monthly Net Income: ₹${monthlyIncome}` : ''}
${monthlyEmis ? `Monthly EMIs: ₹${monthlyEmis}` : ''}
${workEmail ? `Work Email: ${workEmail}` : ''}
` : ''}

Loan Details:
${loanAmount ? `Loan Amount: ₹${parseInt(loanAmount).toLocaleString('en-IN')}` : ''}
${tenure ? `Tenure: ${tenure} ${tenureUnit === 'Yr' ? 'Years' : 'Months'}` : ''}

Consents:
Personal Data Consent: ${consentPersonalData ? 'Yes' : 'No'}
Personalized Offers Consent: ${consentPersonalizedOffers ? 'Yes' : 'No'}
${consentPerfios !== undefined ? `Perfios T&C Consent: ${consentPerfios ? 'Yes' : 'No'}` : ''}
${consentEligibility !== undefined ? `Eligibility & T&C Consent: ${consentEligibility ? 'Yes' : 'No'}` : ''}

Documents attached: ${[panCard?.data && 'PAN Card', aadhaarCard?.data && 'Aadhaar', payslip?.data && 'Payslip', bankStatement?.data && 'Bank Statement', additionalDoc?.data && 'Additional Doc', addressProof?.data && 'Address Proof'].filter(Boolean).join(', ') || 'None'}
${allFormFieldsText}

---
This loan application was submitted through the bank application form.
Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim()

    if (process.env.NODE_ENV !== 'production') {
      console.log('Bank loan application received:', { bankId, bankName, to: recipientEmail, subject })
    }

    // Prepare attachments array
    const attachments: Array<{
      filename: string
      content: string
      contentType?: string
    }> = []
    
    if (panCard && panCard.data) {
      attachments.push({
        filename: panCard.filename || 'pan-card.jpg',
        content: panCard.data,
        contentType: panCard.contentType || 'image/jpeg'
      })
    }
    
    if (aadhaarCard && aadhaarCard.data) {
      attachments.push({
        filename: aadhaarCard.filename || 'aadhaar-card.jpg',
        content: aadhaarCard.data,
        contentType: aadhaarCard.contentType || 'image/jpeg'
      })
    }
    if (payslip && payslip.data) {
      attachments.push({
        filename: payslip.filename || 'payslip.pdf',
        content: payslip.data,
        contentType: payslip.contentType || 'application/pdf'
      })
    }
    if (bankStatement && bankStatement.data) {
      attachments.push({
        filename: bankStatement.filename || 'bank-statement.pdf',
        content: bankStatement.data,
        contentType: bankStatement.contentType || 'application/pdf'
      })
    }
    if (additionalDoc && additionalDoc.data) {
      attachments.push({
        filename: additionalDoc.filename || 'additional-doc.pdf',
        content: additionalDoc.data,
        contentType: additionalDoc.contentType || 'application/pdf'
      })
    }
    if (addressProof && addressProof.data) {
      attachments.push({
        filename: addressProof.filename || 'address-proof.pdf',
        content: addressProof.data,
        contentType: addressProof.contentType || 'application/pdf'
      })
    }

    // Send email notification using Resend
    try {
      // Send email using Resend
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key')
      
      // Only send if API key is configured
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key') {
        const emailData: any = {
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: recipientEmail,
          subject: subject,
          text: emailBody,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #004C8A;">New Bank Loan Application</h2>
              
              <div style="background: #e0f2fe; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0284c7;">
                <h3 style="color: #0c4a6e; margin-top: 0;">Loan Type</h3>
                <p style="font-size: 18px; font-weight: 600; margin: 0;">${escHtml(loanTypeDisplay || loanType || 'Not specified')}</p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Bank Information</h3>
                <p><strong>Bank:</strong> ${escHtml(bankName || bankId)}</p>
                <p><strong>Bank ID:</strong> ${escHtml(bankId)}</p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Personal Information</h3>
                <p><strong>Mobile Number:</strong> +91 ${escHtml(mobileNumber)}</p>
                <p><strong>Date of Birth:</strong> ${escHtml(dateOfBirth)}</p>
                <p><strong>Source of Income:</strong> ${sourceOfIncome === 'salaried' ? 'Salaried' : 'Self Employed / Professionals / Business'}</p>
                ${pan ? `<p><strong>PAN:</strong> ${escHtml(pan)}</p>` : ''}
                ${fullName ? `<p><strong>Full Name:</strong> ${escHtml(fullName)}</p>` : ''}
                ${gender ? `<p><strong>Gender:</strong> ${escHtml(gender)}</p>` : ''}
                ${personalEmail ? `<p><strong>Personal Email:</strong> ${escHtml(personalEmail)}</p>` : ''}
                ${typeOfLoan ? `<p><strong>Type of Loan (form):</strong> ${escHtml(typeOfLoan)}</p>` : ''}
              </div>
              
              ${hasHdfcFields && (addressLine1 || employerName) ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Address & Employment</h3>
                ${addressLine1 ? `<p><strong>Address:</strong> ${escHtml(addressLine1)}${addressLine2 ? `, ${escHtml(addressLine2)}` : ''}${addressLine3 ? `, ${escHtml(addressLine3)}` : ''}</p>` : ''}
                ${pincode || city || state ? `<p>${[pincode, city, state].filter(Boolean).map(escHtml).join(', ')}</p>` : ''}
                ${employerName ? `<p><strong>Employer:</strong> ${escHtml(employerName)}</p>` : ''}
                ${monthlyIncome ? `<p><strong>Monthly Income:</strong> ₹${escHtml(monthlyIncome)}</p>` : ''}
                ${monthlyEmis ? `<p><strong>Monthly EMIs:</strong> ₹${escHtml(monthlyEmis)}</p>` : ''}
                ${workEmail ? `<p><strong>Work Email:</strong> ${escHtml(workEmail)}</p>` : ''}
              </div>
              ` : ''}
              
              ${loanAmount || tenure ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Loan Details</h3>
                ${loanAmount ? `<p><strong>Loan Amount:</strong> ₹${escHtml(parseInt(loanAmount).toLocaleString('en-IN'))}</p>` : ''}
                ${tenure ? `<p><strong>Tenure:</strong> ${escHtml(tenure)} ${tenureUnit === 'Yr' ? 'Years' : 'Months'}</p>` : ''}
              </div>
              ` : ''}
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Consents</h3>
                <p><strong>Personal Data Consent:</strong> ${consentPersonalData ? 'Yes' : 'No'}</p>
                <p><strong>Personalized Offers Consent:</strong> ${consentPersonalizedOffers ? 'Yes' : 'No'}</p>
                ${consentPerfios !== undefined ? `<p><strong>Perfios T&C Consent:</strong> ${consentPerfios ? 'Yes' : 'No'}</p>` : ''}
                ${consentEligibility !== undefined ? `<p><strong>Eligibility & T&C Consent:</strong> ${consentEligibility ? 'Yes' : 'No'}</p>` : ''}
              </div>
              
              ${panCard && panCard.data ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">PAN Card</h3>
                <p>PAN Card image attached to this email.</p>
                <img src="data:${panCard.contentType || 'image/jpeg'};base64,${panCard.data}" alt="PAN Card" style="max-width: 100%; border: 1px solid #e2e8f0; border-radius: 4px; margin-top: 10px;" />
              </div>
              ` : ''}
              
              ${aadhaarCard && aadhaarCard.data ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Aadhaar Card</h3>
                <p>Aadhaar Card image attached to this email.</p>
                <img src="data:${aadhaarCard.contentType || 'image/jpeg'};base64,${aadhaarCard.data}" alt="Aadhaar Card" style="max-width: 100%; border: 1px solid #e2e8f0; border-radius: 4px; margin-top: 10px;" />
              </div>
              ` : ''}
              
              ${(payslip?.data || bankStatement?.data || additionalDoc?.data || addressProof?.data) ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Other documents (attached)</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${payslip?.data ? `<li>Payslip: ${payslip.filename || 'payslip'}</li>` : ''}
                  ${bankStatement?.data ? `<li>Bank Statement: ${bankStatement.filename || 'bank-statement'}</li>` : ''}
                  ${additionalDoc?.data ? `<li>Additional Document: ${additionalDoc.filename || 'additional-doc'}</li>` : ''}
                  ${addressProof?.data ? `<li>Address Proof: ${addressProof.filename || 'address-proof'}</li>` : ''}
                </ul>
              </div>
              ` : ''}
              
              ${allFormFields.length > 0 ? `
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Complete form data</h3>
                <pre style="margin: 0; font-size: 12px; white-space: pre-wrap; word-break: break-word;">${allFormFieldsHtml}</pre>
              </div>
              ` : ''}
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #64748b; font-size: 12px;">
                This loan application was submitted through the bank application form.<br>
                Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          `,
        }
        
        // Add attachments if any
        if (attachments.length > 0) {
          emailData.attachments = attachments
        }
        
        const emailResult = await resend.emails.send(emailData)
        
        if (process.env.NODE_ENV !== 'production') console.log('Email sent to:', recipientEmail)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[DEV] Would send email to ${recipientEmail}: ${subject}`)
        }
      }
    } catch (emailError: any) {
      console.error('Email send failed:', emailError instanceof Error ? emailError.message : 'unknown')
    }

    // Send confirmation email to user when we have their email
    const userEmail = personalEmail || body.personalEmail || body.email
    if (userEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail) && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder_key') {
      try {
        const { Resend } = await import('resend')
        const resendConf = new Resend(process.env.RESEND_API_KEY)
        await resendConf.emails.send({
          from: process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: userEmail,
          subject: 'We received your loan application – Zineegroup',
          text: `Thank you for your ${bankName || 'bank'} loan application. We have received your details and our team will be in touch.\n\n— Zineegroup Team`,
        })
      } catch (e) {
        console.error('Confirmation email error:', e instanceof Error ? e.message : 'unknown')
      }
    }

    // TODO: Store in database
    // Example:
    // await db.bankApplications.create({
    //   data: {
    //     bankId,
    //     bankName,
    //     mobileNumber,
    //     dateOfBirth,
    //     sourceOfIncome,
    //     loanAmount,
    //     tenure,
    //     tenureUnit,
    //     consentPersonalData,
    //     consentPersonalizedOffers,
    //     consentPerfios,
    //     submittedAt: new Date()
    //   }
    // })

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
