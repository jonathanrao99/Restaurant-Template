import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEST_URL = 'http://localhost:3000';
const RESULTS_DIR = path.join(__dirname, '../performance-results');

// Create results directory if it doesn't exist
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

async function runPerformanceTest() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🚀 Starting performance test...');
    
    // Navigate to the page
    const startTime = Date.now();
    await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Navigation timing
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
        
        // Paint timing
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // Resource count
        resourceCount: performance.getEntriesByType('resource').length,
        
        // Memory usage (if available)
        memory: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        } : null
      };
    });
    
    // Get Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime;
            } else if (entry.entryType === 'first-input') {
              vitals.FID = entry.processingStart - entry.startTime;
            } else if (entry.entryType === 'layout-shift') {
              vitals.CLS = entry.value;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    // Get resource sizes
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(resource => ({
        name: resource.name,
        size: resource.transferSize || 0,
        duration: resource.duration,
        type: resource.initiatorType
      }));
    });
    
    // Calculate total resource size
    const totalResourceSize = resources.reduce((sum, resource) => sum + resource.size, 0);
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      url: TEST_URL,
      loadTime,
      metrics,
      webVitals,
      resources: {
        total: resources.length,
        totalSize: totalResourceSize,
        byType: resources.reduce((acc, resource) => {
          acc[resource.type] = (acc[resource.type] || 0) + resource.size;
          return acc;
        }, {})
      },
      recommendations: []
    };
    
    // Add recommendations based on metrics
    if (metrics.totalLoadTime > 3000) {
      report.recommendations.push('Consider optimizing initial page load time');
    }
    
    if (totalResourceSize > 1024 * 1024) {
      report.recommendations.push('Total resource size is over 1MB, consider optimization');
    }
    
    if (webVitals.LCP > 2500) {
      report.recommendations.push('Largest Contentful Paint is slow, optimize images and critical resources');
    }
    
    if (webVitals.FID > 100) {
      report.recommendations.push('First Input Delay is high, reduce JavaScript execution time');
    }
    
    // Save report
    const reportPath = path.join(RESULTS_DIR, `performance-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Print summary
    console.log('\n📊 Performance Test Results:');
    console.log('=============================');
    console.log(`Total Load Time: ${metrics.totalLoadTime}ms`);
    console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`First Paint: ${metrics.firstPaint}ms`);
    console.log(`First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`Largest Contentful Paint: ${webVitals.LCP || 'N/A'}ms`);
    console.log(`First Input Delay: ${webVitals.FID || 'N/A'}ms`);
    console.log(`Cumulative Layout Shift: ${webVitals.CLS || 'N/A'}`);
    console.log(`Total Resources: ${resources.length}`);
    console.log(`Total Resource Size: ${(totalResourceSize / 1024).toFixed(2)}KB`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`- ${rec}`));
    }
    
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
runPerformanceTest(); 