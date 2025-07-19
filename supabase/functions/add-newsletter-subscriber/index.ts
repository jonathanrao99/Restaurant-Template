import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

async function addToResendAudience(email: string, name: string) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  
  // Add to Resend audience (newsletter list)
  const res = await fetch('https://api.resend.com/audiences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Desi Flavors Newsletter',
      audience: [{
        email: email,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        subscribed: true
      }]
    })
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to add to Resend audience: ${error}`);
  }
  
  return res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        headers: corsHeaders, 
        status: 405 
      });
    }
    
    const body = await req.json();
    if (!body.email || !body.name) {
      return new Response(JSON.stringify({ error: 'Missing email or name' }), { 
        headers: corsHeaders, 
        status: 400 
      });
    }
    
    const result = await addToResendAudience(body.email, body.name);
    return new Response(JSON.stringify({ success: true, result }), { 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: corsHeaders, 
      status: 500 
    });
  }
}); 