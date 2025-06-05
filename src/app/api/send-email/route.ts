import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json();

    const result = await resend.emails.send({
      from: 'info@desiflavorskaty.com',
      to,
      subject,
      html,
      text,
    });

    if (!result.data) {
      console.error('Resend API error', result.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    return NextResponse.json({ id: result.data.id });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 