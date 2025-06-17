import { Calendar, Clock } from 'lucide-react';
import SocialLinks from '@/components/SocialLinks';

const OtherWaysSection = () => {
  return (
    <section className="py-12 bg-desi-cream">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-10 text-center">
          Other Ways to Enjoy Our Food
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-desi-orange/10 mb-6">
              <Calendar className="text-desi-orange" size={24} />
            </div>
            <h3 className="font-display font-medium text-xl mb-3">
              Visit Our Food Truck
            </h3>
            <p className="text-gray-600 mb-4">
              <a 
                href="https://maps.app.goo.gl/JURVBywvbtw7Qgja7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-desi-orange transition-colors"
              >
                1989 North Fry RD<br />
                Katy, Texas, 77449
              </a>
            </p>
            <div className="flex items-start mt-4 mb-6">
              <Clock className="text-desi-orange mt-1 mr-3" size={20} />
              <div>
                <h4 className="font-medium">Operating Hours</h4>
                <p className="text-gray-600">
                  Monday - Sunday<br/>
                  5:00 PM - 1:00 AM
                </p>
              </div>
            </div>
            <div className="flex mt-4">
              <SocialLinks spacing="space-x-4" iconSize={20} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-desi-orange/10 mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-desi-orange"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
              </svg>
            </div>
            <h3 className="font-display font-medium text-xl mb-3">
              WhatsApp Orders
            </h3>
            <p className="text-gray-600 mb-4">
              Message us directly on WhatsApp to place your order for pickup. We'll have it ready when you arrive at 
              our food truck.
            </p>
            <a href="https://wa.me/13468244212" className="inline-block mt-4 px-6 py-3 bg-desi-orange hover:bg-desi-orange/90 
                text-white rounded-full font-medium transition-colors">
              <span className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
                </svg>
                346-824-4212
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherWaysSection;
