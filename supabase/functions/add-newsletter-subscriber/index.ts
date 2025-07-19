import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

async function addToResendContacts(email: string, name: string) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  
  // First, get or create the audience
  const audienceName = 'Desi Flavors Newsletter';
  
  // List existing audiences to find ours
  const listRes = await fetch('https://api.resend.com/audiences', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!listRes.ok) {
    throw new Error(`Failed to list audiences: ${await listRes.text()}`);
  }
  
  const audiences = await listRes.json();
  let audienceId = null;
  
  // Find our audience
  for (const audience of audiences.data || []) {
    if (audience.name === audienceName) {
      audienceId = audience.id;
      break;
    }
  }
  
  // Create audience if it doesn't exist
  if (!audienceId) {
    const createRes = await fetch('https://api.resend.com/audiences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: audienceName })
    });
    
    if (!createRes.ok) {
      throw new Error(`Failed to create audience: ${await createRes.text()}`);
    }
    
    const newAudience = await createRes.json();
    audienceId = newAudience.id;
  }
  
  // Add contact to the audience
  const firstName = name.split(' ')[0] || name;
  const lastName = name.split(' ').slice(1).join(' ') || '';
  
  const contactRes = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      firstName: firstName,
      lastName: lastName,
      unsubscribed: false,
      audienceId: audienceId
    })
  });
  
  if (!contactRes.ok) {
    const error = await contactRes.text();
    throw new Error(`Failed to add contact: ${error}`);
  }
  
  return await contactRes.json();
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
    
    const result = await addToResendContacts(body.email, body.name);
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