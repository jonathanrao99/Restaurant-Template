import { ReactNode } from 'react';
import NimdaClientLayout from './NimdaClientLayout.client';

export const metadata = {
  title: 'Admin Dashboard',
};

export default function NimdaLayout({ children }: { children: ReactNode }) {
  // Server-side layout that wraps client component
  return <NimdaClientLayout>{children}</NimdaClientLayout>;
} 
