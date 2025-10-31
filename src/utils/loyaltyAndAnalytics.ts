// Analytics and loyalty functions - now using console logging
// Since Supabase has been removed, these functions just log to console

export async function logAnalyticsEvent(event_name: string, event_data: any) {
  try {
    console.log('Analytics Event:', event_name, event_data);
    // You can integrate with Google Analytics or other analytics services here
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event_name, event_data);
    }
  } catch (e) {
    console.error('Analytics event logging failed:', e);
  }
}

export async function awardLoyaltyPoints(orderId: number, customerId: number, totalAmount: number) {
  try {
    const points = Math.floor(totalAmount);
    console.log('Loyalty Points Awarded:', { customer_id: customerId, order_id: orderId, points });
    await logAnalyticsEvent('loyalty_points_earned', { customer_id: customerId, order_id: orderId, points });
  } catch (e) {
    console.error('Loyalty points award failed:', e);
  }
}

export async function redeemLoyaltyPointsIfEligible(orderId: number, customerId: number) {
  try {
    console.log('Loyalty Points Redemption Attempted:', { customer_id: customerId, order_id: orderId });
    // Loyalty tracking is now handled through Square
  } catch (e) {
    console.error('Loyalty points redemption failed:', e);
  }
}
