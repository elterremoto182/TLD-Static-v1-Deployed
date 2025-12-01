import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog/posts';
import { getAllPages } from '@/lib/pages/pages';

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
  ];

  // Service pages
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

  // Location pages and other static pages (excluding services which are handled above)
  const otherPages = pages
    .filter((page) => {
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      return (
        !normalizedSlug.startsWith('services/') &&
        normalizedSlug !== 'home' &&
        normalizedSlug !== 'about' &&
        normalizedSlug !== 'contact' &&
        normalizedSlug !== 'blog' &&
        normalizedSlug !== 'privacy-policy'
      );
    })
    .map((page) => {
      const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
      // Determine priority based on page type
      let priority = 0.7;
      let changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly';
      
      // Location pages get higher priority
      if (
        normalizedSlug.includes('leak-detection') ||
        normalizedSlug.includes('mold-testing')
      ) {
        priority = 0.8;
        changeFrequency = 'monthly';
      }

      return {
        url: ensureTrailingSlash(`${baseUrl}/${normalizedSlug}`, baseUrl),
        lastModified: new Date(),
        changeFrequency,
        priority,
      };
    });

  return [...staticRoutes, ...servicePages, ...otherPages, ...blogRoutes];
}
