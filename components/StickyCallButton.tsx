'use client';

import { Phone } from 'lucide-react';
import siteConfig from '@/config/site.json';

export function StickyCallButton() {
  return (
    <a
      href={`tel:${siteConfig.phone}`}
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-accent px-4 py-4 text-center font-semibold shadow-lg hover:bg-accent/90 transition-colors duration-200 flex items-center justify-center space-x-2"
      aria-label="Call Now - Same-Day Service"
    >
      <Phone className="w-5 h-5 !text-white" />
      <span className="!text-white">Call Now – Same-Day Service</span>
    </a>
  );
}

