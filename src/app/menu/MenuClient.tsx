'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMenuItems, MenuItem } from '@/hooks/useMenuItems';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import MenuCategories from '@/components/menu/MenuCategories';
import MenuItemCard from '@/components/menu/MenuItemCard';
import AnimatedCardGrid, { AnimatedCard } from '@/components/AnimatedCardGrid';
import OrderDialog from '@/components/order/OrderDialog';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function MenuClient() {
  const { menuItems, loading, error, selectedCategory, setSelectedCategory, categories } = useMenuItems();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const { scrollToElement } = useSmoothScroll();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (menuItemsRef.current) {
      requestAnimationFrame(() => {
        scrollToElement(menuItemsRef, { behavior: 'smooth', duration: 300 });
      });
    }
  }, [selectedCategory, scrollToElement]);

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
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      specialInstructions: item.specialInstructions,
      isVegetarian: item.isvegetarian,
      isSpicy: item.isspicy,
    });
    toast({ title: 'Added to cart', description: `${item.name} has been added to your cart.` });
  }, [addToCart, toast]);

  const handleCategoryClick = useCallback((category: string) => {
    setIsCategoryLoading(true);
    setSelectedCategory(category);
    setTimeout(() => setIsCategoryLoading(false), 300);
  }, [setSelectedCategory]);

  const menuItemsGrid = useMemo(() => {
    if (loading || isCategoryLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-600">Loading menu items...</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">Error loading menu items. Please try again later.</div>
        </div>
      );
    }
    if (!menuItems?.length) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">No menu items found.</div>
        </div>
      );
    }
    return (
      <AnimatedCardGrid>
        {menuItems.map((item) => (
          <AnimatedCard key={item.id}>
            <MenuItemCard item={item} handleAddToCart={handleAddToCart} />
          </AnimatedCard>
        ))}
      </AnimatedCardGrid>
    );
  }, [menuItems, loading, error, handleAddToCart, isCategoryLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuCategories
        selectedCategory={selectedCategory}
        categories={categories}
        setSelectedCategory={handleCategoryClick}
      />
      <div ref={menuItemsRef} className="container mx-auto px-4 py-8">
        {menuItemsGrid}
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