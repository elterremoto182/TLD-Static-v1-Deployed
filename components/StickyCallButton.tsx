'use client';

import { Phone } from 'lucide-react';
import siteConfig from '@/config/site.json';

export function StickyCallButton() {
  return (
    <a
      href={`tel:${siteConfig.phone}`}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FF6200] px-4 py-4 text-center font-semibold shadow-lg hover:bg-[#E55A00] transition-colors duration-200 flex items-center justify-center space-x-2"
    >
      <Phone className="w-5 h-5 !text-white" />
      <span className="!text-white">Call Now – Same-Day Service</span>
    </a>
  );
}

