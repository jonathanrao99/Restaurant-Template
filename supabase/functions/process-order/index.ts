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
