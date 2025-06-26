'use client';

import React, { useEffect, useRef } from 'react';

export interface AddressAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onAddressSelect: (address: string) => void;
  onBlur?: () => void;
}

export const AddressAutocomplete = ({ value, onValueChange, onAddressSelect, onBlur }: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    if (!inputRef.current) return;

    // Remove any previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
      widgetRef.current = null;
    }

    // Create the PlaceAutocompleteElement widget
    const autocomplete = new window.google.maps.places.PlaceAutocompleteElement();
    autocomplete.input = inputRef.current;
    widgetRef.current = autocomplete;

    autocomplete.addEventListener('gmp-placeautocomplete-placechange', (event: any) => {
      const place = event.detail;
      if (place && place.formattedAddress) {
        if (onValueChange) onValueChange(place.formattedAddress);
        onAddressSelect(place.formattedAddress);
      }
    });

    // Attach widget to DOM
    inputRef.current.parentNode?.appendChild(autocomplete);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [onAddressSelect, onValueChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      autoComplete="off"
      value={value || ''}
      onChange={e => onValueChange && onValueChange(e.target.value)}
      onBlur={onBlur}
      placeholder="Start typing your delivery address..."
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-desi-orange focus:ring-desi-orange sm:text-sm"
    />
  );
}; 