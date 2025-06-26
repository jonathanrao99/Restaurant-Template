'use client';

import { ReactNode, useState, useEffect } from 'react';
import LayoutClientWrapper from './LayoutClientWrapper';

interface ClientOnlyProps {
  children: ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <LayoutClientWrapper>
      {children}
    </LayoutClientWrapper>
  );
} 