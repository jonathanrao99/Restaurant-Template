'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BestsellerCardProps {
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  isSpecial?: boolean;
  delay?: number;
  itemId?: number;
  isBold?: boolean;
}

const BestsellerCard = ({ 
  title, 
  description, 
  price, 
  imageSrc, 
  isSpecial = false,
  delay = 0,
  itemId,
  isBold = false
}: BestsellerCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // Fallback to show image after a timeout if onLoad doesn't fire
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!imageLoaded && !imageError) {
        setImageLoaded(true);
      }
    }, 1000); // Reduced to 1 second for better UX

    return () => clearTimeout(timer);
  }, [imageLoaded, imageError]);

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Analytics event for Order Now clicks
    const gtag = (window as any).gtag;
    if (gtag) gtag('event','order_now_click',{event_category:'Engagement',item_id:itemId,item_name:title});
    router.push(`/menu?itemId=${itemId}`);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
      style={{ 
        opacity: 0, 
        animation: 'fade-in 0.5s ease-out forwards', 
        animationDelay: `${delay}ms` 
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {imageError ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Image not available</div>
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={title}
            className={`object-cover transition-all duration-500 group-hover:scale-110 rounded-t-xl ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            style={{ width: '100%', height: '100%' }}
          />
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
      </div>
      
      <div className="p-4">
        <h3 className={`text-lg font-semibold text-gray-900 mb-2 group-hover:text-desi-orange transition-colors duration-300 ${isBold ? 'font-bold' : 'font-semibold'}`}>{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors duration-300">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-medium text-desi-orange group-hover:text-orange-600 transition-colors duration-300">{price}</span>
          <button 
            onClick={handleOrderClick}
            className="inline-flex items-center text-desi-black group-hover:text-desi-orange transition-colors duration-300 text-sm"
          >
            <span>Order Now</span>
            <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestsellerCard;
