import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const TO_EMAIL = 'k613624@gmail.com'

function buildEmailPayload(
  name: string,
  email: string,
  message: string,
  attachments: Array<{ filename: string; content: string; contentType?: string }>,
  fromEmail: string
) {
  const textBody = `
Test email from /testemailout

Name: ${name || '-'}
Email: ${email || '-'}

Message:
${message || '(no message)'}

---
Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
  `.trim()

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; padding: 20px;">
      <h2 style="color: #0f172a;">Test email from /testemailout</h2>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Name:</strong> ${name || '-'}</p>
        <p><strong>Email:</strong> ${email || '-'}</p>
        <p><strong>Message:</strong></p>
        <p>${(message || '(no message)').replace(/\n/g, '<br>')}</p>
      </div>
      <p style="color: #64748b; font-size: 12px;">
        Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </p>
    </div>
  `

  const payload: {
    from: string
    to: string
    subject: string
    text: string
    html: string
    attachments?: Array<{ filename: string; content: string; contentType?: string }>
  } = {
    from: fromEmail,
    to: TO_EMAIL,
    subject: `Test email: ${name || 'Test'} – form + attachments`,
    text: textBody,
    html: htmlBody,
  }
  if (attachments.length > 0) payload.attachments = attachments
  return payload
}

function redirectToResult(request: NextRequest, sent: boolean, errorMessage?: string) {
  const url = new URL('/testemailout', request.url)
  url.searchParams.set('sent', sent ? '1' : '0')
  if (errorMessage) url.searchParams.set('error', encodeURIComponent(errorMessage))
  // 303 = See Other: browser follows with GET (307 would re-POST and trigger Server Action error)
  return NextResponse.redirect(url, 303)
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || ''
  const isForm = contentType.includes('multipart/form-data')

  if (isForm) {
    // Plain form POST (works without JS) – send email then redirect
    try {
      const formData = await request.formData()
      const name = (formData.get('name') as string)?.trim() || 'Test sender'
      const email = (formData.get('email') as string)?.trim() || 'test@example.com'
      const message = (formData.get('message') as string)?.trim() || 'Test message from /testemailout'

      const attachments: Array<{ filename: string; content: string; contentType?: string }> = []
      const files = formData.getAll('images') as File[]
      for (const file of files || []) {
        if (!file || typeof file.arrayBuffer !== 'function') continue
        const bytes = await file.arrayBuffer()
        const content = Buffer.from(bytes).toString('base64')
        attachments.push({
          filename: file.name || 'image.jpg',
          content,
          contentType: file.type || 'image/jpeg',
        })
      }

      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromEmail = process.env.FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
      const payload = buildEmailPayload(name, email, message, attachments, fromEmail)

      if (!process.env.RESEND_API_KEY) {
        console.error('Test email out: RESEND_API_KEY is not set')
        return redirectToResult(request, false, 'RESEND_API_KEY not set')
      }

      const { error } = await resend.emails.send(payload)

      if (error) {
        console.error('Test email out error:', error)
        return redirectToResult(request, false, error.message || 'Resend failed')
      }

      return redirectToResult(request, true)
    } catch (e) {
      console.error('Test email out exception:', e)
      return redirectToResult(
        request,
        false,
        e instanceof Error ? e.message : 'Server error'
      )
    }
  }

  // JSON body (client-side fetch)
  try {
    const body = await request.json()
    const { name, email, message, attachments = [] } = body

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const emailPayload = buildEmailPayload(
      name || 'Test',
      email || 'test@example.com',
      message || '',
      Array.isArray(attachments)
        ? attachments.map((a: { data: string; filename: string; contentType?: string }) => ({
            filename: a.filename || 'image.jpg',
            content: a.data,
            contentType: a.contentType || 'image/jpeg',
          }))
        : [],
      fromEmail
    )

    const { data, error } = await resend.emails.send(emailPayload)

    if (error) {
      console.error('Test email out error:', error)
      return NextResponse.json(
        { error: error.message || 'Resend failed to send' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Email sent to ${TO_EMAIL}. Check inbox (and spam).`,
      id: data?.id,
    })
  } catch (e) {
    console.error('Test email out exception:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server error' },
      { status: 500 }
    )
  }
}
