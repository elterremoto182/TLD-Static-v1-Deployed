'use client';

import { useState, useCallback } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import siteConfig from '@/config/site.json';
import { MapPin, ExternalLink } from 'lucide-react';

interface GoogleMapLazyProps {
  /** If true, loads iframe immediately when in viewport. If false (default), requires click. */
  loadOnView?: boolean;
}

export function GoogleMapLazy({ loadOnView = false }: GoogleMapLazyProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Use intersection observer to detect when map placeholder is visible
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading slightly before it's visible
    triggerOnce: true,
  });

  const address = siteConfig.address || '';
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // Load map when either: clicked, or (loadOnView && isIntersecting)
  const shouldLoadMap = isMapLoaded || (loadOnView && isIntersecting);

  const handleLoadMap = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  return (
    <div 
      ref={ref}
      className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-lg relative bg-gray-100"
    >
      {shouldLoadMap ? (
        <>
          {/* Loading state while iframe loads */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-sm text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
          <iframe
            width="100%"
            height="100%"
            style={{ 
              border: 0, 
              minHeight: '400px',
              opacity: iframeLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            title="Total Leak Detection Location"
            onLoad={() => setIframeLoaded(true)}
          />
        </>
      ) : (
        // Facade / placeholder that loads instantly
        <button
          onClick={handleLoadMap}
          className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-50 hover:to-gray-150 transition-all duration-300 cursor-pointer group"
          aria-label="Click to load interactive map"
        >
          {/* Static map preview placeholder */}
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {siteConfig.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 max-w-xs text-center px-4">
            {address}
          </p>
          
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm group-hover:bg-primary/90 transition-colors">
            <MapPin className="w-4 h-4" />
            Click to load map
          </span>
          
          {/* Direct link as alternative */}
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 text-xs text-gray-500 hover:text-primary underline transition-colors"
          >
            Open in Google Maps instead
          </a>
        </button>
      )}
    </div>
  );
}
