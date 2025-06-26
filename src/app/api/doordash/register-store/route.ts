import { NextRequest, NextResponse } from 'next/server';

// Use long-lived DoorDash Business API token for store registration
const bizToken = process.env.DOORDASH_BIZ_API_TOKEN;
if (typeof bizToken === 'undefined' || bizToken === '') {
  console.warn('DOORDASH_BIZ_API_TOKEN is not set. Store registration will fail with 401.');
}

export async function POST(req: NextRequest) {
  try {
    const token = bizToken;
    if (!token) {
      // Running without Business API: return mock store_id
      const mockId = process.env.MOCK_DOORDASH_STORE_ID || 'mock-store-id';
      console.warn('No DOORDASH_BIZ_API_TOKEN found, returning mock store_id:', mockId);
      return NextResponse.json({
        success: true,
        store_id: mockId,
        message: 'Mocked store registration (no Business API token)'
      });
    }
    
    // Store registration payload
    const storePayload = {
      name: 'Desi Flavors Hub',
      phone_number: '+12814010758',
      address: {
        street: '1989 North Fry Rd',
        city: 'Katy',
        state: 'TX',
        zip_code: '77494',
        country: 'US'
      },
      business_id: process.env.DOORDASH_BUSINESS_ID || 'desi-flavors-hub-001',
      contact_emails: ['desiflavors.hub@gmail.com'],
      merchant_supplied_id: 'desi-flavors-hub-katy',
      price_range: 2, // $$ price range
      business_vertical: 'restaurant',
      description: 'Authentic Indian and Pakistani cuisine featuring fresh biryani, curries, and traditional dishes.',
      website_url: 'https://desiflavors.com',
      cover_img_url: 'https://desiflavors.com/logo.png',
      header_img_url: 'https://desiflavors.com/header.jpg',
      location_type: 'standalone',
      special_hours: [],
      business_hours: [
        {
          day_of_week: 1, // Monday
          periods: [{ start_time: '11:00', end_time: '22:00' }]
        },
        {
          day_of_week: 2, // Tuesday  
          periods: [{ start_time: '11:00', end_time: '22:00' }]
        },
        {
          day_of_week: 3, // Wednesday
          periods: [{ start_time: '11:00', end_time: '22:00' }]
        },
        {
          day_of_week: 4, // Thursday
          periods: [{ start_time: '11:00', end_time: '22:00' }]
        },
        {
          day_of_week: 5, // Friday
          periods: [{ start_time: '11:00', end_time: '23:00' }]
        },
        {
          day_of_week: 6, // Saturday
          periods: [{ start_time: '11:00', end_time: '23:00' }]
        },
        {
          day_of_week: 0, // Sunday
          periods: [{ start_time: '11:00', end_time: '22:00' }]
        }
      ]
    };

    console.log('Registering store with DoorDash:', storePayload);

    const response = await fetch('https://openapi.doordash.com/developer/v1/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(storePayload),
    });

    // Log response status and raw body for debugging
    const statusCode = response.status;
    const rawText = await response.text();
    console.log('DoorDash register-store response status:', statusCode);
    console.log('DoorDash register-store raw response:', rawText);
    // Parse JSON safely
    let result: any = {};
    try {
      result = JSON.parse(rawText);
    } catch (err) {
      console.error('Error parsing DoorDash register-store response JSON:', err);
    }

    if (!response.ok) {
      console.error('Store registration failed:', result);
      return NextResponse.json({ error: result.error || 'Registration failed', details: result }, { status: response.status });
    }

    console.log('Store registered successfully:', result);
    
    // Store the store_id in environment or database for future use
    return NextResponse.json({ 
      success: true, 
      store_id: result.id,
      message: 'Store registered successfully with DoorDash',
      details: result
    });

  } catch (error: any) {
    console.error('Error registering store:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 