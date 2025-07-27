'use client';

import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log performance metrics
          console.log('Performance Metric:', entry.name, (entry as any).value);
          
          // Send to analytics if available
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'performance_metric', {
              metric_name: entry.name,
              metric_value: (entry as any).value,
              metric_id: (entry as any).id
            });
          }
          
          if (typeof window.umami === 'function') {
            window.umami('performance_metric', {
              metric_name: entry.name,
              metric_value: (entry as any).value
            });
          }
        }
      });

      // Observe different performance metrics
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Log slow resources
            if (resourceEntry.duration > 1000) {
              console.warn('Slow resource loaded:', resourceEntry.name, resourceEntry.duration + 'ms');
            }
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

      // Monitor memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }

      return () => {
        observer.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, []);

  return null;
};

export default PerformanceMonitor; 