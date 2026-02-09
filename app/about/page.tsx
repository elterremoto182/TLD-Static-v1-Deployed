import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer, processMarkdown } from '@/components/blog/MarkdownRenderer';
import { YouTubeHydrator } from '@/components/YouTubeHydrator';
import { YouTubeEmbed } from '@/components/media/YouTubeEmbed';
import { Phone, Shield, Play } from 'lucide-react';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd, baseUrl } from '@/lib/seo/schema';

export async function generateMetadata() {
  const page = getPageBySlug('about');
  
  if (!page) {
    return generatePageMetadata({
      title: 'About - Total Leak Detection',
      description: 'Learn about Total Leak Detection and our expertise in leak detection services.',
      path: '/about',
    });
  }

  return generatePageMetadata({
    title: page.seo_title || page.title || 'About - Total Leak Detection',
    description: page.seo_description || 'Learn about Total Leak Detection and our expertise in leak detection services.',
    keywords: page.keywords || (page.seo_title ? ['about', 'leak detection', 'Miami'] : undefined),
    path: '/about',
  });
}

export default async function AboutPage() {
  const page = getPageBySlug('about');

  if (!page) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs('/about', page.title);
  const pageUrl = `${baseUrl}/about/`;
  
  // Build unified schema graph
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'about',
    pageUrl,
    title: page.seo_title || page.title || 'About - Total Leak Detection',
    description: page.seo_description || 'Learn about Total Leak Detection and our expertise in leak detection services.',
    breadcrumbs,
  });

  const html = await processMarkdown(page.content);

  // Native img + WEBP srcSet for LCP (avoids hydration delay, responsive sizes)
  const aboutHeroWebpBase = '/wp-content/themes/sk-theme-three/dist/images/services/nextImageExportOptimizer/48-plumbing_3721e04b-opt';
  const aboutHeroSrcSet = `${aboutHeroWebpBase}-640.WEBP 640w, ${aboutHeroWebpBase}-1080.WEBP 1080w, ${aboutHeroWebpBase}-1920.WEBP 1920w`;

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
        {/* Hero Section with Image */}
        <section className="relative h-[50vh] min-h-[400px] max-h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={`${aboutHeroWebpBase}-640.WEBP`}
              srcSet={aboutHeroSrcSet}
              sizes="100vw"
              alt={`${page.title} - Total Leak Detection`}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="object-cover"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
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
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {page.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
              {page.seo_description || 'Learn about Total Leak Detection and our expertise in leak detection services.'}
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

        {/* Company Introduction Video Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Play className="w-4 h-4" />
                Watch Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get to Know Total Leak Detection
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're a real family-owned business with a passion for helping homeowners and businesses protect their properties from water damage.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
              <YouTubeEmbed
                videoId="zAQ-o5fv-wU"
                title="Total Leak Detection - Company Introduction"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          <YouTubeHydrator>
            <MarkdownRenderer html={html} />
          </YouTubeHydrator>
        </article>
      </main>
      <Footer />
    </>
  );
}
