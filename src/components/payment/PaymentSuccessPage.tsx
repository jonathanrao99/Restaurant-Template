'use client';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your food is being prepared and will be ready for you soon.
        </p>
        <div className="space-y-4">
            <p className="text-sm text-gray-500">You will receive a confirmation email shortly.</p>
             <Link href="/menu" className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
}
