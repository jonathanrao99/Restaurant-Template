// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "apikey, authorization, content-type",
};

// Generate a JWT for DoorDash API
async function generateDoorDashJWT() {
  const developer_id = Deno.env.get("DOORDASH_DRIVE_DEVELOPER_ID");
  const key_id = Deno.env.get("DOORDASH_DRIVE_KEY_ID");
  const signing_secret = Deno.env.get("DOORDASH_DRIVE_SIGNING_SECRET");
  if (!developer_id || !key_id || !signing_secret) throw new Error('Missing DoorDash credentials');
  const header = { alg: 'HS256', typ: 'JWT', 'dd-ver': 'DD-JWT-V1' };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 300;
  const payload = { aud: 'doordash', iss: developer_id, kid: key_id, iat, exp };
  const encoder = new TextEncoder();
  const base64url = (data) => btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const headerB64 = base64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)));
  const dataToSign = `${headerB64}.${payloadB64}`;
  // Decode secret
  const b64 = signing_secret.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const secretBytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));
  const signatureB64 = base64url(signature);
  return `${dataToSign}.${signatureB64}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing Supabase environment variables');

    const now = new Date();

    // Fetch scheduled delivery orders
    const fetchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?status=eq.scheduled&order_type=eq.delivery`,
      { headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}` } }
    );
    if (!fetchRes.ok) {
      const txt = await fetchRes.text();
      console.error('Failed fetching scheduled orders:', txt);
      throw new Error('Failed to fetch orders');
    }
    const orders = await fetchRes.json();
    const processed = [];

    for (const order of orders) {
      if (!order.scheduled_time || order.scheduled_time === 'ASAP') continue;
      const scheduledTime = new Date(order.scheduled_time);
      const diffHrs = (scheduledTime - now) / (1000 * 60 * 60);
      // Process if within 2 hours or up to 1 hour past
      if (diffHrs <= 2 && diffHrs > -1) {
        try {
          const token = await generateDoorDashJWT();
          const externalId = crypto.randomUUID();
          const pickup_address = Deno.env.get('STORE_ADDRESS');
          const pickup_phone = Deno.env.get('STORE_PHONE_NUMBER');
          if (!pickup_address || !pickup_phone) throw new Error('Missing store details');

          const payload = {
            external_delivery_id: externalId,
            pickup_address,
            pickup_phone_number: pickup_phone,
            dropoff_address: order.delivery_address,
            dropoff_phone_number: order.customer_phone,
            deliver_at: scheduledTime.toISOString(),
          };

          const ddRes = await fetch('https://openapi.doordash.com/drive/v2/deliveries', {
            method: 'POST',
            headers: { ...corsHeaders, 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });
          const ddJson = await ddRes.json();
          if (!ddRes.ok) {
            console.error('DoorDash error:', ddJson);
          } else {
            // Update order to pending
            await fetch(
              `${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`,
              {
                method: 'PATCH',
                headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ external_delivery_id: externalId, status: 'pending' }),
              }
            );
            processed.push({ orderId: order.id, deliveryId: externalId });
          }
        } catch (e) {
          console.error(`Error processing order ${order.id}:`, e.message);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed, total: orders.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Scheduled function error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
}); 