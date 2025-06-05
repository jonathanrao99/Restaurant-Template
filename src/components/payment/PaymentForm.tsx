import { useState } from 'react';
import { 
  CreditCard, 
  Calendar,
  CreditCardIcon,
  User
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentFormProps {
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  billingZip: string;
  setBillingZip: (value: string) => void;
  customerName: string;
  setCustomerName: (value: string) => void;
  customerEmail: string;
  setCustomerEmail: (value: string) => void;
  customerPhone: string;
  setCustomerPhone: (value: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (value: string) => void;
  deliveryMethod: string;
  isProcessing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  billingZip,
  setBillingZip,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  deliveryAddress,
  setDeliveryAddress,
  deliveryMethod,
  isProcessing,
  handleSubmit
}) => {

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return v;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const formatPhoneNumber = (value: string) => {
    const v = value.replace(/\D/g, '');

    if (v.length <= 3) {
      return v;
    } else if (v.length <= 6) {
      return `(${v.slice(0, 3)}) ${v.slice(3)}`;
    } else {
      return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setCustomerPhone(formatted);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
      <h1 className="text-2xl font-display font-bold mb-6">Payment Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <h2 className="font-medium text-lg">Customer Information</h2>
          <div className="space-y-4 mb-6">
            <div className="space-y-2 sm:space-y-2">
              <Label htmlFor="customerName">Full Name</Label>
              <Input id="customerName" placeholder="John Smith" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" />
            </div>
            <div className="space-y-2 sm:space-y-2">
              <Label htmlFor="customerEmail">Email Address</Label>
              <Input id="customerEmail" type="email" placeholder="john@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required className="rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" />
            </div>
            <div className="space-y-2 sm:space-y-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input id="customerPhone" placeholder="(123) 456-7890" value={customerPhone} onChange={handlePhoneChange} required className="rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" />
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="space-y-2 sm:space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Input id="deliveryAddress" placeholder="123 Main St, City, State, ZIP" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required className="rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" />
              </div>
            )}
          </div>

          <div className="space-y-2 sm:space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <div className="relative">
              <Input id="cardName" placeholder="John Smith" value={cardName} onChange={(e) => setCardName(e.target.value)} className="pl-10 rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" required />
              <User size={16} className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input id="cardNumber" placeholder="4242 4242 4242 4242" value={cardNumber} onChange={handleCardNumberChange} maxLength={19} className="pl-10 rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" required />
              <CreditCardIcon size={16} className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 sm:space-y-2 col-span-1">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <div className="relative">
                <Input id="expiryDate" placeholder="MM/YY" value={expiryDate} onChange={handleExpiryDateChange} maxLength={5} className="pl-10 rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" required />
                <Calendar size={16} className="absolute left-3 top-3 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-2 col-span-1">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} maxLength={4} type="password" className="rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" required />
            </div>

            <div className="space-y-2 sm:space-y-2 col-span-1">
              <Label htmlFor="billingZip">Billing Zip</Label>
              <Input id="billingZip" placeholder="12345" value={billingZip} onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, ''))} maxLength={5} className="rounded-full border-gray-300 shadow-sm transition-all focus:ring-2 focus:ring-desi-orange focus:outline-none" required />
            </div>
          </div>

          <div className="flex items-center pt-4">
            <CreditCard size={16} className="text-gray-500 mr-2" />
            <p className="text-sm text-gray-500">Your payment information is secure and encrypted</p>
          </div>

          <Button type="submit" disabled={isProcessing} className="w-full bg-desi-orange hover:bg-desi-orange/90 text-white py-6 text-lg rounded-full transition-all shadow-md">
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Checkout'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
