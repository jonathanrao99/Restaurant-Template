import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/integrations/supabase/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');

    // Fetch reviews from database
    let query = supabase
      .from('customer_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (source && source !== 'all') {
      query = query.eq('source', source);
    }

    const { data: reviews, error } = await query;

    if (error) throw error;

    return NextResponse.json({ reviews: reviews || [] });

  } catch (error) {
    console.error('Reviews API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, orderId, email, rating, comment, source = 'website' } = body;

    if (action === 'submit') {
      // Submit a new review
      const { data, error } = await supabase
        .from('customer_reviews')
        .insert({
          order_id: orderId,
          customer_email: email,
          rating,
          comment,
          source,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Review submitted successfully' });
    }

    if (action === 'sendFeedbackEmail') {
      // Send feedback email 6 hours after order delivery
      const { orderId, customerEmail, customerName } = body;

      const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feedback?orderId=${orderId}`;
      
      const emailContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #ff6b35;">Thank you for your order, ${customerName}!</h2>
          <p>We hope you enjoyed your meal from Desi Flavors. Your feedback helps us serve you better.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>How was your experience?</h3>
            <p>Please take a moment to rate your order and share your thoughts:</p>
            <a href="${feedbackUrl}" style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Leave a Review</a>
          </div>
          
          <p>Your review helps other customers discover great food and helps us improve our service.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            Desi Flavors - Authentic Indian Cuisine<br>
            Visit us at <a href="${process.env.NEXT_PUBLIC_APP_URL}">${process.env.NEXT_PUBLIC_APP_URL}</a>
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: customerEmail,
        subject: 'How was your meal? Share your feedback!',
        html: emailContent,
      });

      return NextResponse.json({ success: true, message: 'Feedback email sent' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Failed to process review' }, { status: 500 });
  }
} 