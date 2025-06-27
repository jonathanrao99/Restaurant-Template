import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square/legacy';

// Initialize Square client using legacy SDK
const client = new Client({
  bearerAuthCredentials: { accessToken: process.env.SQUARE_ACCESS_TOKEN! },
  environment:
    process.env.SQUARE_ENVIRONMENT?.toLowerCase() === 'production'
      ? Environment.Production
      : Environment.Sandbox,
});

export async function POST(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const params = await paramsPromise;
    const orderId = Number(params.id);
    const { status } = await request.json();
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Fetch current order data via Supabase REST
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const fetchUrl = `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=payment_id,external_delivery_id,total_amount`;
    const fetchRes = await fetch(fetchUrl, {
      headers: {
        apikey: SERVICE_KEY,
        authorization: `Bearer ${SERVICE_KEY}`
      }
    });
    if (!fetchRes.ok) {
      const errText = await fetchRes.text();
      return NextResponse.json({ error: errText }, { status: 404 });
    }
    const [order] = await fetchRes.json();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Handle cancellation: DoorDash cancel + Square refund
    if (status === 'cancelled') {
      // Issue refund via Square
      if (order.payment_id) {
        const refundsApi = client.refundsApi;
        await refundsApi.refundPayment({
          idempotencyKey: crypto.randomUUID(),
          paymentId: order.payment_id,
          amountMoney: { amount: BigInt(Math.round(order.total_amount * 100)), currency: 'USD' }
        });
      }
      const updateUrl = `${SUPABASE_URL}/rest/v1/orders?external_delivery_id=eq.${order.external_delivery_id}`;
      await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          apikey: SERVICE_KEY,
          authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
    }

    // Update status in Supabase via REST
    const updateUrl = `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`;
    const updateRes = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_KEY,
        authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!updateRes.ok) {
      const txt = await updateRes.text(); console.error('Update error:', txt);
      return NextResponse.json({ error: txt }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Failed to update order status:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
} 