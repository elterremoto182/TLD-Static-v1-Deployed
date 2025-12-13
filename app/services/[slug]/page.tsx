import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer, processMarkdown } from '@/components/blog/MarkdownRenderer';
import { YouTubeHydrator } from '@/components/YouTubeHydrator';
import { getPageBySlug, getAllPages } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import {
  generateServiceSchema,
  generateBreadcrumbListSchema,
  generateWebPageSchema,
  structuredDataToJsonLd,
} from '@/lib/seo/structured-data';

export async function generateStaticParams() {
  const pages = getAllPages();
  // Filter only service pages
  const servicePages = pages.filter((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    return normalizedSlug.startsWith('services/');
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
  const pageUrl = `${baseUrl}/${normalizedSlug}/`;
  const breadcrumbs = generateBreadcrumbs(`/${normalizedSlug}`, page.title);
  
  const serviceSchema = generateServiceSchema({
    name: page.title,
    description: page.seo_description || page.title,
    serviceType: page.title,
    areaServed: 'Miami',
  });
  
  const breadcrumbSchema = generateBreadcrumbListSchema(breadcrumbs);
  const webPageSchema = generateWebPageSchema({
    title: page.title,
    description: page.seo_description || page.title,
    url: pageUrl,
    breadcrumbs,
  });
  const html = await processMarkdown(page.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(webPageSchema),
        }}
      />
      <Header />
      <main className="min-h-screen pt-20">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} />
          </div>

          <YouTubeHydrator>
            <MarkdownRenderer html={html} />
          </YouTubeHydrator>
        </article>
      </main>
      <Footer />
    </>
  );
}

