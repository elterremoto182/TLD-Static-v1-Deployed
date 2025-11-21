import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { getPageBySlug, getAllPages } from '@/lib/pages/pages';
import { Home } from 'lucide-react';
import { generatePageMetadata } from '@/lib/utils';

// Routes that have their own handlers and should not be handled by this catch-all
const reservedRoutes = [
  'about',
  'contact',
  'privacy-policy',
  'services',
  'blog',
];

export async function generateStaticParams() {
  const pages = getAllPages();
  
  // Filter out pages that have specific route handlers or are service pages
  const catchAllPages = pages.filter((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    
    // Exclude reserved routes
    if (reservedRoutes.includes(normalizedSlug)) {
      return false;
    }
    
    // Exclude service pages (handled by app/services/[slug]/page.tsx)
    if (normalizedSlug.startsWith('services/')) {
      return false;
    }
    
    // Exclude blog posts (handled by app/blog/[slug]/page.tsx)
    // Blog posts are typically in content/blog, not content/pages
    
    return true;
  });
  
  return catchAllPages.map((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    return {
      slug: normalizedSlug,
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
      title: 'Page Not Found - Total Leak Detection',
      description: 'The page you are looking for could not be found.',
      path: '/',
    });
  }
  
  const slug = String(resolvedParams.slug || '').trim();
  
  if (!slug) {
    return generatePageMetadata({
      title: 'Page Not Found - Total Leak Detection',
      description: 'The page you are looking for could not be found.',
      path: '/',
    });
  }
  
  const page = getPageBySlug(slug);
  
  if (!page) {
    return generatePageMetadata({
      title: 'Page Not Found - Total Leak Detection',
      description: 'The page you are looking for could not be found.',
      path: `/${slug}`,
    });
  }

  const urlPath = `/${slug}`;
  
  return generatePageMetadata({
    title: page.seo_title || page.title || 'Total Leak Detection',
    description: page.seo_description || 'Professional leak detection services in Miami, FL.',
    keywords: page.keywords,
    path: urlPath,
  });
}

export default async function DynamicPage({
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
  
  // Check if this is a reserved route
  if (reservedRoutes.includes(slug)) {
    notFound();
  }
  
  // Check if this is a service page
  if (slug.startsWith('services/')) {
    notFound();
  }
  
  const page = getPageBySlug(slug);
  
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
              href="/"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200 mb-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
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

