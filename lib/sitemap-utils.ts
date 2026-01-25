/**
 * Sitemap utility functions shared across all sitemap segments
 */

/**
 * Ensures a URL has a trailing slash, except for the base URL
 * This matches Next.js trailingSlash: true configuration
 */
export function ensureTrailingSlash(url: string, baseUrl: string): string {
  // Base URL should not have trailing slash
  if (url === baseUrl) {
    return url;
  }
  // All other URLs should have trailing slash
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * Get the base URL for the site
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
}
