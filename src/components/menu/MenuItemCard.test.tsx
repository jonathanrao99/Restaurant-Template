// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import MenuItemCard from './MenuItemCard';
import { describe, expect, test, vi } from 'vitest';

describe('MenuItemCard', () => {
  const item = {
    id: 1,
    name: 'Chicken Biryani',
    description: 'Delicious biryani',
    price: '12.99',
    isvegetarian: false,
    isspicy: true,
    category: 'Biryani',
    sold_out: false,
    isSoldOut: false,
  };

  test('renders menu item and Add to Cart button', () => {
    const handleAddToCart = vi.fn();
    render(<MenuItemCard item={item} handleAddToCart={handleAddToCart} />);
    expect(screen.getByText('Chicken Biryani')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  test('calls handleAddToCart when Add to Cart is clicked', () => {
    const handleAddToCart = vi.fn();
    render(<MenuItemCard item={item} handleAddToCart={handleAddToCart} />);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(handleAddToCart).toHaveBeenCalled();
  });

  test('has no accessibility violations', async () => {
    const handleAddToCart = vi.fn();
    const { container } = render(<MenuItemCard item={item} handleAddToCart={handleAddToCart} />);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
}); 