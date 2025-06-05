import 'dotenv/config';              // npm install dotenv
import fetch from 'node-fetch';      // npm install node-fetch@2

const token = process.env.SQUARE_ACCESS_TOKEN!;
const locationId = process.env.SQUARE_LOCATION_ID!;

// Debug logging for environment variables
if (!token || !locationId) {
  console.error('Missing Square credentials. Ensure SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID are set in .env', { token, locationId });
  process.exit(1);
}
console.log('Using Square token:', token);
console.log('Using location ID:', locationId);

// Optional record ID filter via CLI argument
const recordId = process.argv[2];
if (recordId) {
  console.log('Filtering for reference_id:', recordId);
} else {
  console.log('No reference_id provided, listing recent orders');
}

async function listOrders() {
  // Build payload with or without reference_id filter
  const payload = recordId
    ? { location_ids: [locationId], query: { filter: { reference_id: { exact: recordId } } } }
    : { location_ids: [locationId], limit: 20 };
  const res = await fetch(
    'https://connect.squareupsandbox.com/v2/orders/search',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    console.error(`Error ${res.status}:`, await res.text());
    process.exit(1);
  }
  console.log(JSON.stringify(await res.json(), null, 2));
}

listOrders();
