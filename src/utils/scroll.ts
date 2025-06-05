/**
 * Scroll utilities for smooth scrolling throughout the application
 */

/**
 * Smoothly scroll to an element
 * @param elementId The ID of the element to scroll to
 * @param options Scroll options
 */
export const scrollToElementById = (
  elementId: string,
  options: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
    duration?: number;
  } = {}
) => {
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    duration = 500
  } = options;

  const element = document.getElementById(elementId);
  if (!element) return;

  // Use native smooth scrolling if available
  if (behavior === 'smooth' && 'scrollBehavior' in document.documentElement.style) {
    element.scrollIntoView({ behavior, block, inline });
  } else {
    // Fallback for browsers that don't support smooth scrolling
    const startPosition = window.pageYOffset;
    const targetPosition = element.getBoundingClientRect().top + startPosition;
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
};

/**
 * Smoothly scroll to the top of the page
 * @param options Scroll options
 */
export const scrollToTop = (
  options: {
    behavior?: ScrollBehavior;
    duration?: number;
  } = {}
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
};

/**
 * Check if an element is in the viewport
 * @param element The element to check
 * @param offset Offset from the viewport edges
 * @returns Whether the element is in the viewport
 */
export const isInViewport = (
  element: HTMLElement,
  offset = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  );
};

/**
 * Get the scroll position as a percentage of the total scrollable height
 * @returns The scroll position as a percentage (0-100)
 */
export const getScrollPercentage = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return (scrollTop / scrollHeight) * 100;
}; 