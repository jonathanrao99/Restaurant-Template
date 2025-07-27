import { Suspense } from 'react';
import MenuHeader from '@/components/menu/MenuHeader';
import MenuNotes from '@/components/menu/MenuNotes';
import MenuClient from './MenuClient';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader />
      <Suspense fallback={<div>Loading menu...</div>}>
        <MenuClient />
      </Suspense>
      <MenuNotes />
    </div>
  );
} 
