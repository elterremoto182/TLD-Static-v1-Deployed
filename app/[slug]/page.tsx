import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { getPageBySlug, getAllPages } from '@/lib/pages/pages';
import { getPostBySlug, getAllPosts } from '@/lib/blog/posts';
import { Calendar, User } from 'lucide-react';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import {
  generateArticleSchema,
  generateWebPageSchema,
  generateBreadcrumbListSchema,
  generateServiceSchema,
  structuredDataToJsonLd,
} from '@/lib/seo/structured-data';

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
  const posts = getAllPosts();
  
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
    
    return true;
  });
  
  // Combine pages and blog posts
  const pageParams = catchAllPages.map((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    return {
      slug: normalizedSlug,
    };
  });
  
  const postParams = posts.map((post) => ({
    slug: post.slug,
  }));
  
  return [...pageParams, ...postParams];
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
  
  // Check for blog post first
  const post = getPostBySlug(slug);
  if (post) {
    return generatePageMetadata({
      title: post.seo_title || `${post.title} | Total Leak Detection`,
      description: post.excerpt || post.title,
      keywords: post.category ? [post.category, 'blog'] : ['blog'],
      path: `/${post.slug}`,
      ogImage: post.image,
      articleType: 'article',
      articleAuthor: post.author,
      articlePublishedTime: post.date,
      articleModifiedTime: post.date,
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
  
  // Check for blog post first
  const post = getPostBySlug(slug);
  if (post) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
    const postUrl = `${baseUrl}/${post.slug}`;
    const breadcrumbs = generateBreadcrumbs(`/${post.slug}`, post.title);
    const articleSchema = generateArticleSchema({
      title: post.title,
      description: post.excerpt || post.title,
      author: post.author,
      datePublished: post.date,
      dateModified: post.date,
      image: post.image,
      url: postUrl,
      content: post.content,
    });
    const breadcrumbSchema = generateBreadcrumbListSchema(breadcrumbs);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: structuredDataToJsonLd(articleSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: structuredDataToJsonLd(breadcrumbSchema),
          }}
        />
        <Header />
        <main className="min-h-screen">
          <article className="pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4">
              <div className="mb-8">
                <Breadcrumb items={breadcrumbs} />
              </div>

              {post.category && (
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                  {post.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <span className="inline-flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {post.author && (
                  <span className="inline-flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {post.author}
                  </span>
                )}
              </div>

              {post.image && (
                <div className="aspect-video rounded-xl overflow-hidden mb-12 relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                </div>
              )}

              <MarkdownRenderer content={post.content} />
            </div>
          </article>
        </main>
        <Footer />
      </>
    );
  }
  
  const page = getPageBySlug(slug);
  
  if (!page) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const pageUrl = `${baseUrl}/${slug}`;
  const breadcrumbs = generateBreadcrumbs(`/${slug}`, page.title);
  const isLocationPage = slug.includes('leak-detection') || slug.includes('mold-testing');
  
  // Generate appropriate schema based on page type
  let pageSchema;
  if (isLocationPage) {
    // For location pages, use Service schema
    pageSchema = generateServiceSchema({
      name: page.title,
      description: page.seo_description || page.title,
      areaServed: page.title.includes('Miami') ? 'Miami' : undefined,
    });
  } else {
    // For other pages, use WebPage schema
    pageSchema = generateWebPageSchema({
      title: page.title,
      description: page.seo_description || page.title,
      url: pageUrl,
      breadcrumbs,
    });
  }
  
  const breadcrumbSchema = generateBreadcrumbListSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(pageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(breadcrumbSchema),
        }}
      />
      <Header />
      <main className="min-h-screen pt-20">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} />
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

