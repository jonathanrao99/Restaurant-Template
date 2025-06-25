import { NextRequest, NextResponse } from 'next/server';

const UMAMI_API_URL = 'https://us.umami.is/api';
const WEBSITE_ID = '0ab19376-7ad8-48fc-8f59-c69951883021';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get('endDate') || new Date().toISOString();
    const type = searchParams.get('type') || 'stats';

    const headers = {
      'Authorization': `Bearer ${process.env.UMAMI_API_TOKEN}`,
      'Content-Type': 'application/json'
    };

    let response;
    
    switch (type) {
      case 'stats':
        response = await fetch(
          `${UMAMI_API_URL}/websites/${WEBSITE_ID}/stats?startAt=${new Date(startDate).getTime()}&endAt=${new Date(endDate).getTime()}`,
          { headers }
        );
        break;
        
      case 'pageviews':
        response = await fetch(
          `${UMAMI_API_URL}/websites/${WEBSITE_ID}/pageviews?startAt=${new Date(startDate).getTime()}&endAt=${new Date(endDate).getTime()}&unit=day`,
          { headers }
        );
        break;
        
      case 'events':
        response = await fetch(
          `${UMAMI_API_URL}/websites/${WEBSITE_ID}/events?startAt=${new Date(startDate).getTime()}&endAt=${new Date(endDate).getTime()}`,
          { headers }
        );
        break;
        
      case 'metrics':
        response = await fetch(
          `${UMAMI_API_URL}/websites/${WEBSITE_ID}/metrics?startAt=${new Date(startDate).getTime()}&endAt=${new Date(endDate).getTime()}&type=url`,
          { headers }
        );
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    if (!response.ok) {
      console.error('Umami API error:', response.status, await response.text());
      return NextResponse.json({ error: 'Failed to fetch Umami data' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching Umami data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 