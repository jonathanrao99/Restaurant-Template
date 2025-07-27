'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { DeliveryServiceModal } from '@/components/ui/delivery-service-modal';

export const dynamic = 'force-dynamic';

function PaymentPageContent() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    // If cart is empty, redirect to menu
    if (cartItems.length === 0) {
      router.push('/menu');
    }
  }, [cartItems.length, router]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ordering Temporarily Unavailable</h1>
        <p className="text-gray-600 mb-6">
          We're working on our own delivery partner to serve you better!
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-desi-orange text-white px-6 py-3 rounded-lg hover:bg-desi-orange/90 transition-colors"
        >
          Order Through Our Partners
        </button>
            </div>
            
      <DeliveryServiceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
                  />
                </div>
  );
}

export default function PaymentPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
} 