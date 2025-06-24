'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function Analytics() {
  const pathname = usePathname();
  // Exclude admin (nimda) pages
  if (pathname.startsWith('/nimda')) {
    return null;
  }
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-M8JXTJWBTH"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}  
          gtag('js', new Date());
          gtag('config', 'G-M8JXTJWBTH');
        `}
      </Script>

      {/* Umami Analytics */}
      <Script
        src="https://cloud.umami.is/script.js"
        defer
        data-website-id="0ab19376-7ad8-48fc-8f59-c69951883021"
        strategy="afterInteractive"
      />
    </>
  );
} 