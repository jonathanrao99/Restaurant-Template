import { logAnalyticsEvent } from '@/utils/loyaltyAndAnalytics';

const handleViewPoints = (customerId) => {
  logAnalyticsEvent('loyalty_points_viewed', { customerId });
  if (typeof window !== 'undefined') {
    window.gtag && window.gtag('event', 'loyalty_points_viewed', { customerId });
    window.umami && window.umami('loyalty_points_viewed', { customerId });
  }
  // ...existing logic...
};

const handleRedeemPoints = (customerId, points) => {
  logAnalyticsEvent('loyalty_points_redeemed', { customerId, points });
  if (typeof window !== 'undefined') {
    window.gtag && window.gtag('event', 'loyalty_points_redeemed', { customerId, points });
    window.umami && window.umami('loyalty_points_redeemed', { customerId, points });
  }
  // ...existing logic...
}; 