import { getBaseUrl } from '@/lib/sitemap-utils';
import {
  getCityServiceLastModified,
  getProblemCityLastModified,
  getCachedGitLastModified,
} from '@/lib/git-dates';
import { getAllPosts } from '@/lib/blog/posts';

/**
 * Sitemap Index Route Handler
 * Outputs proper <sitemapindex> XML referencing all segment sitemaps
 * 
 * Structure:
 * - /sitemaps/services/sitemap.xml  (~120 URLs: service hubs + city-service pages)
 * - /sitemaps/problems/sitemap.xml  (~840 URLs: problem hubs + problem-city pages)
 * - /sitemaps/blog/sitemap.xml      (~25 URLs: blog listing + posts)
 * - /sitemaps/pages/sitemap.xml     (~15 URLs: static pages, guides)
 */

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function GET() {
  const baseUrl = getBaseUrl();
  
  // Get last modified dates for each segment
  const servicesLastMod = getCityServiceLastModified();
  const problemsLastMod = getProblemCityLastModified();
  const posts = getAllPosts();
  const blogLastMod = posts.length > 0 ? new Date(posts[0].date) : new Date();
  const pagesLastMod = getCachedGitLastModified('app/page.tsx');

  const sitemaps = [
    { loc: `${baseUrl}/sitemaps/services/sitemap.xml`, lastmod: servicesLastMod },
    { loc: `${baseUrl}/sitemaps/problems/sitemap.xml`, lastmod: problemsLastMod },
    { loc: `${baseUrl}/sitemaps/blog/sitemap.xml`, lastmod: blogLastMod },
    { loc: `${baseUrl}/sitemaps/pages/sitemap.xml`, lastmod: pagesLastMod },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${formatDate(sitemap.lastmod)}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
