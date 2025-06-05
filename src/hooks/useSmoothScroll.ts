import { useCallback } from 'react';

interface ScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
  duration?: number;
}

/**
 * A hook that provides smooth scrolling functionality
 * @returns An object with scroll functions
 */
export const useSmoothScroll = () => {
  /**
   * Smoothly scroll to a specific element
   * @param elementRef Reference to the element to scroll to
   * @param options Scroll options
   */
  const scrollToElement = useCallback((
    elementRef: React.RefObject<HTMLElement>,
    options: ScrollOptions = {}
  ) => {
    const {
      behavior = 'smooth',
      block = 'start',
      inline = 'nearest',
      duration = 500
    } = options;

    if (elementRef.current) {
      // Use native smooth scrolling if available
      if (behavior === 'smooth' && 'scrollBehavior' in document.documentElement.style) {
        elementRef.current.scrollIntoView({ behavior, block, inline });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        const startPosition = window.pageYOffset;
        const targetPosition = elementRef.current.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        let startTime: number | null = null;

        function animation(currentTime: number) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Easing function for smoother animation
          const easeInOutCubic = (t: number) => 
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          
          window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          }
        }

        requestAnimationFrame(animation);
      }
    }
  }, []);

  /**
   * Smoothly scroll to the top of the page
   * @param options Scroll options
   */
  const scrollToTop = useCallback((
    options: ScrollOptions = {}
  ) => {
    const {
      behavior = 'smooth',
      duration = 500
    } = options;

    // Use native smooth scrolling if available
    if (behavior === 'smooth' && 'scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior });
    } else {
      // Fallback for browsers that don't support smooth scrolling
      const startPosition = window.pageYOffset;
      const distance = -startPosition;
      let startTime: number | null = null;

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smoother animation
        const easeInOutCubic = (t: number) => 
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  }, []);

  return {
    scrollToElement,
    scrollToTop
  };
}; 