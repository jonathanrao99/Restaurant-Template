import PaymentSuccessPage from '@/components/payment/PaymentSuccessPage';
import { useEffect } from 'react';

export default function PaymentSuccessRoute() {
  useEffect(() => {
    logAnalyticsEvent('payment_success', {});
    logAnalyticsEvent('order_placed', {});
    if (typeof window !== 'undefined') {
      window.gtag && window.gtag('event', 'payment_success', {});
      window.gtag && window.gtag('event', 'order_placed', {});
      window.umami && window.umami('payment_success', {});
      window.umami && window.umami('order_placed', {});
    }
  }, []);

  return <PaymentSuccessPage />;
} 