// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();
    if (!address) throw new Error('No address provided');

    // Parse store coordinates from env
    const STORE_LAT = parseFloat(Deno.env.get('STORE_LAT') || '');
    const STORE_LON = parseFloat(Deno.env.get('STORE_LON') || '');
    if (isNaN(STORE_LAT) || isNaN(STORE_LON)) {
      throw new Error('Missing store coordinates in env');
    }

    // Geocode helper via Nominatim
    async function geocode(addr: string) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`;
      const res = await fetch(url);
      const list = await res.json();
      if (!Array.isArray(list) || !list.length) {
        throw new Error('Invalid address');
      }
      return { lat: parseFloat(list[0].lat), lon: parseFloat(list[0].lon) };
    }

    // Get coordinates
    const dest = await geocode(address);

    // Get route via public OSRM
    const osrmRes = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${STORE_LON},${STORE_LAT};${dest.lon},${dest.lat}?overview=false`
    );
    const osrmData = await osrmRes.json();
    if (osrmData.code !== 'Ok' || !Array.isArray(osrmData.routes) || !osrmData.routes.length) {
      throw new Error('Cannot deliver to this location');
    }
    const meters = osrmData.routes[0].distance;
    const miles = meters / 1609.34;
    const milesRounded = Math.ceil(miles);

    // Compute fees
    const feeUber = 4.99 + milesRounded;
    const feeDoor = 6.99 + milesRounded;
    const fee = Math.min(feeUber, feeDoor);

    return new Response(JSON.stringify({ fee: Number(fee.toFixed(2)) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Delivery fee calculation error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 