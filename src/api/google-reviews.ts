import { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID; // Your food truck's Google Place ID

// Define types for Google Places API reviews
interface GoogleReview {
  rating: number;
  time: number;
  [key: string]: unknown;
}

interface PlaceDetailsResponse {
  status: string;
  result: { reviews: GoogleReview[] };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Google Places API');
    }

    const data = (await response.json()) as PlaceDetailsResponse;

    if (data.status !== 'OK') {
      throw new Error('Invalid response from Google Places API');
    }

    // Filter for 5-star reviews and sort by date
    const reviews = data.result.reviews
      .filter(review => review.rating === 5)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6); // Get the 6 most recent 5-star reviews

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
} 