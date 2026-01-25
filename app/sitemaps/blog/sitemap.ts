import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog/posts';
import { ensureTrailingSlash, getBaseUrl } from '@/lib/sitemap-utils';

/**
 * Blog Sitemap
 * Contains: All blog posts
 * ~24 URLs
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const posts = getAllPosts();

  // Blog listing page
  const blogListingRoute = {
    url: ensureTrailingSlash(`${baseUrl}/blog`, baseUrl),
    lastModified: posts.length > 0 ? new Date(posts[0].date) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  // Blog post routes
  const blogRoutes = posts.map((post) => ({
    url: ensureTrailingSlash(`${baseUrl}/${post.slug}`, baseUrl),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    blogListingRoute,
    ...blogRoutes,
  ];
}
