import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import OptimizedImage from '@/components/OptimizedImage';
import { getPageBySlug, getAllPages } from '@/lib/pages/pages';
import { getPostBySlug, getAllPosts } from '@/lib/blog/posts';
import { Calendar, User, Phone, MapPin, Shield } from 'lucide-react';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import {
  generateArticleSchema,
  generateWebPageSchema,
  generateBreadcrumbListSchema,
  generateServiceSchema,
  structuredDataToJsonLd,
} from '@/lib/seo/structured-data';

// Default images for service area pages based on service type
const SERVICE_AREA_IMAGES = [
  '/images/services/leak-detection.jpg',
  '/images/gallery/leak-detection-before.jpg',
  '/wp-content/themes/sk-theme-three/dist/images/services/leaking_2b46c55b.jpg',
  '/wp-content/themes/sk-theme-three/dist/images/services/48-plumbing_3721e04b.jpg',
  '/wp-content/themes/sk-theme-three/dist/images/services/video-inspection_4135a27b.jpg',
];

// Get a consistent image based on slug hash
function getServiceAreaImage(slug: string, pageImage?: string): string {
  if (pageImage) return pageImage;
  // Simple hash function to get consistent image for each page
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash = hash & hash;
  }
  return SERVICE_AREA_IMAGES[Math.abs(hash) % SERVICE_AREA_IMAGES.length];
}

// Extract city name from slug
function extractCityName(slug: string): string {
  // Remove common suffixes
  const cityPart = slug
    .replace(/-leak-detection-services?/gi, '')
    .replace(/-mold-testing.*$/gi, '')
    .replace(/-expert-water-sewer.*$/gi, '')
    .replace(/total-leak-detection-/gi, '')
    .replace(/-/g, ' ');
  
  // Capitalize each word
  return cityPart
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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
  const heroImage = isLocationPage ? getServiceAreaImage(slug, page.image) : null;
  const cityName = isLocationPage ? extractCityName(slug) : '';

  // Render location/service area page with hero image
  if (isLocationPage) {
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
        <main className="min-h-screen">
          {/* Hero Section with Image */}
          <section className="relative h-[50vh] min-h-[400px] max-h-[500px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <OptimizedImage
                src={heroImage!}
                alt={`${page.title} - Professional Leak Detection Services`}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            
            {/* Hero Content */}
            <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
              <div className="mb-4">
                <Breadcrumb items={breadcrumbs} variant="light" />
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                  Serving {cityName}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {page.title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
                {page.seo_description || `Professional leak detection services in ${cityName}. Fast, reliable, and non-invasive solutions.`}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:(855)385-5325"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-5 h-5" />
                  Call (855) 385-5325
                </a>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-white text-sm font-medium">24/7 Emergency Service</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <article className="max-w-4xl mx-auto px-4 py-12">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary hover:prose-a:text-primary/80">
              <MarkdownRenderer content={page.content} />
            </div>
          </article>

          {/* Bottom CTA Section */}
          <section className="bg-gradient-to-br from-primary to-primary/90 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Need Leak Detection in {cityName}?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Don&apos;t let hidden leaks cause costly damage. Contact our expert team today for fast, professional service.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:(855)385-5325"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-6 h-6" />
                  Call Now: (855) 385-5325
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
                >
                  Request a Quote
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // Render regular pages (non-location)
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

