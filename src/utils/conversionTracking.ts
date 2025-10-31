'use client';

/**
 * Comprehensive Conversion Tracking Utilities
 * Tracks user interactions and sends data to Google Analytics and other platforms
 */

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('config', 'G-XXXXXXXXXX', {
        page_path: url,
      });
    }
    
    // Umami
    if ((window as any).umami) {
      (window as any).umami('pageview', { url });
    }
    
    console.log('📄 Page View:', url);
  }
};

// Track conversions
export const trackConversion = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined') {
    const eventData = {
      event_category: category,
      event_label: label,
      value: value,
    };

    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', action, eventData);
    }

    // Umami
    if ((window as any).umami) {
      (window as any).umami(action, eventData);
    }

    console.log('🎯 Conversion:', { action, category, label, value });
  }
};

// Track specific conversions
export const conversionEvents = {
  // Order-related
  squareOrderClick: () => {
    trackConversion('square_order_click', 'Order', 'Square Online Menu', 1);
  },

  doorDashClick: () => {
    trackConversion('doordash_click', 'Order', 'DoorDash', 1);
  },

  grubhubClick: () => {
    trackConversion('grubhub_click', 'Order', 'Grubhub', 1);
  },

  uberEatsClick: () => {
    trackConversion('ubereats_click', 'Order', 'Uber Eats', 1);
  },

  // Menu interactions
  menuItemView: (itemName: string, category: string, price: string) => {
    trackConversion('menu_item_view', 'Menu', `${itemName} (${category})`, parseFloat(price));
  },

  menuCategoryClick: (category: string) => {
    trackConversion('menu_category_click', 'Menu', category, 1);
  },

  // Contact conversions
  phoneClick: () => {
    trackConversion('phone_click', 'Contact', 'Phone Call', 1);
  },

  emailClick: () => {
    trackConversion('email_click', 'Contact', 'Email', 1);
  },

  directionsClick: () => {
    trackConversion('directions_click', 'Contact', 'Get Directions', 1);
  },

  formSubmit: (formType: string) => {
    trackConversion('form_submit', 'Contact', formType, 1);
  },

  // Catering conversions
  cateringQuoteClick: () => {
    trackConversion('catering_quote_click', 'Catering', 'Get Quote Button', 1);
  },

  // Social media
  facebookClick: () => {
    trackConversion('social_click', 'Social Media', 'Facebook', 1);
  },

  instagramClick: () => {
    trackConversion('social_click', 'Social Media', 'Instagram', 1);
  },

  twitterClick: () => {
    trackConversion('social_click', 'Social Media', 'Twitter', 1);
  },

  tiktokClick: () => {
    trackConversion('social_click', 'Social Media', 'TikTok', 1);
  },

  youtubeClick: () => {
    trackConversion('social_click', 'Social Media', 'YouTube', 1);
  },

  // Newsletter
  newsletterSubmit: (email: string) => {
    trackConversion('newsletter_subscribe', 'Newsletter', 'Email Subscription', 1);
  },

  // Engagement
  scrollDepth: (percentage: number) => {
    trackConversion('scroll_depth', 'Engagement', `${percentage}%`, percentage);
  },

  videoPlay: (videoName: string) => {
    trackConversion('video_play', 'Engagement', videoName, 1);
  },

  // Navigation
  navigationClick: (destination: string) => {
    trackConversion('navigation_click', 'Navigation', destination, 1);
  },

  backToTop: () => {
    trackConversion('back_to_top_click', 'Navigation', 'Back to Top Button', 1);
  },
};

// Track scroll depth (call this once per page)
export const initScrollTracking = () => {
  if (typeof window === 'undefined') return;

  const scrollMilestones = [25, 50, 75, 100];
  const reached: { [key: number]: boolean } = {};

  const handleScroll = () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );

    scrollMilestones.forEach((milestone) => {
      if (scrollPercent >= milestone && !reached[milestone]) {
        reached[milestone] = true;
        conversionEvents.scrollDepth(milestone);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => window.removeEventListener('scroll', handleScroll);
};

// Track time on page
export const initTimeTracking = () => {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();

  const trackTime = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackConversion('time_on_page', 'Engagement', window.location.pathname, timeSpent);
  };

  // Track when user leaves
  window.addEventListener('beforeunload', trackTime);

  return () => window.removeEventListener('beforeunload', trackTime);
};

// Enhanced click tracking (automatically track all external links)
export const initAutomaticTracking = () => {
  if (typeof window === 'undefined') return;

  // Track all external links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.href) {
      const url = new URL(link.href);
      const isExternal = url.hostname !== window.location.hostname;

      if (isExternal) {
        trackConversion(
          'external_link_click',
          'Outbound',
          link.href,
          1
        );
      }
    }
  }, true);

  // Track button clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');

    if (button) {
      const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || 'Unknown Button';
      trackConversion('button_click', 'Interaction', buttonText, 1);
    }
  }, true);
};

