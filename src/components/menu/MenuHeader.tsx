import { motion } from 'framer-motion';
import { UtensilsCrossed, Clock, Truck, ExternalLink } from 'lucide-react';

const MenuHeader = () => {
  return (
    <section className="relative bg-gradient-to-b from-desi-cream to-white py-32 md:py-40 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-desi-orange to-orange-600">
            Our Menu
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg mb-8">
            Discover our authentic Indian dishes made with traditional recipes and fresh ingredients. 
            All served with love, directly from our food truck.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm relative"
            >
              <UtensilsCrossed className="w-5 h-5 text-desi-orange" />
              <span className="text-sm font-medium">Fresh Daily</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm relative"
            >
              <Clock className="w-5 h-5 text-desi-orange" />
              <span className="text-sm font-medium">Quick Service</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm relative"
            >
              <Truck className="w-5 h-5 text-desi-orange" />
              <span className="text-sm font-medium">Food Truck</span>
            </motion.div>
          </div>

          <div className="mt-8 inline-flex items-center justify-center">
            <span className="bg-green-100 text-green-900 text-sm md:text-base rounded-full px-4 py-1.5 font-medium shadow-sm">
              100% Halal
            </span>
          </div>
          
          {/* Delivery Service Buttons */}
          <div className="mt-6 flex flex-col items-center">
            <h3 className="text-gray-700 text-base md:text-lg font-medium mb-3">Order online with our delivery partners</h3>
            <div className="flex flex-wrap justify-center gap-8">
              <motion.a
                href="http://menus.fyi/10883320"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center"
              >
                <img 
                  src="/Grubhub.webp" 
                  alt="Order on Grubhub" 
                  className="h-10 w-auto"
                />
              </motion.a>
              <motion.a
                href="https://order.online/business/desi-flavors-katy-14145277"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center mt-2"
              >
                <img 
                  src="/Doordash.webp" 
                  alt="Order on Doordash" 
                  className="h-6 w-auto"
                />
              </motion.a>
              <motion.a
                href="https://www.order.store/store/desi-flavors-katy-1989-fry-road/drrAdlMVTTin4O0Bdvzo2g"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center mt-2"
              >
                <img 
                  src="/ubereats.png" 
                  alt="Order on UberEats" 
                  className="h-6 w-auto"
                />
              </motion.a>
            </div>
          </div>
          
          {/* Note: Grubhub.webp and Doordash.webp images are now in the public directory */}
        </motion.div>
      </div>
    </section>
  );
};

export default MenuHeader;
