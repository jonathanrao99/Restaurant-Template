import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@googlemaps/google-maps-services-js";

const SHIPDAY_API_KEY = 'afS4qiuI1o.qTpHgquNGsZi4UdR3rNb';
const ORIGIN = "1989 North Fry Rd, Katy, TX 77449";

export async function POST(req: NextRequest) {
  try {
    console.log('Processing scheduled deliveries...');
    
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Find orders that are scheduled and ready to be processed
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    
    const fetchUrl = `${SUPABASE_URL}/rest/v1/orders?status=eq.scheduled&order_type=eq.delivery&select=*`;
    const fetchRes = await fetch(fetchUrl, {
      headers: {
        apikey: SERVICE_KEY,
        authorization: `Bearer ${SERVICE_KEY}`
      }
    });

    if (!fetchRes.ok) {
      console.error('Failed to fetch scheduled orders:', await fetchRes.text());
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const orders = await fetchRes.json();
    console.log(`Found ${orders.length} scheduled orders`);
    
    const processedOrders = [];
    
    for (const order of orders) {
      if (!order.scheduled_time || order.scheduled_time === 'ASAP') continue;
      
      const scheduledTime = new Date(order.scheduled_time);
      const timeDiffHours = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      console.log(`Order ${order.id}: scheduled for ${scheduledTime.toISOString()}, diff: ${timeDiffHours.toFixed(2)} hours`);
      
      // Create delivery if within 2 hours of scheduled time
      if (timeDiffHours <= 2 && timeDiffHours > -1) { // Allow 1 hour past scheduled time
        try {
          // Call Shipday API to create scheduled delivery
          const shipdayRes = await fetch('https://api.shipday.com/v1/deliveries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SHIPDAY_API_KEY}`,
            },
            body: JSON.stringify({
              pickupAddress: ORIGIN,
              pickupPhoneNumber: '+12814010758',
              pickupBusinessName: 'Desi Flavors Hub',
              dropoffAddress: order.delivery_address,
              dropoffPhoneNumber: order.customer_phone,
              dropoffName: order.customer_name,
              orderNumber: order.id,
              orderValue: order.total_amount,
              scheduledPickupTime: scheduledTime.toISOString(),
            }),
          });
          const shipdayData = await shipdayRes.json();
          // Update order with Shipday delivery info and status
          const updateUrl = `${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`;
          await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
              apikey: SERVICE_KEY,
              authorization: `Bearer ${SERVICE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: 'pending-shipday',
              external_delivery_id: shipdayData.id,
              tracking_url: shipdayData.trackingUrl
            })
          });
          processedOrders.push({
            orderId: order.id,
            shipdayId: shipdayData.id,
            scheduledTime: scheduledTime.toISOString()
          });
        } catch (error) {
          console.error(`Error creating Shipday delivery for order ${order.id}:`, error);
        }
      }
    }
    
    console.log(`Processed ${processedOrders.length} scheduled deliveries`);
    return NextResponse.json({ 
      success: true, 
      processedOrders,
      totalScheduled: orders.length 
    });
  } catch (error: any) {
    console.error('Error processing scheduled deliveries:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}