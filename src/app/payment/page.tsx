/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { submitOrder } from '@/services/orderService';
import PaymentForm from '@/components/payment/PaymentForm';
import OrderSummary from '@/components/payment/OrderSummary';
import PaymentSuccessPage from '@/components/payment/PaymentSuccessPage';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import Script from 'next/script';

const Payment = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [card, setCard] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [deliveryMethod] = useState(localStorage.getItem('deliveryMethod') || 'pickup');
  const [selectedMethod, setSelectedMethod] = useState<'card'|'applePay'|'googlePay'|'cashApp'>('card');
  
  // Form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingZip, setBillingZip] = useState('');
  
  // Customer info state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Initialize Square card
  useEffect(() => {
    const initSquare = async () => {
      if (typeof window === 'undefined') return;
      try {
        await loadSquare();
        const payments = (window as any).Square.payments(process.env.NEXT_PUBLIC_SQUARE_APP_ID!, process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!);
        const card = await payments.card();
        await card.attach('#card-container');
        setCard(card);
      } catch (e) {
        console.error('Square initialize error', e);
      }
    };
    initSquare();
  }, []);

  // Helper to load Square SDK
  const loadSquare = () => {
    return new Promise<void>((resolve) => {
      if (document.getElementById('square-js')) {
        return resolve();
      }
      const script = document.createElement('script');
      script.id = 'square-js';
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  };

  // Calculate order totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.0825; // 8.25% tax rate
  const deliveryFee = deliveryMethod === 'delivery' ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Redirect if cart is empty
    if (cartItems.length === 0 && !paymentSuccess) {
      router.push('/cart');
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to payment",
        variant: "destructive",
      });
    }
  }, [cartItems.length, router, paymentSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate customer info
    if (!customerName || !customerEmail || !customerPhone) {
      toast({
        title: "Missing information",
        description: "Please fill in all customer information",
        variant: "destructive",
      });
      return;
    }
    
    // Validate delivery address for delivery orders
    if (deliveryMethod === 'delivery' && !deliveryAddress) {
      toast({
        title: "Missing address",
        description: "Please provide your delivery address",
        variant: "destructive",
      });
      return;
    }
    
    // Process payment via Square
    setIsProcessing(true);
    try {
      if (!card) {
        toast({ title: 'Payment not ready', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      const tokenResult = await card.tokenize();
      if (tokenResult.status !== 'OK') {
        const msg = tokenResult.errors?.[0]?.message || 'Tokenization failed';
        toast({ title: 'Payment error', description: msg, variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      const sourceId = tokenResult.token;
      const idempotencyKey = crypto.randomUUID();
      // Create payment via backend
      const paymentRes = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, amount: total, idempotencyKey }),
      });
      const paymentJson = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentJson.error || 'Payment failed');
      }
      const paymentId = paymentJson.id || paymentJson.payment?.id;
      // Build order data
      const orderData = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone.replace(/\D/g, ''),
        items: cartItems,
        total_amount: total,
        delivery_address: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        special_instructions: cartItems.some(item => item.specialInstructions) 
          ? cartItems.map(item => item.specialInstructions && `${item.name}: ${item.specialInstructions}`).filter(Boolean).join('; ')
          : undefined,
        order_type: deliveryMethod as 'pickup' | 'delivery',
        payment_id: paymentId,
      };
      const submitResult = await submitOrder(orderData);
      if (!submitResult.success) throw new Error('Failed to save order');
      // Clear cart and show success
      clearCart();
      setPaymentSuccess(true);
      localStorage.removeItem('deliveryMethod');
      setTimeout(() => {
        router.push('/');
        toast({ title: 'Order placed successfully!', description: 'Thank you for your order. Your food will be ready soon!' });
      }, 3000);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({ title: 'Payment failed', description: error.message || 'Please try again.', variant: 'destructive' });
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-gray-50">
        <PaymentSuccessPage deliveryMethod={deliveryMethod} />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-gray-50">
      {/* Load Square Web Payments SDK */}
      <Script src="https://sandbox.web.squarecdn.com/v1/square.js" strategy="beforeInteractive" />
      <div className="container mx-auto px-4 md:px-6 pt-4">
        <button 
          onClick={() => router.push('/cart')}
          className="flex items-center font-semibold text-desi-orange hover:text-black transition-colors mb-8 text-base"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Cart</span>
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selector */}
            <PaymentMethodSelector value={selectedMethod} onChange={setSelectedMethod} />

            {/* Payment Section */}
            {selectedMethod === 'card' && (
            <PaymentForm 
              cardName={cardName}
              setCardName={setCardName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              cvv={cvv}
              setCvv={setCvv}
              billingZip={billingZip}
              setBillingZip={setBillingZip}
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              deliveryMethod={deliveryMethod}
              isProcessing={isProcessing}
              handleSubmit={handleSubmit}
            />
            )}
            {selectedMethod === 'applePay' && (
              <button onClick={() => { /* handle Apple Pay */ }} className="w-full bg-black text-white py-3 rounded-xl">Pay with Apple Pay</button>
            )}
            {selectedMethod === 'googlePay' && (
              <button onClick={() => { /* handle Google Pay */ }} className="w-full bg-red-600 text-white py-3 rounded-xl">Pay with Google Pay</button>
            )}
            {selectedMethod === 'cashApp' && (
              <button onClick={() => { /* handle Cash App Pay */ }} className="w-full bg-green-500 text-white py-3 rounded-xl">Pay with Cash App Pay</button>
            )}

            <div className="mt-4 text-center text-gray-600 text-sm">
              Place an order to create your customer profile and start earning loyalty points!
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              tax={tax}
              deliveryFee={deliveryFee}
              total={total}
              deliveryMethod={deliveryMethod}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Payment;
