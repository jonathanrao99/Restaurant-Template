export default function Head() {
  return (
    <>
      {/* PWA manifest for Google Pay requirements */}
      <link rel="manifest" href="/manifest.json?v=2" />
      <title>Desi Flavors Katy | Authentic Indian Street Food</title>
      <meta name="description" content="Desi Flavors Katy - Authentic Indian street food served daily from our food truck in Katy, TX. Order online or find us at our next location!" />
      <meta property="og:title" content="Desi Flavors Katy | Authentic Indian Street Food" />
      <meta property="og:description" content="Desi Flavors Katy - Authentic Indian street food served daily from our food truck in Katy, TX. Order online or find us at our next location!" />
      <meta property="og:url" content="https://www.desiflavorskaty.com" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.desiflavorskaty.com/Truck/truck-4.jpg" />
      <meta property="og:image" content="https://www.desiflavorskaty.com/Truck/truck-3.jpg" />
      <meta property="og:image" content="https://www.desiflavorskaty.com/Truck/IMG-20250603-WA0005.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Desi Flavors Katy | Authentic Indian Street Food" />
      <meta name="twitter:description" content="Desi Flavors Katy - Authentic Indian street food served daily from our food truck in Katy, TX. Order online or find us at our next location!" />
      <meta name="twitter:image" content="https://www.desiflavorskaty.com/Truck/truck-4.jpg" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Desi Flavors Katy",
        "image": [
          "https://www.desiflavorskaty.com/Truck/truck-4.jpg",
          "https://www.desiflavorskaty.com/Truck/truck-3.jpg",
          "https://www.desiflavorskaty.com/Truck/IMG-20250603-WA0005.jpg"
        ],
        "url": "https://www.desiflavorskaty.com",
        "telephone": "+1-346-824-4212",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1989 North Fry Rd",
          "addressLocality": "Katy",
          "addressRegion": "TX",
          "postalCode": "77494",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 29.794896,
          "longitude": -95.719412
        },
        "openingHours": ["Mo-Su 17:00-01:00"]
      }` }} />
    </>
  );
} 
