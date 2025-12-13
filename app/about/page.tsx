import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer, processMarkdown } from '@/components/blog/MarkdownRenderer';
import { YouTubeHydrator } from '@/components/YouTubeHydrator';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Shield } from 'lucide-react';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import {
  generateWebPageSchema,
  generateBreadcrumbListSchema,
  structuredDataToJsonLd,
} from '@/lib/seo/structured-data';

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const breadcrumbs = generateBreadcrumbs('/about', page.title);
  const webPageSchema = generateWebPageSchema({
    title: page.seo_title || page.title || 'About - Total Leak Detection',
    description: page.seo_description || 'Learn about Total Leak Detection and our expertise in leak detection services.',
    url: `${baseUrl}/about/`,
    breadcrumbs,
  });
  const breadcrumbSchema = generateBreadcrumbListSchema(breadcrumbs);
  const html = await processMarkdown(page.content);
  
  // Use a service image for the hero
  const heroImage = '/wp-content/themes/sk-theme-three/dist/images/services/48-plumbing_3721e04b.jpg';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(webPageSchema),
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
              src={heroImage}
              alt={`${page.title} - Total Leak Detection`}
              fill
              className="object-cover"
              priority
              fetchPriority="high"
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

