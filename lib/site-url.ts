/**
 * Canonical base URL for the site (no trailing slash).
 * Used for canonicals, sitemaps, schema, and OpenGraph URLs.
 * Normalized to prevent double slashes when concatenating with paths like /about/
 */
export const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com'
).replace(/\/+$/, '');
