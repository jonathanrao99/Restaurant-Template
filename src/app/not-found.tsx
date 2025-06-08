'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex items-center justify-center bg-desi-cream px-4">
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="text-6xl font-display font-bold mb-4 text-desi-black">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-desi-orange hover:bg-desi-orange/90 text-white rounded-full font-medium transition-colors shadow-md"
        >
          <Home size={18} className="mr-2" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}
