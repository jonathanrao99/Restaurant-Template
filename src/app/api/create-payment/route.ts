import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square';

const squareClient = new Client({
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { sourceId, amount, idempotencyKey } = await req.json();
    if (!sourceId || !amount || !idempotencyKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const paymentsApi = squareClient.paymentsApi;
    const response = await paymentsApi.createPayment({
      sourceId,
      idempotencyKey,
      amountMoney: { amount: Math.round(amount * 100), currency: 'USD' },
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!,
    });

    if (response.result.errors) {
      return NextResponse.json({ error: response.result.errors }, { status: 500 });
    }

    return NextResponse.json(response.result.payment);
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: error.message || error.toString() }, { status: 500 });
  }
} 