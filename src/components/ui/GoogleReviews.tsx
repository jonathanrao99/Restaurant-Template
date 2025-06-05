import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { MotionDiv } from './MotionDiv';

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: string;
  profile_photo_url?: string;
}

const GoogleReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Replace with your actual Google Places API endpoint
        const response = await fetch(`/api/google-reviews`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.reviews);
      } catch (err) {
        setError('Unable to load reviews at this time');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-desi-orange"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-gray-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review, index) => (
        <MotionDiv
          key={index}
          type="fadeIn"
          delay={index * 0.1}
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              {review.profile_photo_url ? (
                <img
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-desi-orange/10 flex items-center justify-center mr-3">
                  <span className="text-desi-orange font-semibold">
                    {review.author_name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-desi-black">{review.author_name}</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.text}</p>
            <p className="text-gray-400 text-xs mt-4">
              {new Date(review.time).toLocaleDateString()}
            </p>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
};

export default GoogleReviews; 