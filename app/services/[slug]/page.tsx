import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { getPageBySlug, getAllPages } from '@/lib/pages/pages';
import { ArrowLeft } from 'lucide-react';
import { generatePageMetadata } from '@/lib/utils';

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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
          </div>

          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer content={page.content} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

