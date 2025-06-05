import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Apple, Globe, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentMethodSelectorProps {
  value: 'card' | 'applePay' | 'googlePay' | 'cashApp';
  onChange: (method: 'card' | 'applePay' | 'googlePay' | 'cashApp') => void;
}

const options = [
  { value: 'card', label: 'Card', icon: <CreditCard size={20} /> },
  { value: 'applePay', label: 'Apple Pay', icon: <Apple size={20} /> },
  { value: 'googlePay', label: 'Google Pay', icon: <Globe size={20} /> },
  { value: 'cashApp', label: 'Cash App', icon: <DollarSign size={20} /> },
];

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {options.map(opt => (
        <Button
          key={opt.value}
          variant={value === opt.value ? 'default' : 'outline'}
          size='lg'
          onClick={() => onChange(opt.value as any)}
          className="w-full flex items-center justify-center gap-2 rounded-xl shadow-sm py-4 px-2 transition-all duration-150"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="text-lg flex items-center justify-center">{opt.icon}</span>
            <span className="text-base font-medium">{opt.label}</span>
          </span>
        </Button>
      ))}
    </div>
  );
} 