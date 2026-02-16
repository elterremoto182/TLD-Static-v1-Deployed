import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer, processMarkdown } from '@/components/blog/MarkdownRenderer';
import { YouTubeHydrator } from '@/components/YouTubeHydrator';
import OptimizedImage from '@/components/OptimizedImage';
import { getPageBySlug, getAllPages } from '@/lib/pages/pages';
import { getAllPosts, BlogPost } from '@/lib/blog/posts';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { Phone, BookOpen, ArrowRight } from 'lucide-react';
import { buildPageSchemaGraph, schemaToJsonLd } from '@/lib/seo/schema';
import { baseUrl } from '@/lib/site-url';

// Map guide slugs to their related blog categories, service pages, and videos
const GUIDE_CONFIG: Record<string, { 
  category: string; 
  servicePath: string; 
  serviceName: string;
  video?: {
    id: string;
    title: string;
    description: string;
    uploadDate: string;
    duration?: string;
  };
}> = {
  'leak-detection': {
    category: 'Leak Detection',
    servicePath: '/leak-detection/',
    serviceName: 'Leak Detection Services',
  },
  'sewer-camera-inspection': {
    category: 'Sewer Camera Inspection',
    servicePath: '/sewer-camera-inspection/',
    serviceName: 'Sewer Camera Inspection Services',
    video: {
      id: 'Sk7VPGiqhek',
      title: 'Sewer Camera Inspection - Professional HD Video Pipe Inspection in Florida',
      description: 'Watch a professional sewer camera inspection in action. See how our HD video technology reveals pipe conditions, blockages, root intrusion, and damage inside sewer lines. Total Leak Detection provides comprehensive video pipe inspection services throughout South Florida.',
      uploadDate: '2024-01-15',
      duration: 'PT3M45S',
    },
  },
  'drain-cleaning': {
    category: 'Drain Cleaning',
    servicePath: '/services/drain-cleaning/',
    serviceName: 'Drain Cleaning Services',
  },
  'mold-testing': {
    category: 'Mold Testing',
    servicePath: '/mold-testing/',
    serviceName: 'Mold Testing Services',
  },
};

export async function generateStaticParams() {
  const pages = getAllPages();
  // Filter only guide pages
  const guidePages = pages.filter((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    return normalizedSlug.startsWith('guides/');
  });
  
  return guidePages.map((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    const slugPart = normalizedSlug.replace(/^guides\//, '').replace(/\/$/, '');
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
  const resolvedParams = params instanceof Promise ? await params : params;
  
  if (!resolvedParams || typeof resolvedParams !== 'object' || !resolvedParams.slug) {
    return generatePageMetadata({
      title: 'Guide Not Found',
      description: 'The requested guide could not be found.',
      path: '/guides',
    });
  }
  
  const slug = String(resolvedParams.slug || '').trim();
  
  if (!slug) {
    return generatePageMetadata({
      title: 'Guide Not Found',
      description: 'The requested guide could not be found.',
      path: '/guides',
    });
  }
  
  const fullSlug = `guides/${slug}`;
  const page = getPageBySlug(fullSlug);
  
  if (!page) {
    return generatePageMetadata({
      title: 'Guide Not Found',
      description: 'The requested guide could not be found.',
      path: `/guides/${slug}`,
    });
  }

  const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
  const urlPath = `/${normalizedSlug}`;

  return generatePageMetadata({
    title: page.seo_title || page.title || 'Guide - Total Leak Detection',
    description: page.seo_description || page.title || 'Comprehensive guide from Total Leak Detection.',
    keywords: page.keywords || (page.seo_title ? [page.seo_title] : undefined),
    path: urlPath,
  });
}

export default async function GuidePage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  
  if (!resolvedParams || typeof resolvedParams !== 'object' || !resolvedParams.slug) {
    notFound();
  }
  
  const slug = String(resolvedParams.slug || '').trim();
  
  if (!slug) {
    notFound();
  }
  
  // Try to find the page with various slug formats
  let fullSlug = `guides/${slug}`;
  let page = getPageBySlug(fullSlug);
  
  if (!page) {
    fullSlug = `guides/${slug}/`;
    page = getPageBySlug(fullSlug);
  }
  
  if (!page && fullSlug.endsWith('/')) {
    fullSlug = fullSlug.slice(0, -1);
    page = getPageBySlug(fullSlug);
  }

  if (!page) {
    notFound();
  }

  // Get guide configuration
  const guideConfig = GUIDE_CONFIG[slug];
  
  // Get related blog posts for this guide's category
  const allPosts = getAllPosts();
  const relatedPosts = guideConfig
    ? allPosts
        .filter((post: BlogPost) => post.category === guideConfig.category)
        .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
  const pageUrl = `${baseUrl}/${normalizedSlug}/`;
  const breadcrumbs = generateBreadcrumbs(`/${normalizedSlug}`, page.title);
  
  // Build unified schema graph with @context - fixes parse errors from multiple blocks
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'guide',
    pageUrl,
    title: page.title,
    description: page.seo_description || page.title,
    breadcrumbs,
    video: guideConfig?.video,
  });
  
  // Process markdown content
  let html = await processMarkdown(page.content);
  
  // Extract first image for hero
  const extractFirstImage = (htmlContent: string): string | null => {
    const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    return imgMatch ? imgMatch[1] : null;
  };
  
  const firstImage = extractFirstImage(html);
  const heroImage = page.image || firstImage || '/images/services/leak-detection.jpg';
  
  // Remove first image from content if using as hero
  if (firstImage && !page.image) {
    html = html.replace(/<p[^>]*>\s*<img[^>]+src=["'][^"']*["'][^>]*>\s*<\/p>/i, '');
    html = html.replace(/<img[^>]+src=["'][^"']*["'][^>]*>/i, '');
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd(schemaGraph),
        }}
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[calc(45vh+5rem)] min-h-[calc(350px+5rem)] max-h-[calc(450px+5rem)] overflow-hidden pt-20">
          <div className="absolute inset-0">
            <OptimizedImage
              src={heroImage}
              alt={`${page.title} - Comprehensive Guide`}
              fill
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-center pt-4 sm:pt-0">
            <div className="mb-4 min-h-[2.5rem] sm:min-h-[1.5rem]">
              <Breadcrumb items={breadcrumbs} variant="light" />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                Comprehensive Guide
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
              {page.title}
            </h1>
            
            {page.seo_description && (
              <p className="text-lg md:text-xl text-white/90 max-w-3xl drop-shadow-md">
                {page.seo_description}
              </p>
            )}
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Article Content */}
            <article className="lg:col-span-2">
              <YouTubeHydrator>
                <div className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80">
                  <MarkdownRenderer html={html} />
                </div>
              </YouTubeHydrator>
            </article>
            
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* CTA Card */}
                {guideConfig && (
                  <div className="bg-gradient-to-br from-primary to-primary/90 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-3">Need Professional Help?</h3>
                    <p className="text-white/90 mb-4 text-sm">
                      Our experts are available 24/7 for {guideConfig.serviceName.toLowerCase()}.
                    </p>
                    <a
                      href="tel:(855)385-5325"
                      className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 mb-3"
                    >
                      <Phone className="w-5 h-5" />
                      (855) 385-5325
                    </a>
                    <Link
                      href={guideConfig.servicePath}
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      View {guideConfig.serviceName}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
                
                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Related Articles
                    </h3>
                    <ul className="space-y-3">
                      {relatedPosts.slice(0, 8).map((post: BlogPost) => (
                        <li key={post.slug}>
                          <Link
                            href={`/${post.slug}/`}
                            className="text-sm text-gray-700 hover:text-primary transition-colors duration-200 line-clamp-2 block"
                          >
                            {post.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {relatedPosts.length > 8 && (
                      <Link
                        href="/blog/"
                        className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-4 hover:underline"
                      >
                        View all articles
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom CTA Section */}
        {guideConfig && (
          <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for Professional {guideConfig.serviceName}?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Total Leak Detection has served Florida homeowners for over 40 years. Get expert help today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:(855)385-5325"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-6 h-6" />
                  Call Now: (855) 385-5325
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

