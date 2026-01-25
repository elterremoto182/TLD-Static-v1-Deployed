import { MetadataRoute } from 'next';
import { getAllPages } from '@/lib/pages/pages';
import { getCachedGitLastModified } from '@/lib/git-dates';
import { ensureTrailingSlash, getBaseUrl } from '@/lib/sitemap-utils';

/**
 * Pages Sitemap
 * Contains: Static pages, guides, service subpages from markdown
 * ~15 URLs
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const pages = getAllPages();

  // Get git-based dates for static pages
  const homePageDate = getCachedGitLastModified('app/page.tsx');
  const aboutPageDate = getCachedGitLastModified('content/pages/about.md');
  const contactPageDate = getCachedGitLastModified('app/contact/page.tsx');
  const privacyPageDate = getCachedGitLastModified('content/pages/privacy-policy.md');
  const servicesConfigDate = getCachedGitLastModified('config/local-seo/services.json');
  const problemsConfigDate = getCachedGitLastModified('config/local-seo/problems.json');

  // Static main routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: homePageDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/services`, baseUrl),
      lastModified: servicesConfigDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/about`, baseUrl),
      lastModified: aboutPageDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/contact`, baseUrl),
      lastModified: contactPageDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/privacy-policy`, baseUrl),
      lastModified: privacyPageDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/problems`, baseUrl),
      lastModified: problemsConfigDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Service pages that redirect to local SEO hub pages (excluded from sitemap)
  const excludedServicePages = [
    'services/leak-detection',
    'services/mold-testing',
    'services/camera-inspection',
  ];

  // Service subpages (from markdown)
  const servicePages = pages
    .filter((page) => {
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      return normalizedSlug.startsWith('services/') && !excludedServicePages.includes(normalizedSlug);
    })
    .map((page) => {
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      return {
        url: ensureTrailingSlash(`${baseUrl}/${normalizedSlug}`, baseUrl),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    });

  // Other pages (excluding services handled above and old city pages that are now redirected)
  const excludedSlugs = [
    'home', 'about', 'contact', 'blog', 'privacy-policy',
    // Orphan/redirect pages - excluded from sitemap
    'financing',
    'reviews',
    'thanks',
    // Legacy city pages now handled by local SEO routes
    'miami-leak-detection-services',
    'doral-leak-detection-expert-water-sewer-leak-detection-services',
    'coral-gables-leak-detection-services',
    'hialeah-leak-detection-services',
    'kendall-leak-detection-services',
    'pinecrest-leak-detection-services',
    'homestead-leak-detection-services',
    'miami-lakes-leak-detection-services',
    'miami-beach-leak-detection-services',
    'south-miami-leak-detection-services',
    'cutler-bay-leak-detection-services',
    'aventura-leak-detection-services',
    'north-miami-leak-detection-services',
    'north-miami-beach-leak-detection-services',
    'key-biscayne-leak-detection-services',
    'palmetto-bay-leak-detection-services',
    'sweetwater-leak-detection-services',
    'sunny-isles-beach-leak-detection-services',
    'fort-lauderdale-leak-detection-services',
    'hollywood-leak-detection-services',
    'pembroke-pines-leak-detection-services',
    'coral-springs-leak-detection-services',
    'plantation-leak-detection-services',
    'davie-leak-detection-services',
    'sunrise-leak-detection-services',
    'pompano-beach-leak-detection-services',
    'lauderhill-leak-detection-services',
    'lauderdale-lakes-leak-detection-services',
    'tamarac-leak-detection-services',
    'coconut-creek-leak-detection-services',
    'margate-leak-detection-services',
    'weston-leak-detection-services',
    'hallandale-beach-leak-detection-services',
    'total-leak-detection-deerfield-beach',
    'mold-testing-in-deerfield-beach-fl',
  ];
  
  const otherPages = pages
    .filter((page) => {
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      return (
        !normalizedSlug.startsWith('services/') &&
        !excludedSlugs.includes(normalizedSlug)
      );
    })
    .map((page) => {
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      return {
        url: ensureTrailingSlash(`${baseUrl}/${normalizedSlug}`, baseUrl),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    });

  return [
    ...staticRoutes,
    ...servicePages,
    ...otherPages,
  ];
}
