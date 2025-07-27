'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/utils/motion.variants';
import { DeliveryServiceModal } from '@/components/ui/delivery-service-modal';

const Cart = () => {
  const { cartItems } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') window.gtag('event', 'cart_view', {});
      if (typeof window.umami === 'function') window.umami('cart_view', {});
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/menu');
  };

  return (
    <>
      {/* Hero-like Header Section */}
      <section className="pt-20 pb-6 bg-white overflow-hidden">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 sm:px-6 max-w-7xl"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-desi-orange"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-5xl font-display font-bold text-desi-orange leading-tight">Shopping Cart</h1>
              <p className="mt-2 text-lg text-gray-600">
                {isMounted ? `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your cart` : null}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content Section */}
      <section className="pt-8 pb-2 bg-gray-50 overflow-hidden min-h-screen">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 sm:px-6 max-w-7xl"
        >
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ordering Temporarily Unavailable</h2>
            <p className="text-gray-600 mb-6">
              We're working on our own delivery partner to serve you better! 
              Please order through our trusted third-party delivery partners.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-desi-orange hover:bg-desi-orange/90"
            >
              Order Through Our Partners
            </Button>
          </div>
        </motion.div>
      </section>

      <DeliveryServiceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default Cart;