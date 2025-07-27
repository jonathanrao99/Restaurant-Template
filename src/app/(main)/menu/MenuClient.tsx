'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import MenuItemCard from '@/components/menu/MenuItemCard';
import { toast } from 'sonner';
import { Search, ChevronDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const OrderDialog = dynamic(() => import('@/components/order/OrderDialog'));

// Simple MenuItem interface
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  isvegetarian: boolean;
  isspicy: boolean;
  category: string;
  menu_img?: string;
  quantity?: number;
  specialInstructions?: string;
  sold_out: boolean;
  square_variation_id?: string | null;
}

// Static menu data as fallback
const staticMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chicken Dum Biryani",
    description: "Slow-cooked biryani with tender chicken pieces. Aromatic rice dish packed with traditional spices and flavors.",
    price: "11.99",
    isvegetarian: false,
    isspicy: true,
    category: "Biryani",
    menu_img: "/Menu_Images/chicken-dum-biryani.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 8,
    name: "Butter Chicken",
    description: "Creamy, mildly spiced chicken in a luxurious tomato-based sauce. Beloved North Indian comfort dish.",
    price: "11.99",
    isvegetarian: false,
    isspicy: false,
    category: "Non-Veg Curry",
    menu_img: "/Menu_Images/butter-chicken.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 24,
    name: "Aloo Samosa",
    description: "Classic potato-filled pastry triangles. Iconic Indian street food with a crispy exterior.",
    price: "4.99",
    isvegetarian: true,
    isspicy: false,
    category: "Snacks",
    menu_img: "/Menu_Images/aloo-samosa.jpeg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 5,
    name: "Veg Biryani",
    description: "Aromatic rice dish loaded with mixed vegetables. Flavorful and satisfying vegetarian biryani preparation.",
    price: "9.99",
    isvegetarian: true,
    isspicy: false,
    category: "Biryani",
    menu_img: "/Menu_Images/veg-biryani.jpg",
    sold_out: false,
    square_variation_id: null
  },
  {
    id: 15,
    name: "Parotta",
    description: "Thin, flaky layers of soft, golden-brown flatbread with a delightful chewiness.",
    price: "3.99",
    isvegetarian: true,
    isspicy: false,
    category: "Indian Breads",
    menu_img: "/Menu_Images/parotta.jpg",
    sold_out: false,
    square_variation_id: null
  }
];

type MenuClientProps = {
  initialMenuItems?: MenuItem[];
};

export default function MenuClient({ initialMenuItems }: MenuClientProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch menu data on client side
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        console.log('Starting to fetch menu data from Supabase...');
        setLoading(true);
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
        console.log('Supabase Key:', supabaseKey ? 'Set' : 'Missing');
        
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        console.log('Supabase client created, fetching menu_items...');
        const { data: items, error } = await supabase
          .from('menu_items')
          .select('id, name, description, price, isvegetarian, isspicy, category, menu_img, sold_out, square_variation_id, images');
        
        if (error) {
          console.error('Supabase error:', error);
          console.warn('Using static data as fallback');
          setMenuItems(staticMenuItems);
          setLoading(false);
          return;
        }

        console.log('Supabase response - items count:', items?.length || 0);
        console.log('Supabase response - items:', items);

        if (!items || items.length === 0) {
          console.warn('No menu items from Supabase, using static data');
          setMenuItems(staticMenuItems);
          setLoading(false);
          return;
        }

        const processedItems = items.map((item: any) => {
          let images = item.images;
          if ((!images || images.length === 0) && item.menu_img) {
            images = [item.menu_img];
          } else if (images && item.menu_img && !images.includes(item.menu_img)) {
            images = [item.menu_img, ...images];
          }
          return {
            ...item,
            images,
            isSoldOut: !!item.sold_out
          };
        });

        console.log('Processed menu items:', processedItems.length);
        console.log('Categories found:', [...new Set(processedItems.map(item => item.category))]);
        setMenuItems(processedItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu data:', err);
        console.warn('Using static data as fallback');
        setMenuItems(staticMenuItems);
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);
  
  // Dynamically get categories from menu items in custom order
  const categories = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];
    const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
    
    // Custom category order
    const categoryOrder = [
      'Biryani',
      'Breakfast', 
      'Non-Veg Curry',
      'Veg Curry',
      'Indian Breads',
      'Chaat',
      'Snacks',
      'Chinese Non-Veg',
      'Chinese Veg',
      'Drinks',
      'Sweets'
    ];
    
    // Sort categories according to custom order, with any new categories at the end
    return uniqueCategories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      
      // If both categories are in the order list, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only one is in the order list, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      // If neither is in the order list, sort alphabetically
      return a.localeCompare(b);
    });
  }, [menuItems]);

  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [under10Only, setUnder10Only] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const { addToCart, updateQuantity, cartItems } = useCart();
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  // Initialize openCategories when categories are available
  useEffect(() => {
    if (categories.length > 0 && openCategories.size === 0) {
      setOpenCategories(new Set(categories));
    }
  }, [categories, openCategories.size]);

  const filteredMenuItems = useMemo(() => {
    if (!menuItems) return {};
    const filtered = categories.reduce((acc, category) => {
      acc[category] = menuItems
        .filter(item => item.category === category)
        .filter(item => !vegetarianOnly || item.isvegetarian)
        .filter(item => !spicyOnly || item.isspicy)
        .filter(item => !under10Only || (
          typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^\d.]/g, '')) < 10
            : parseFloat(String(item.price).replace(/[^\d.]/g, '')) < 10
        ))
        .filter(item => item.name.toLowerCase().includes(searchFilter.toLowerCase()));
      return acc;
    }, {} as { [key: string]: MenuItem[] });
    
    return filtered;
  }, [menuItems, categories, vegetarianOnly, spicyOnly, under10Only, searchFilter]);

  useEffect(() => {
    const itemId = searchParams.get('itemId');
    if (itemId && menuItems) {
      const item = menuItems.find((m) => m.id === parseInt(itemId));
      if (item) {
        setSelectedItem(item);
        setIsDialogOpen(true);
      }
    }
  }, [searchParams, menuItems]);

  const handleAddToCart = useCallback((item: MenuItem) => {
    const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;
    const existing = cartItems.find(ci => ci.id === item.id);
    if (existing) {
      updateQuantity(item.id, existing.quantity + qtyToAdd);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: qtyToAdd,
        specialInstructions: item.specialInstructions,
        isVegetarian: item.isvegetarian,
        isSpicy: item.isspicy,
      });
    }
    toast.success(`${item.name} has been added to your cart.`);
  }, [addToCart, updateQuantity, cartItems]);

  const handleSearch = (searchTerm) => {
    // logAnalyticsEvent('search_performed', { searchTerm }); // Removed undefined function
    if (typeof window !== 'undefined') {
      window.gtag && window.gtag('event', 'search_performed', { searchTerm });
      window.umami && window.umami('search_performed', { searchTerm });
    }
    // ...existing search logic...
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error loading menu items: {error}</div>
        </div>
      );
    }

      return (
    <div className="min-h-screen bg-desi-cream overflow-x-hidden">
      <div className="w-[90%] max-w-[90vw] mx-auto px-2 sm:px-4 py-8">
        {/* Filter Pills and Search */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mb-4 w-full">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => setVegetarianOnly(!vegetarianOnly)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border text-sm sm:text-base transition ease-in-out duration-150 hover:shadow-lg active:scale-95 ${vegetarianOnly ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-green-500 text-green-500'}`}
            >
              <span role="img" aria-label="Vegetarian">🥦</span> Vegetarian
            </button>
            <button
              onClick={() => setSpicyOnly(!spicyOnly)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border text-sm sm:text-base transition ease-in-out duration-150 hover:shadow-lg active:scale-95 ${spicyOnly ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-red-500 text-red-500'}`}
            >
              <span role="img" aria-label="Spicy">🔥</span> Spicy
            </button>
            <button
              onClick={() => setUnder10Only(!under10Only)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border text-sm sm:text-base transition ease-in-out duration-150 hover:shadow-lg active:scale-95 ${under10Only ? 'bg-desi-orange border-desi-orange text-white' : 'bg-white border-desi-orange text-desi-orange'}`}
            >
              Under $10
            </button>
          </div>
          <div className="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-auto relative flex-shrink-0 max-w-full sm:max-w-xs md:max-w-md">
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search..."
              className="w-full pr-10 pl-4 py-2 border border-desi-orange rounded-full focus:outline-none focus:ring-2 focus:ring-desi-orange transition-colors text-sm sm:text-base"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-desi-orange cursor-pointer" />
          </div>
        </div>
        <div className="divide-y divide-gray-200 bg-transparent rounded-none shadow-none border-none">
          {categories.map((category) => {
            const isOpen = openCategories.has(category);
            return (
              <div key={category} className="border-0 rounded-none">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full text-center font-display font-bold py-1 md:py-2 px-0 text-base md:text-xl bg-transparent no-underline hover:text-desi-orange focus:outline-none cursor-pointer flex items-center justify-between"
                >
                  <span className="flex-1">{category}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  style={{
                    maxHeight: isOpen ? 'none' : '0px'
                  }}
                >
                  <div className="px-0 pb-6 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {filteredMenuItems[category]?.map(item => (
                          <MenuItemCard key={item.id} item={item} handleAddToCart={handleAddToCart} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {isDialogOpen && selectedItem && (
          <OrderDialog
            item={selectedItem}
            onClose={() => setIsDialogOpen(false)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 
