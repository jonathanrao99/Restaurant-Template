import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lookup = searchParams.get('lookup');
    
    if (!lookup) {
      return NextResponse.json({ error: 'Lookup parameter required' }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Search by email or phone
    const isEmail = lookup.includes('@');
    const field = isEmail ? 'customer_email' : 'customer_phone';
    
    // Get customer orders
    const ordersUrl = `${SUPABASE_URL}/rest/v1/orders?${field}=eq.${lookup}&select=*&order=created_at.desc`;
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
    
    if (orders.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate loyalty points (1 point per dollar spent)
    const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
    const loyaltyPoints = Math.floor(totalSpent);

    // Get customer info from most recent order
    const latestOrder = orders[0];
    
    const profile = {
      name: latestOrder.customer_name,
      email: latestOrder.customer_email,
      phone: latestOrder.customer_phone,
      loyaltyPoints,
      totalSpent,
      orderCount: orders.length,
      pastOrders: orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString(),
        items: order.items.map((item: any) => item.name).join(', '),
        total: order.total_amount
      }))
    };

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 