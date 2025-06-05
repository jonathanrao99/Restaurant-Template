import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export const Cart = () => {
  const { items, isOpen, setIsOpen } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(!isOpen)}
      className="relative p-2 text-gray-700 hover:text-desi-orange transition-colors no-underline"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-desi-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </motion.button>
  );
}; 