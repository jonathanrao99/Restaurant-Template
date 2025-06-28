'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export interface AddressAutocompleteProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onAddressSelect: (address: string) => void;
  onBlur?: () => void;
}

export const AddressAutocomplete = ({
  value = '',
  onValueChange,
  onAddressSelect,
  onBlur,
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
<<<<<<< HEAD
      !window.google?.maps?.places
    ) {
      console.error('Google Places API is not available.');
      return;
    }

    if (!inputRef.current) return;

    // Initialize the Autocomplete service on our input
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ['address'], componentRestrictions: { country: 'us' } }
    );

    autocomplete.setFields(['formatted_address']);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
=======
      !window.google?.maps?.places?.PlaceAutocompleteElement
    ) {
      console.error('Google Places Migration API is not available.');
      return;
    }
    if (!inputRef.current) return;

    // Initialize the PlaceAutocompleteElement
    const widget = new window.google.maps.places.PlaceAutocompleteElement({
      input: inputRef.current,
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address'],
    });
    // Listen for place selection
    const listener = widget.addListener('place_changed', () => {
      const place = widget.getPlace();
>>>>>>> 2781fe3 (update)
      if (place.formatted_address) {
        onValueChange?.(place.formatted_address);
        onAddressSelect(place.formatted_address);
      }
    });
<<<<<<< HEAD

    autocompleteRef.current = autocomplete;
=======
    // Cleanup on unmount
    return () => {
      listener.remove();
      window.google.maps.event.clearInstanceListeners(widget);
    };
>>>>>>> 2781fe3 (update)
  }, [onValueChange, onAddressSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      autoComplete="off"
      value={value}
      onChange={e => onValueChange?.(e.target.value)}
      onBlur={onBlur}
      placeholder="Start typing your delivery address..."
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-desi-orange focus:ring-desi-orange sm:text-sm"
    />
  );
}; 