'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export interface AddressAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onAddressSelect: (address: string) => void;
  onBlur?: () => void | Promise<void>;
  onKeyPress?: (e: React.KeyboardEvent) => void | Promise<void>;
  onClick?: () => void | Promise<void>;
  onFocus?: () => void | Promise<void>;
}

export const AddressAutocomplete = ({
  value = '',
  onValueChange,
  onAddressSelect,
  onBlur,
  onKeyPress,
  onClick,
  onFocus,
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (
      !scriptLoaded ||
      typeof window === 'undefined' ||
      !window.google?.maps?.places?.Autocomplete
    ) {
      return;
    }
    if (!inputRef.current) return;

    console.log('Setting up Google Places Autocomplete...');
    
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    });
    autocomplete.setFields(['formatted_address', 'address_components']);
    
    const listener = autocomplete.addListener('place_changed', () => {
      console.log('Google Places place_changed event triggered');
      
      // Prevent multiple rapid calls
      if (isProcessing) {
        console.log('Already processing place selection, skipping...');
        return;
      }
      
      setIsProcessing(true);
      
      const place = autocomplete.getPlace();
      console.log('Google Places API response:', place);
      
      if (place.formatted_address) {
        console.log('Selected address:', place.formatted_address);
        
        // Immediately update the input value
        onValueChange?.(place.formatted_address);
        
        // Trigger the address selection with a small delay to ensure UI updates
        setTimeout(() => {
          onAddressSelect(place.formatted_address);
          setIsProcessing(false);
        }, 100);
      } else {
        console.warn('No formatted_address in place:', place);
        setIsProcessing(false);
      }
    });
    
    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [scriptLoaded, onValueChange, onAddressSelect, isProcessing]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        value={value}
        onChange={e => onValueChange?.(e.target.value)}
        onBlur={() => onBlur?.()}
        onKeyPress={(e) => onKeyPress?.(e)}
        onClick={() => onClick?.()}
        onFocus={() => onFocus?.()}
        placeholder="Start typing your delivery address or select from suggestions..."
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-desi-orange focus:ring-desi-orange sm:text-sm"
      />
    </>
  );
}; 