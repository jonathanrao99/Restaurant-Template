import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { customer, points } = await req.json();
    
    if (!customer || !points) {
      return NextResponse.json({ error: 'Customer and points required' }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Search by email or phone
    const isEmail = customer.includes('@');
    const field = isEmail ? 'customer_email' : 'customer_phone';
    
    // Get customer orders to calculate current points
    const ordersUrl = `${SUPABASE_URL}/rest/v1/orders?${field}=eq.${customer}&select=total_amount`;
    const ordersRes = await fetch(ordersUrl, {
      headers: {
        apikey: SERVICE_KEY,
        authorization: `Bearer ${SERVICE_KEY}`
      }
    });

    if (!ordersRes.ok) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const orders = await ordersRes.json();
    const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
    const currentPoints = Math.floor(totalSpent);

    if (currentPoints < points) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    // Create redemption record
    const redemptionUrl = `${SUPABASE_URL}/rest/v1/loyalty_redemptions`;
    const redemptionRes = await fetch(redemptionUrl, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer_identifier: customer,
        points_redeemed: points,
        discount_amount: points / 10, // 100 points = $10
        redeemed_at: new Date().toISOString()
      })
    });

    if (!redemptionRes.ok) {
      const errorText = await redemptionRes.text();
      console.error('Redemption error:', errorText);
      // Continue even if redemption logging fails
    }

    return NextResponse.json({ 
      success: true, 
      remainingPoints: currentPoints - points,
      discountAmount: points / 10
    });
  } catch (error: any) {
    console.error('Error redeeming loyalty points:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 