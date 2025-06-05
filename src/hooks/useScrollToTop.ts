import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSmoothScroll } from './useSmoothScroll';

export const useScrollToTop = () => {
  const pathname = usePathname();
  const { scrollToTop } = useSmoothScroll();

  useEffect(() => {
    scrollToTop({ behavior: 'smooth', duration: 600 });
  }, [pathname, scrollToTop]);
}; 