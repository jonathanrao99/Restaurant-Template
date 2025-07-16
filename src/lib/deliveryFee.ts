import { deliveryApi } from './supabaseFunctions';

export const calculateDistanceFee = async (customerAddress: string, customerPhone: string, orderDate: Date = new Date()) => {
  try {
    const { fee } = await deliveryApi.calculateFee(customerAddress, customerPhone);
    return fee;
  } catch (error) {
    return 5; // default fee if ShipDay API fails
  }
}; 