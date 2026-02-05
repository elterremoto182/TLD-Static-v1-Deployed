'use client';

import { useEffect } from 'react';
import { sendPageView, trackGenerateLead } from '@/lib/analytics';

const THANK_YOU_PATH = '/contact/thank-you/';

/**
 * Sends a GA4 page_view for the thank-you page (so it appears in reports after
 * client-side redirect) and the recommended "generate_lead" event for conversion tracking.
 * Renders nothing.
 */
export function ThankYouAnalytics() {
  useEffect(() => {
    sendPageView(THANK_YOU_PATH);
    trackGenerateLead();
  }, []);

  return null;
}
