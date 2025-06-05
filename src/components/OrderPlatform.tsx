
import { UtensilsCrossed, ChefHat, ArrowRight } from 'lucide-react';

interface OrderPlatformProps {
  logo: string;
  name: string;
  description: string;
  link: string;
  backgroundColor?: string;
  textColor?: string;
  delay?: number;
}

const OrderPlatform = ({ 
  logo, 
  name, 
  description, 
  link,
  backgroundColor = 'bg-white',
  textColor = 'text-desi-black',
  delay = 0
}: OrderPlatformProps) => {
  return (
    <div 
      className={`${backgroundColor} rounded-xl shadow-md overflow-hidden hover:shadow-lg 
        transition-all duration-300 transform hover:-translate-y-1`}
      style={{ 
        opacity: 0, 
        animation: 'fade-in 0.7s ease-out forwards', 
        animationDelay: `${delay}ms` 
      }}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          {logo ? (
            <img src={logo} alt={name} className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 bg-desi-orange/10 rounded-full flex items-center justify-center">
              {name.includes('Uber') ? (
                <UtensilsCrossed className="text-desi-orange" size={24} />
              ) : (
                <ChefHat className="text-desi-orange" size={24} />
              )}
            </div>
          )}
          <h3 className={`font-display font-medium text-xl ${textColor}`}>{name}</h3>
        </div>
        
        <p className={`${textColor.includes('white') ? 'text-gray-200' : 'text-gray-600'} mb-6`}>
          {description}
        </p>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`inline-flex items-center space-x-2 ${
            textColor.includes('white') 
              ? 'text-white hover:text-gray-200' 
              : 'text-desi-orange hover:text-desi-orange/80'
          } transition-colors font-medium`}
        >
          <span>Order Now</span>
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};

export default OrderPlatform;
