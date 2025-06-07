import { ReactNode } from 'react';
// Server-side layout for admin pages

export const metadata = {
  title: 'Admin Dashboard',
};

export default function NimdaLayout({ children }: { children: ReactNode }) {
  // No wrapper here; individual pages and nested layouts manage their own backgrounds and headers
  return <>{children}</>;
} 