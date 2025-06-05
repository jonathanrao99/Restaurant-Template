import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuCategoriesProps {
  selectedCategory: string;
  categories: string[];
  setSelectedCategory: (category: string) => void;
}

const MenuCategories = ({ selectedCategory, categories, setSelectedCategory }: MenuCategoriesProps) => {
  return (
    <div className="sticky top-0 z-50 transition-all duration-300 bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-hide">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center space-x-1 text-sm ${
              selectedCategory === 'All'
                ? 'bg-desi-orange text-white shadow-md shadow-desi-orange/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <span>All Items</span>
            {selectedCategory === 'All' && <ChevronRight className="w-3 h-3" />}
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center space-x-1 text-sm ${
                selectedCategory === category
                  ? 'bg-desi-orange text-white shadow-md shadow-desi-orange/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <span>{category}</span>
              {selectedCategory === category && <ChevronRight className="w-3 h-3" />}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCategories;
