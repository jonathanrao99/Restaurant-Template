'use client';

import React, { useEffect } from 'react';
import Analytics from '@/components/Analytics';
import { CartProvider } from '@/context/CartContext';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { HeroUIProvider } from '@heroui/react';
import { Toaster } from '@/components/ui/sonner';
import NavbarWrapper from '@/components/NavbarWrapper';
import FooterWrapper from '@/components/FooterWrapper';
import PageTransitionWrapper from '@/components/PageTransitionWrapper';
import { NextIntlClientProvider } from 'next-intl';

export default function LayoutClientWrapper({ children, messages }: { children: React.ReactNode, messages: any }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }
  }, []);
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <Analytics />
      <CartProvider>
        <ReactQueryProvider>
          <HeroUIProvider>
            <Toaster />
            <NavbarWrapper />
            <PageTransitionWrapper>
              {children}
            </PageTransitionWrapper>
            <FooterWrapper />
          </HeroUIProvider>
        </ReactQueryProvider>
      </CartProvider>
    </NextIntlClientProvider>
  );
} 