import { deliveryApi } from './supabaseFunctions';

export const calculateDistanceFee = async (customerAddress: string, customerPhone: string, orderDate: Date = new Date()) => {
  try {
    console.log('Calling delivery API with:', { customerAddress, customerPhone });

    // Add timeout to the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 8000); // 8 second timeout
    });

    const apiPromise = deliveryApi.calculateFee(customerAddress, customerPhone);
    const response = await Promise.race([apiPromise, timeoutPromise]);

    console.log('Delivery API response:', response);

    if (!response || typeof response.fee !== 'number') {
      throw new Error('Invalid response from delivery API');
    }

    return response.fee;
  } catch (error) {
    console.error('Delivery fee calculation failed:', error);
    
    // Log more details about the error
    if (error.message.includes('timed out')) {
      console.error('Request timed out - this could be due to ShipDay API being slow or unavailable');
    } else if (error.message.includes('Failed to fetch')) {
      console.error('Network error - check if Supabase Edge Function is accessible');
    } else if (error.message.includes('500')) {
      console.error('Server error - check Edge Function logs');
    }
    
    throw error; // Re-throw the error instead of returning fallback
  }
}; 