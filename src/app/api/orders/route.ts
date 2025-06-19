import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const url = `${SUPABASE_URL}/rest/v1/orders?select=id,created_at,customer_name,customer_phone,order_type,total_amount,status,delivery_address&order=created_at.desc&limit=50`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 