/**
 * Sitemap Generation Script
 * 
 * Generates static XML sitemap files for Next.js static export.
 * Run with: npm run generate-sitemaps (or automatically via prebuild)
 * 
 * Output files in public/sitemaps/:
 * - index.xml      (sitemap index referencing all sitemaps)
 * - static.xml     (home, about, contact, etc.)
 * - services.xml   (service hubs + city-service pages)
 * - problems.xml   (problem hubs + problem-city pages)
 * - blog.xml       (blog posts)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ============================================================================
// Configuration
// ============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
const OUTPUT_DIR = path.join(process.cwd(), 'public/sitemaps');

// ============================================================================
// Data Loading (inline to avoid module resolution issues with tsx)
// ============================================================================

// Load JSON config files
const citiesData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'config/local-seo/cities.json'), 'utf8')
);
const servicesData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'config/local-seo/services.json'), 'utf8')
);
const problemsData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'config/local-seo/problems.json'), 'utf8')
);

// Get all city slugs
function getAllCitySlugs(): string[] {
  return Object.keys(citiesData);
}

// Get all service slugs
function getAllServiceSlugs(): string[] {
  return Object.keys(servicesData);
}

// Get all problem slugs
function getAllProblemSlugs(): string[] {
  return Object.keys(problemsData);
}

// Get all published blog posts (excludes draft: true)
function getAllPosts(): Array<{ slug: string; date: string; category?: string; tags?: string[] }> {
  const postsDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(postsDir)) return [];
  
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const posts: Array<{ slug: string; date: string; category?: string; tags?: string[] }> = [];
  
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    if (slug === 'PUBLISH_WAVES') continue;
    const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { data } = matter(content);
    if (data.draft === true) continue;
    posts.push({
      slug,
      date: data.date || new Date().toISOString(),
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
    });
  }
  
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Category display name to URL slug mapping
const categorySlugMap: Record<string, string> = {
  'Leak Detection': 'leak-detection',
  'Mold Testing': 'mold-testing',
  'Sewer Camera Inspection': 'sewer-camera-inspection',
  'Drain Cleaning': 'drain-cleaning',
};

// Get all unique categories with their slugs
function getAllCategories(): string[] {
  return Object.values(categorySlugMap);
}

// Load blog tags config (source of truth for tag pages; sitemap must match app's generateStaticParams)
function getBlogTagsConfig(): Record<string, { indexable: boolean; minPosts?: number }> {
  try {
    const tagsConfig = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'config/blog-tags.json'), 'utf8')
    );
    return tagsConfig.tags || {};
  } catch {
    return {};
  }
}

// Get tag post counts
function getTagPostCounts(): Record<string, number> {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};
  
  for (const post of posts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
  }
  
  return tagCounts;
}

// Get all markdown pages
function getAllPages(): Array<{ slug: string }> {
  const pagesDir = path.join(process.cwd(), 'content/pages');
  if (!fs.existsSync(pagesDir)) return [];
  
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'));
  const pages: Array<{ slug: string }> = [];
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    const { data } = matter(content);
    if (data.slug) {
      pages.push({ slug: data.slug.replace(/^\/+|\/+$/g, '') });
    }
  }
  
  return pages;
}

// ============================================================================
// XML Generation Utilities
// ============================================================================

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function ensureTrailingSlash(url: string): string {
  if (url === BASE_URL) return url;
  return url.endsWith('/') ? url : `${url}/`;
}

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const urlEntries = entries.map(entry => {
    let xml = `  <url>\n    <loc>${entry.url}</loc>`;
    if (entry.lastmod) xml += `\n    <lastmod>${entry.lastmod}</lastmod>`;
    if (entry.changefreq) xml += `\n    <changefreq>${entry.changefreq}</changefreq>`;
    if (entry.priority !== undefined) xml += `\n    <priority>${entry.priority.toFixed(1)}</priority>`;
    xml += `\n  </url>`;
    return xml;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateSitemapIndexXml(sitemaps: Array<{ loc: string; lastmod: string }>): string {
  const sitemapEntries = sitemaps.map(sitemap => 
    `  <sitemap>\n    <loc>${sitemap.loc}</loc>\n    <lastmod>${sitemap.lastmod}</lastmod>\n  </sitemap>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

// ============================================================================
// Sitemap Generators
// ============================================================================

function generateStaticSitemap(): { xml: string; count: number } {
  const today = formatDate(new Date());
  const pages = getAllPages();
  
  // Excluded slugs (handled elsewhere or should not be indexed)
  const excludedSlugs = new Set([
    'home', 'blog', // handled separately
    'financing', 'reviews', 'thanks', // orphan/redirect pages
    // Legacy city pages
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
  ]);

  // Excluded service pages (redirect to local SEO hubs)
  const excludedServicePages = new Set([
    'services/leak-detection',
    'services/mold-testing',
    'services/camera-inspection',
  ]);

  const entries: SitemapEntry[] = [
    // Homepage
    { url: BASE_URL, lastmod: today, changefreq: 'weekly', priority: 1.0 },
    // Services listing
    { url: ensureTrailingSlash(`${BASE_URL}/services`), lastmod: today, changefreq: 'weekly', priority: 0.9 },
    // Problems listing
    { url: ensureTrailingSlash(`${BASE_URL}/problems`), lastmod: today, changefreq: 'weekly', priority: 0.9 },
  ];

  // Add markdown pages (about, contact, privacy-policy, guides, etc.)
  for (const page of pages) {
    if (excludedSlugs.has(page.slug)) continue;
    if (excludedServicePages.has(page.slug)) continue;
    
    const isService = page.slug.startsWith('services/');
    const isGuide = page.slug.startsWith('guides');
    
    entries.push({
      url: ensureTrailingSlash(`${BASE_URL}/${page.slug}`),
      lastmod: today,
      changefreq: 'monthly',
      priority: isService ? 0.8 : isGuide ? 0.7 : 0.6,
    });
  }

  return { xml: generateSitemapXml(entries), count: entries.length };
}

function generateServicesSitemap(): { xml: string; count: number } {
  const today = formatDate(new Date());
  const serviceSlugs = getAllServiceSlugs();
  const citySlugs = getAllCitySlugs();
  
  const entries: SitemapEntry[] = [];

  // Service hub pages
  for (const service of serviceSlugs) {
    entries.push({
      url: ensureTrailingSlash(`${BASE_URL}/${service}`),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
    });
  }

  // City × Service pages (money pages)
  for (const service of serviceSlugs) {
    for (const city of citySlugs) {
      entries.push({
        url: ensureTrailingSlash(`${BASE_URL}/${service}/${city}`),
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8,
      });
    }
  }

  return { xml: generateSitemapXml(entries), count: entries.length };
}

function generateProblemsSitemap(): { xml: string; count: number } {
  const today = formatDate(new Date());
  const problemSlugs = getAllProblemSlugs();
  const citySlugs = getAllCitySlugs();
  
  const entries: SitemapEntry[] = [];

  // Problem hub pages
  for (const problem of problemSlugs) {
    entries.push({
      url: ensureTrailingSlash(`${BASE_URL}/problems/${problem}`),
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  // Problem × City pages (long-tail)
  for (const problem of problemSlugs) {
    for (const city of citySlugs) {
      entries.push({
        url: ensureTrailingSlash(`${BASE_URL}/problems/${problem}/${city}`),
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.6,
      });
    }
  }

  return { xml: generateSitemapXml(entries), count: entries.length };
}

function generateBlogSitemap(): { xml: string; count: number } {
  const today = formatDate(new Date());
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tagsConfig = getBlogTagsConfig();
  const tagCounts = getTagPostCounts();

  // Only include tag pages that exist in config (same source as app's generateStaticParams).
  // Tags from post frontmatter but not in config have no page → would 404 if listed in sitemap.
  const configTagSlugs = Object.keys(tagsConfig);
  
  const entries: SitemapEntry[] = [
    // Blog listing page
    {
      url: ensureTrailingSlash(`${BASE_URL}/blog`),
      lastmod: posts.length > 0 ? formatDate(new Date(posts[0].date)) : today,
      changefreq: 'weekly',
      priority: 0.8,
    },
  ];

  // Category pages
  for (const category of categories) {
    entries.push({
      url: ensureTrailingSlash(`${BASE_URL}/blog/category/${category}`),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7,
    });
  }

  // Tag pages: only config-defined tags (indexable and meeting minPosts threshold)
  for (const tag of configTagSlugs) {
    const tagConfig = tagsConfig[tag];
    const postCount = tagCounts[tag] || 0;
    
    // Skip tags that don't meet minPosts threshold
    if (tagConfig?.minPosts && postCount < tagConfig.minPosts) {
      continue;
    }
    
    // Skip tags marked as not indexable
    if (tagConfig && tagConfig.indexable === false) {
      continue;
    }
    
    entries.push({
      url: ensureTrailingSlash(`${BASE_URL}/blog/tag/${tag}`),
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.6,
    });
  }

  // Individual blog posts
  for (const post of posts) {
    entries.push({
      url: ensureTrailingSlash(`${BASE_URL}/${post.slug}`),
      lastmod: formatDate(new Date(post.date)),
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  return { xml: generateSitemapXml(entries), count: entries.length };
}

function generateSitemapIndex(sitemapCounts: Record<string, number>): string {
  const today = formatDate(new Date());
  
  const sitemaps = [
    { loc: `${BASE_URL}/sitemaps/static.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemaps/services.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemaps/problems.xml`, lastmod: today },
    { loc: `${BASE_URL}/sitemaps/blog.xml`, lastmod: today },
  ];

  return generateSitemapIndexXml(sitemaps);
}

// ============================================================================
// Main Execution
// ============================================================================

function main() {
  console.log('🗺️  Generating sitemaps...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const counts: Record<string, number> = {};

  // Generate static sitemap
  const staticResult = generateStaticSitemap();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'static.xml'), staticResult.xml);
  counts['static'] = staticResult.count;
  console.log(`  ✓ static.xml    (${staticResult.count} URLs)`);

  // Generate services sitemap
  const servicesResult = generateServicesSitemap();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'services.xml'), servicesResult.xml);
  counts['services'] = servicesResult.count;
  console.log(`  ✓ services.xml  (${servicesResult.count} URLs)`);

  // Generate problems sitemap
  const problemsResult = generateProblemsSitemap();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'problems.xml'), problemsResult.xml);
  counts['problems'] = problemsResult.count;
  console.log(`  ✓ problems.xml  (${problemsResult.count} URLs)`);

  // Generate blog sitemap
  const blogResult = generateBlogSitemap();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'blog.xml'), blogResult.xml);
  counts['blog'] = blogResult.count;
  console.log(`  ✓ blog.xml      (${blogResult.count} URLs)`);

  // Generate sitemap index
  const indexXml = generateSitemapIndex(counts);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.xml'), indexXml);
  console.log(`  ✓ index.xml     (sitemap index)`);

  // Summary
  const totalUrls = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`\n✅ Generated ${Object.keys(counts).length + 1} sitemaps with ${totalUrls} total URLs`);
  console.log(`   Output: ${OUTPUT_DIR}/`);
}

main();
