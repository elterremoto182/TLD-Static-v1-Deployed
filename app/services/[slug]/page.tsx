import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer, processMarkdown } from '@/components/blog/MarkdownRenderer';
import { YouTubeHydrator } from '@/components/YouTubeHydrator';
import OptimizedImage from '@/components/OptimizedImage';
import { FindInYourCity } from '@/components/sections/FindInYourCity';
import { getPageBySlug, getAllPages } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd, baseUrl } from '@/lib/seo/schema';

// Services that have been consolidated to local SEO hub pages
// These should not be generated from markdown and will redirect to their hub URLs
const EXCLUDED_SERVICE_SLUGS = ['leak-detection', 'mold-testing', 'camera-inspection', 'sewer-camera-inspection'];

export async function generateStaticParams() {
  const pages = getAllPages();
  // Filter only service pages, excluding those consolidated to local SEO hubs
  const servicePages = pages.filter((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    if (!normalizedSlug.startsWith('services/')) return false;
    
    // Extract the slug part and check if it's excluded
    const slugPart = normalizedSlug.replace(/^services\//, '').replace(/\/$/, '');
    return !EXCLUDED_SERVICE_SLUGS.includes(slugPart);
  });
  
  return servicePages.map((page) => {
    // Extract the slug part after 'services/'
    // Normalize by removing leading/trailing slashes first
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    const slugPart = normalizedSlug.replace(/^services\//, '').replace(/\/$/, '');
    return {
      slug: slugPart,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Handle params as either a direct object or Promise (Next.js 14.2 compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  
  if (!resolvedParams || typeof resolvedParams !== 'object' || !resolvedParams.slug) {
    return generatePageMetadata({
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
      path: '/services',
    });
  }
  
  const slug = String(resolvedParams.slug || '').trim();
  
  if (!slug) {
    return generatePageMetadata({
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
      path: '/services',
    });
  }
  
  // Normalize the slug to match the format in markdown files
  const fullSlug = `services/${slug}`;
  const page = getPageBySlug(fullSlug);
  
  if (!page) {
    return generatePageMetadata({
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
      path: `/services/${slug}`,
    });
  }

  // Normalize slug for URL path
  const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
  const urlPath = `/${normalizedSlug}`;

  return generatePageMetadata({
    title: page.seo_title || page.title || 'Service - Total Leak Detection',
    description: page.seo_description || page.title || 'Professional leak detection and plumbing services.',
    keywords: page.keywords || (page.seo_title ? [page.seo_title] : undefined),
    path: urlPath,
  });
}

export default async function ServicePage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Handle params as either a direct object or Promise (Next.js 14.2 compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  
  if (!resolvedParams || typeof resolvedParams !== 'object' || !resolvedParams.slug) {
    notFound();
  }
  
  const slug = String(resolvedParams.slug || '').trim();
  
  if (!slug) {
    notFound();
  }
  
  // Normalize the slug to match the format in markdown files
  // Try with and without trailing slash
  let fullSlug = `services/${slug}`;
  let page = getPageBySlug(fullSlug);
  
  // If not found, try with trailing slash
  if (!page) {
    fullSlug = `services/${slug}/`;
    page = getPageBySlug(fullSlug);
  }
  
  // If still not found, try the other way
  if (!page && fullSlug.endsWith('/')) {
    fullSlug = fullSlug.slice(0, -1);
    page = getPageBySlug(fullSlug);
  }

  if (!page) {
    notFound();
  }

  const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
  const pageUrl = `${baseUrl}/${normalizedSlug}/`;
  const breadcrumbs = generateBreadcrumbs(`/${normalizedSlug}`, page.title);
  
  // Build unified schema graph
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'service',
    pageUrl,
    title: page.title,
    description: page.seo_description || page.title,
    breadcrumbs,
    service: {
      name: page.title,
      description: page.seo_description || page.title,
      serviceType: page.title,
    },
  });

  let html = await processMarkdown(page.content);
  
  // Extract first image from markdown content for hero, or use page.image or default
  const extractFirstImage = (htmlContent: string): string | null => {
    const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    return imgMatch ? imgMatch[1] : null;
  };
  
  const firstImage = extractFirstImage(html);
  const heroImage = page.image || firstImage || '/images/services/leak-detection.jpg';
  
  // Remove first image from markdown if we're using it as hero to avoid duplicate loading
  if (firstImage && !page.image) {
    // Remove the first img tag and its wrapping paragraph if present
    html = html.replace(/<p[^>]*>\s*<img[^>]+src=["'][^"']*["'][^>]*>\s*<\/p>/i, '');
    html = html.replace(/<img[^>]+src=["'][^"']*["'][^>]*>/i, '');
  }

  return (
    <>
      {/* Unified structured data with @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd(schemaGraph),
        }}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section with Image - Above the fold for LCP optimization */}
        <section className="relative h-[calc(50vh+5rem)] min-h-[calc(400px+5rem)] max-h-[calc(500px+5rem)] overflow-hidden pt-20">
          <div className="absolute inset-0">
            <OptimizedImage
              src={heroImage}
              alt={`${page.title} - Professional Leak Detection Services`}
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          
          <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center pt-4 sm:pt-0">
            <div className="mb-4 min-h-[2.5rem] sm:min-h-[1.5rem]">
              <Breadcrumb items={breadcrumbs} variant="light" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {page.title}
            </h1>
            {page.seo_description && (
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl drop-shadow-md">
                {page.seo_description}
              </p>
            )}
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 py-12">
          <YouTubeHydrator>
            <MarkdownRenderer html={html} />
          </YouTubeHydrator>
        </article>
        
        {/* Find in Your City Section */}
        <FindInYourCity serviceSlug={slug} serviceName={page.title} />
      </main>
      <Footer />
    </>
  );
}
