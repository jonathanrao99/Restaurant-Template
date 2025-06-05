interface OrderCategoriesProps {
  activeCategory: string;
  categories: string[];
  handleCategoryClick: (category: string) => void;
  isScrolled: boolean;
}

const OrderCategories = ({ activeCategory, categories, handleCategoryClick, isScrolled }: OrderCategoriesProps) => {
  return (
    <section className={`py-8 md:sticky md:top-16 z-10 transition-all duration-300 ${isScrolled ? 'bg-transparent' : 'bg-white'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center w-full">
          <div className="flex flex-wrap justify-center items-center gap-3 max-w-5xl mx-auto">
            <button
              onClick={() => handleCategoryClick('All')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'All'
                  ? 'bg-desi-orange text-white shadow-md'
                  : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
              }`}
            >
              All Items
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  category === activeCategory
                    ? 'bg-desi-orange text-white shadow-md'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderCategories;
