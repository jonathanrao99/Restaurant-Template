// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-requested-with"
};

serve(async (req) => {
  console.log('=== CALCULATE-FEE FUNCTION CALLED ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  // Debug env vars
  console.log('Supabase calculate-fee environment check:', {
    hasShipDayApiKey: !!Deno.env.get('SHIPDAY_API_KEY'),
    hasStoreAddress: !!Deno.env.get('STORE_ADDRESS'),
    hasStorePhone: !!Deno.env.get('STORE_PHONE_NUMBER'),
    shipDayApiKeyLength: Deno.env.get('SHIPDAY_API_KEY')?.length || 0
  });

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const { address, dropoffPhoneNumber } = await req.json();
    console.log('calculate-fee received body:', {
      address,
      dropoffPhoneNumber
    });

    if (!address) throw new Error('No address provided');
    if (!dropoffPhoneNumber) throw new Error('No dropoffPhoneNumber provided');

    // Calculate delivery fee using fallback method (while ShipDay API is being debugged)
    console.log('Using fallback delivery fee calculation');
    
    // Simple distance-based fee calculation
    let estimatedFee = 5.00; // Base fee
    
    // If address contains Katy, TX, it's closer
    if (address.toLowerCase().includes('katy')) {
      estimatedFee = 4.50;
    } else if (address.toLowerCase().includes('houston')) {
      estimatedFee = 6.50;
    } else if (address.toLowerCase().includes('cypress') || address.toLowerCase().includes('spring')) {
      estimatedFee = 5.50;
    } else if (address.toLowerCase().includes('sugar land') || address.toLowerCase().includes('missouri city')) {
      estimatedFee = 5.75;
    }
    
    console.log('Fallback delivery fee calculated:', estimatedFee);

    // Return the estimated fee
    return new Response(JSON.stringify({
      fee: estimatedFee
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (error) {
    console.error('Delivery fee calculation error:', error.message);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
}); 