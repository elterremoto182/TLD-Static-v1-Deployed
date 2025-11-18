'use client';

import siteConfig from '@/config/site.json';

export function GoogleMap() {
  // Generate Google Maps embed URL from address
  // Using the simple embed format that works without API key restrictions
  const address = siteConfig.address || siteConfig.map?.locations?.[0]?.[1] || '';
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-lg">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title="Total Leak Detection Location"
      />
    </div>
  );
}

