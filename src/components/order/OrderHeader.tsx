'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const OrderHeader = () => {
  return (
    <section className="relative bg-gradient-to-b from-desi-cream to-white py-32 md:py-40 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center relative">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-desi-orange to-orange-600">
          Order Online
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg mb-8 animate-fade-in-delay">
          Browse our menu, select your items, and checkout securely. Choose between pickup or delivery from our 
          location.        </p>
        <div className="mt-8">
          <Link href="/cart" className="inline-flex items-center bg-desi-orange hover:bg-desi-orange/90 text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl">
            <ShoppingCart size={20} className="mr-3" />
            View Cart
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderHeader;
