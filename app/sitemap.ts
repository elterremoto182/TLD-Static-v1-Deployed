import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog/posts';
import { getAllPages } from '@/lib/pages/pages';
import { 
  getAllCityServiceCombinations, 
  getAllProblemCityCombinations,
  getAllServices,
  getAllProblems,
} from '@/lib/local-seo/data';

/**
 * Ensures a URL has a trailing slash, except for the base URL
 * This matches Next.js trailingSlash: true configuration
 */
function ensureTrailingSlash(url: string, baseUrl: string): string {
  // Base URL should not have trailing slash
  if (url === baseUrl) {
    return url;
  }
  // All other URLs should have trailing slash
  return url.endsWith('/') ? url : `${url}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';

  const posts = getAllPosts();
  const pages = getAllPages();

  // Blog routes
  const blogRoutes = posts.map((post) => ({
    url: ensureTrailingSlash(`${baseUrl}/${post.slug}`, baseUrl),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Static main routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/blog`, baseUrl),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/services`, baseUrl),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/about`, baseUrl),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/contact`, baseUrl),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/privacy-policy`, baseUrl),
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: ensureTrailingSlash(`${baseUrl}/problems`, baseUrl),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Service pages (from markdown)
  const servicePages = pages
    .filter((page) => {
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      return normalizedSlug.startsWith('services/');
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

  // Local SEO: Service hub pages
  const services = getAllServices();
  const serviceHubRoutes = services.map((service) => ({
    url: ensureTrailingSlash(`${baseUrl}/${service.slug}`, baseUrl),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Local SEO: City × Service pages (money pages)
  const cityServiceCombinations = getAllCityServiceCombinations();
  const cityServiceRoutes = cityServiceCombinations.map(({ service, city }) => ({
    url: ensureTrailingSlash(`${baseUrl}/${service}/${city}`, baseUrl),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Local SEO: Problem hub pages
  const problems = getAllProblems();
  const problemHubRoutes = problems.map((problem) => ({
    url: ensureTrailingSlash(`${baseUrl}/problems/${problem.slug}`, baseUrl),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Local SEO: Problem × City pages (long-tail)
  const problemCityCombinations = getAllProblemCityCombinations();
  const problemCityRoutes = problemCityCombinations.map(({ problem, city }) => ({
    url: ensureTrailingSlash(`${baseUrl}/problems/${problem}/${city}`, baseUrl),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Other pages (excluding services handled above and old city pages that are now redirected)
  const excludedSlugs = [
    'home', 'about', 'contact', 'blog', 'privacy-policy',
    // These are now handled by local SEO routes
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
    ...serviceHubRoutes,
    ...cityServiceRoutes,
    ...problemHubRoutes,
    ...problemCityRoutes,
    ...servicePages,
    ...otherPages,
    ...blogRoutes,
  ];
}
