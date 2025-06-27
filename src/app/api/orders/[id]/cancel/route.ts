import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    
    // Fetch order from Supabase
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const fetchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=external_delivery_id,status`,
      {
        headers: {
          apikey: SERVICE_KEY,
          authorization: `Bearer ${SERVICE_KEY}`,
        }
      }
    );
    
    if (!fetchRes.ok) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const orders = await fetchRes.json();
    const order = orders[0];
    
    if (!order?.external_delivery_id) {
      return NextResponse.json({ error: 'No delivery associated with this order' }, { status: 400 });
    }
    
    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Order already cancelled' }, { status: 400 });
    }
    
    // Update order status in Supabase
    await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SERVICE_KEY,
          authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      }
    );
    
    return NextResponse.json({ success: true, message: 'Delivery cancelled successfully' });
    
  } catch (error: any) {
    console.error('Error cancelling delivery:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 