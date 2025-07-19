// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
async function sendResendEmail({ to, subject, html, from }) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  const defaultFrom = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@yourdomain.com';
  const fromEmail = from || defaultFrom;
  
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from: fromEmail, to, subject, html })
  });
  if (!res.ok) throw new Error('Failed to send email');
  return res.json();
}
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { headers: corsHeaders, status: 405 });
    }
    const body = await req.json();
    if (!body.to || !body.subject || !body.html) {
      return new Response(JSON.stringify({ error: 'Missing to, subject, or html' }), { headers: corsHeaders, status: 400 });
    }
    
    // Send notification email to business
    const result = await sendResendEmail(body);
    
    // If this is a contact form submission, also send confirmation email to user
    if (body.userEmail && body.userName) {
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d97706;">Thank you for contacting Desi Flavors Katy!</h2>
          <p>Dear ${body.userName},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${body.userName}</li>
            <li><strong>Email:</strong> ${body.userEmail}</li>
            <li><strong>Phone:</strong> ${body.userPhone || 'N/A'}</li>
            <li><strong>Event Type:</strong> ${body.eventType || 'General Inquiry'}</li>
            <li><strong>Message:</strong> ${body.userMessage}</li>
          </ul>
          <p>We typically respond within 24 hours during business days.</p>
          <p>Best regards,<br>The Desi Flavors Katy Team</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      `;
      
      try {
        await sendResendEmail({
          to: body.userEmail,
          subject: 'Thank you for contacting Desi Flavors Katy',
          html: confirmationHtml,
          from: 'noreply@desiflavorskaty.com'
        });
      } catch (confirmationError) {
        console.error('Failed to send confirmation email:', confirmationError);
        // Don't fail the main request if confirmation email fails
      }
    }
    
    return new Response(JSON.stringify({ result }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
  }
}); 