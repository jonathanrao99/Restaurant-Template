// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This endpoint will be triggered by a database webhook when a new order is created
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    
    if (!record) {
      throw new Error("No order record provided");
    }

    console.log("Processing new order:", record.id);
    
    // Load Square credentials
    const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
    const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_LOCATION_ID');
    if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      throw new Error('Missing Square access token or location ID');
    }
    // Prepare line items for Square
    const items = typeof record.items === "string" ? JSON.parse(record.items) : record.items;
    const lineItems = (items as any[]).map(item => ({
      name: item.name,
      quantity: item.quantity.toString(),
      base_price_money: {
        amount: Math.round(parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * 100),
        currency: "USD"
      }
    }));
    // Build Square order request
    const orderRequest = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: SQUARE_LOCATION_ID,
        line_items: lineItems,
        reference_id: record.id.toString(),
        customer_notes: record.special_instructions || ""
      }
    };
    // Send order to Square
    const response = await fetch("https://connect.squareup.com/v2/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderRequest)
    });
    const responseBody = await response.json();
    if (!response.ok) {
      console.error("Square Orders API error:", responseBody);
      throw new Error(responseBody.errors?.map((e: any) => e.detail).join(", ") || "Square API error");
    }
    console.log("Square order created:", responseBody.order.id);
    // If this is a delivery order
    if (record.order_type === 'delivery' && record.delivery_address) {
      // Only trigger DoorDash for ASAP orders immediately; scheduled orders will be handled later
      if (record.scheduled_time === 'ASAP') {
        let retryCount = 0;
        const maxRetries = 3;
        let lastError: any = null;
        
        while (retryCount < maxRetries) {
          try {
            // Generate DoorDash JWT
            async function generateJWT() {
              const developer_id = Deno.env.get('DOORDASH_DRIVE_DEVELOPER_ID');
              const key_id = Deno.env.get('DOORDASH_DRIVE_KEY_ID');
              const signing_secret = Deno.env.get('DOORDASH_DRIVE_SIGNING_SECRET');
              if (!developer_id || !key_id || !signing_secret) {
                throw new Error('MISSING_CREDENTIALS: DoorDash credentials not configured');
              }
              
              const header = { alg: 'HS256', typ: 'JWT', 'dd-ver': 'DD-JWT-V1' };
              const iat = Math.floor(Date.now() / 1000);
              const exp = iat + 300;
              const payload = { aud: 'doordash', iss: developer_id, kid: key_id, iat, exp };
              
              const headerB64 = btoa(JSON.stringify(header));
              const payloadB64 = btoa(JSON.stringify(payload));
              const dataToSign = `${headerB64}.${payloadB64}`;
              
              const key = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(atob(signing_secret)),
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
              );
              
              const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(dataToSign));
              const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
              
              return `${dataToSign}.${signatureB64}`;
            }
            
            const ddToken = await generateJWT();
            
            // Build DoorDash delivery payload
            const external_delivery_id = crypto.randomUUID();
            
            // First, create a quote
            const quotePayload = {
              external_delivery_id,
              locale: 'en-US',
              order_fulfillment_method: 'standard',
              pickup_address: Deno.env.get('STORE_ADDRESS'),
              pickup_business_name: 'Desi Flavors Hub',
              pickup_phone_number: '+12814010758',
              dropoff_address: record.delivery_address,
              dropoff_phone_number: record.customer_phone,
              dropoff_business_name: record.customer_name,
              order_value: Math.round(record.total_amount * 100),
            };
            
            // Create quote first
            const quoteRes = await fetch('https://openapi.doordash.com/drive/v2/quotes', {
              method: 'POST',
              headers: { ...corsHeaders, 'Content-Type': 'application/json', Authorization: `Bearer ${ddToken}` },
              body: JSON.stringify(quotePayload),
            });
            const quoteJson = await quoteRes.json();
            if (!quoteRes.ok) {
              const errorType = quoteRes.status === 400 ? 'INVALID_REQUEST' : 
                               quoteRes.status === 401 ? 'UNAUTHORIZED' :
                               quoteRes.status === 403 ? 'FORBIDDEN' :
                               quoteRes.status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR';
              throw new Error(`${errorType}: ${quoteJson.error || JSON.stringify(quoteJson)}`);
            }
            console.log('DoorDash quote created:', quoteJson.external_delivery_id);
            
            // Accept the quote to create delivery
            const acceptRes = await fetch(`https://openapi.doordash.com/drive/v2/quotes/${quoteJson.external_delivery_id}/accept`, {
              method: 'POST',
              headers: { ...corsHeaders, 'Content-Type': 'application/json', Authorization: `Bearer ${ddToken}` },
              body: JSON.stringify({
                tip: Math.round((record.doordash_tip || 0) * 100) // Use allocated tip amount in cents
              }),
            });
            const ddJson = await acceptRes.json();
            if (!acceptRes.ok) {
              const errorType = acceptRes.status === 400 ? 'INVALID_REQUEST' : 
                               acceptRes.status === 401 ? 'UNAUTHORIZED' :
                               acceptRes.status === 403 ? 'FORBIDDEN' :
                               acceptRes.status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR';
              throw new Error(`${errorType}: ${ddJson.error || JSON.stringify(ddJson)}`);
            }
            console.log('DoorDash delivery created via quote acceptance:', ddJson.external_delivery_id);
            
            // Update Supabase order with external_delivery_id
            const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
            const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
            if (SUPABASE_URL && SERVICE_ROLE_KEY) {
              const patchRes = await fetch(
                `${SUPABASE_URL}/rest/v1/orders?id=eq.${record.id}`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                    'Prefer': 'return=representation'
                  },
                  body: JSON.stringify({ external_delivery_id: ddJson.external_delivery_id })
                }
              );
              if (!patchRes.ok) console.error('Failed to patch external_delivery_id:', await patchRes.text());
              else console.log('Supabase order updated with external_delivery_id');
            } else {
              console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY; cannot patch external_delivery_id');
            }
            
            // Success - break out of retry loop
            break;
            
          } catch (error: any) {
            lastError = error;
            retryCount++;
            
            console.error(`DoorDash delivery attempt ${retryCount} failed:`, error.message);
            
            // Don't retry for certain error types
            if (error.message.includes('MISSING_CREDENTIALS') || 
                error.message.includes('INVALID_REQUEST') ||
                error.message.includes('FORBIDDEN')) {
              console.error('Non-retryable error, stopping attempts');
              break;
            }
            
            // Wait before retry (exponential backoff)
            if (retryCount < maxRetries) {
              const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
              console.log(`Waiting ${delay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
        
        // If all retries failed, log error but don't fail the entire function
        if (retryCount >= maxRetries && lastError) {
          console.error(`All ${maxRetries} DoorDash delivery attempts failed. Final error:`, lastError.message);
          
          // Update order status to indicate delivery creation failed
          try {
            // Update Square order metadata with delivery_id and tracking_url
            await fetch(
              `https://connect.squareup.com/v2/orders/${responseBody.order.id}`,
              {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  order: {
                    metadata: {
                      delivery_id: null,
                      tracking_url: null
                    }
                  }
                })
              }
            );
            console.log('Square order updated with delivery metadata');
          } catch (e) {
            console.error('Failed to update Square order metadata:', e);
          }
        } else {
          console.log('Order is scheduled for later, skipping immediate DoorDash creation');
        }
      } else {
        console.log(`Scheduled order ${record.id} - skipping immediate DoorDash delivery; will be processed later`);
      }
    }
    // Twilio voice call notification (SMS temporarily disabled)
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_FROM_PHONE = Deno.env.get('TWILIO_FROM_PHONE');
    const TWILIO_TO_PHONE = Deno.env.get('TWILIO_TO_PHONE');
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_PHONE && TWILIO_TO_PHONE) {
      // Prepare item list for voice call
      const parsedItems = typeof record.items === 'string' ? JSON.parse(record.items) : record.items;
      const itemsList = (parsedItems as any[]).map(item => `${item.quantity} x ${item.name}`).join(', ');
      // Voice call TwiML
      const twiml = `<Response><Say voice="alice">You have received a new Square order. Order number: ${record.id}. Items: ${itemsList}.</Say></Response>`;
      const callParams = new URLSearchParams({ From: TWILIO_FROM_PHONE, To: TWILIO_TO_PHONE, Twiml: twiml });
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: callParams.toString(),
        }
      );
    }
    return new Response(JSON.stringify({
      success: true,
      square_order_id: responseBody.order.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
