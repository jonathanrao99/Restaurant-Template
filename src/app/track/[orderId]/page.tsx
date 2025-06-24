'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Clock, Truck, ChefHat, Package } from 'lucide-react';

interface Order {
  id: number;
  status: string;
  customer_name: string;
  items: any[];
  total_amount: number;
  created_at: string;
  scheduled_time?: string;
  external_delivery_id?: string;
  delivery_address?: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Received', icon: Package, description: 'Your order has been received and is being processed' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Order confirmed and sent to kitchen' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Your delicious food is being prepared' },
  { key: 'ready', label: 'Ready', icon: Clock, description: 'Order is ready for pickup/delivery' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, description: 'Driver is on the way to you' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Order has been delivered successfully' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, description: 'Order completed' }
];

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchOrder, 30000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      const orderData = await response.json();
      setOrder(orderData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const getEstimatedTime = () => {
    if (!order) return null;
    
    if (order.scheduled_time) {
      return new Date(order.scheduled_time).toLocaleString();
    }
    
    // Estimate based on current status
    const orderTime = new Date(order.created_at);
    switch (order.status) {
      case 'pending':
        return new Date(orderTime.getTime() + 10 * 60000).toLocaleTimeString(); // +10 min
      case 'confirmed':
        return new Date(orderTime.getTime() + 25 * 60000).toLocaleTimeString(); // +25 min
      case 'preparing':
        return new Date(orderTime.getTime() + 35 * 60000).toLocaleTimeString(); // +35 min
      case 'ready':
        return 'Ready now!';
      case 'out_for_delivery':
        return new Date(orderTime.getTime() + 50 * 60000).toLocaleTimeString(); // +50 min
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-desi-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = getCurrentStepIndex();
  const estimatedTime = getEstimatedTime();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Order #{order.id}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
              {estimatedTime && (
                <p className="text-desi-orange font-medium mt-1">
                  Estimated ready time: {estimatedTime}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-desi-orange">
                ${order.total_amount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Status</h2>
          
          <div className="relative">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const IconComponent = step.icon;
              
              return (
                <div key={step.key} className="flex items-center mb-8 last:mb-0">
                  <div className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 
                      ${isCompleted 
                        ? 'bg-desi-orange border-desi-orange text-white' 
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                      }
                      ${isCurrent ? 'ring-4 ring-desi-orange ring-opacity-20' : ''}
                    `}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    {index < statusSteps.length - 1 && (
                      <div className={`
                        w-0.5 h-16 ml-6 -mb-8
                        ${index < currentStepIndex ? 'bg-desi-orange' : 'bg-gray-300'}
                      `} />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className={`
                      font-medium 
                      ${isCompleted ? 'text-gray-800' : 'text-gray-500'}
                    `}>
                      {step.label}
                    </div>
                    <div className={`
                      text-sm mt-1
                      ${isCompleted ? 'text-gray-600' : 'text-gray-400'}
                    `}>
                      {step.description}
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-desi-orange font-medium mt-1">
                        Current Status
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.name}</div>
                  {item.special_instructions && (
                    <div className="text-sm text-gray-600 mt-1">
                      Note: {item.special_instructions}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Qty: {item.quantity}</span>
                  <span className="font-medium text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        {order.delivery_address && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
            <div className="flex items-start space-x-3">
              <Truck className="w-5 h-5 text-desi-orange mt-1" />
              <div>
                <div className="font-medium text-gray-800">Delivery Address</div>
                <div className="text-gray-600 mt-1">{order.delivery_address}</div>
                {order.external_delivery_id && (
                  <div className="text-sm text-gray-500 mt-2">
                    DoorDash Delivery ID: {order.external_delivery_id}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="text-center mt-8 text-gray-600">
          <p>Need help with your order?</p>
          <p className="font-medium text-desi-orange">Call us at (281) 123-4567</p>
        </div>
      </div>
    </div>
  );
} 