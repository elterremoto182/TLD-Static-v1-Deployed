/**
 * Analytics utility functions for Google Analytics (GA4) event tracking
 * 
 * Usage:
 *   import { trackEvent, trackPhoneClick, trackFormSubmission } from '@/lib/analytics';
 *   
 *   // Generic event
 *   trackEvent('button_click', { category: 'CTA', label: 'hero_button' });
 *   
 *   // Phone call tracking
 *   trackPhoneClick('header');
 *   
 *   // Form submission
 *   trackFormSubmission('contact_form');
 */

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
  eventName: string,
  params?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
  }
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: params?.category,
      event_label: params?.label,
      value: params?.value,
      ...params,
    });
  }
}

/**
 * Track phone call button clicks
 * @param location - Where the click occurred (e.g., 'header', 'footer', 'sticky_button', 'hero')
 */
export function trackPhoneClick(location: string) {
  trackEvent('phone_call_click', {
    category: 'Contact',
    label: location,
    value: 1,
  });
}

/**
 * Track form submissions
 * @param formName - Name of the form (e.g., 'contact_form', 'quote_form')
 */
export function trackFormSubmission(formName: string) {
  trackEvent('form_submission', {
    category: 'Lead',
    label: formName,
    value: 1,
  });
}

/**
 * Track CTA button clicks
 * @param ctaName - Name/location of the CTA
 * @param destination - Where the CTA leads (e.g., '/contact', 'tel:')
 */
export function trackCTAClick(ctaName: string, destination?: string) {
  trackEvent('cta_click', {
    category: 'Engagement',
    label: ctaName,
    destination,
  });
}

/**
 * Track service page views (useful for understanding which services are popular)
 * @param serviceName - Name of the service
 * @param cityName - Optional city name for local SEO pages
 */
export function trackServiceView(serviceName: string, cityName?: string) {
  trackEvent('service_view', {
    category: 'Service Interest',
    label: serviceName,
    city: cityName,
  });
}

/** GA4 measurement ID (public). Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env. */
export const GA_MEASUREMENT_ID =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GA_MEASUREMENT_ID) ||
  'G-KBJTVHY5C2';

/**
 * Send a page_view for the current path. Use after client-side navigation so the
 * new page appears in GA (e.g. thank-you page after form submit).
 */
export function sendPageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: path });
  }
}

/**
 * GA4 recommended event for lead generation. Fire on thank-you / confirmation pages
 * so you can mark "generate_lead" as a conversion in GA4.
 */
export function trackGenerateLead() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      currency: 'USD',
      value: 1,
    });
  }
}
