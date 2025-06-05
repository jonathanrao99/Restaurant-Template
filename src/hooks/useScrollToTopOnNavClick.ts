import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollToTopOnNavClick() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
} 