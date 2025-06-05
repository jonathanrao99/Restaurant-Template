'use client';
import { ShoppingCart, ImageIcon, Star, ArrowRight, Clock, Utensils } from 'lucide-react';
import { MenuItem } from '@/hooks/useMenuItems';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import OrderDialog from '@/components/order/OrderDialog';
import { fadeInUp } from '@/utils/motion.variants';

interface MenuItemCardProps {
  item: MenuItem;
  handleAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, handleAddToCart }: MenuItemCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = item.menu_img || '/placeholder.svg';

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const handleOrderNow = useCallback(() => {
    router.push(`/menu?itemId=${item.id}`);
  }, [router, item.id]);

  return (
    <>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-[400px] flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-56 w-full">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
              <span className="text-desi-orange font-medium text-lg">{item.price}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{item.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {item.isvegetarian && (
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-sm rounded-full font-medium border border-green-100">
                  Vegetarian
                </span>
              )}
              {item.isspicy && (
                <span className="px-2 py-0.5 bg-red-50 text-red-700 text-sm rounded-full font-medium border border-red-100">
                  Spicy
                </span>
              )}
            </div>

            {item.isSoldOut ? (
              <span className="flex items-center space-x-1 text-gray-400 font-medium text-base select-none">
                <span>Sold Out</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </span>
            ) : (
            <div
              onClick={() => setIsDialogOpen(true)}
              className="text-desi-orange hover:text-desi-orange/80 transition-colors flex items-center space-x-1 font-medium cursor-pointer text-base"
                tabIndex={0}
                role="button"
                aria-disabled={false}
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            )}
          </div>
        </div>
      </motion.div>

      {isDialogOpen && (
        <OrderDialog
          item={item}
          onClose={() => setIsDialogOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}
