import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import OptimizedImage from '@/components/OptimizedImage';
import { getAllPages } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd, baseUrl } from '@/lib/seo/schema';
import { BookOpen, ArrowRight, Droplets, Camera, Waves, AlertTriangle } from 'lucide-react';

// Guide configuration with icons and images
const GUIDE_CONFIG: Record<string, { 
  icon: typeof Droplets; 
  image: string;
  servicePath: string;
  serviceName: string;
}> = {
  'leak-detection': {
    icon: Droplets,
    image: '/images/services/leak-detection.jpg',
    servicePath: '/services/leak-detection/',
    serviceName: 'Leak Detection Services',
  },
  'sewer-camera-inspection': {
    icon: Camera,
    image: '/images/gallery/camera-inspection-after.jpg',
    servicePath: '/services/camera-inspection/',
    serviceName: 'Sewer Camera Inspection Services',
  },
  'drain-cleaning': {
    icon: Waves,
    image: '/images/services/drain-cleaning.jpg',
    servicePath: '/services/drain-cleaning/',
    serviceName: 'Drain Cleaning Services',
  },
  'mold-testing': {
    icon: AlertTriangle,
    image: '/images/services/mold.jpg',
    servicePath: '/services/mold-testing/',
    serviceName: 'Mold Testing Services',
  },
};

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Homeowner Guides - Total Leak Detection',
    description: 'Comprehensive guides for Florida homeowners. Learn about leak detection, sewer camera inspections, drain cleaning, and mold testing from industry experts.',
    keywords: ['plumbing guides', 'leak detection guide', 'homeowner resources', 'Florida plumbing'],
    path: '/guides',
  });
}

export default function GuidesPage() {
  const allPages = getAllPages();
  
  // Filter only guide pages
  const guidePages = allPages.filter((page) => {
    const normalizedSlug = page.slug.replace(/^\/+|\/+$/g, '');
    return normalizedSlug.startsWith('guides/');
  });

  const breadcrumbs = generateBreadcrumbs('/guides', 'Guides');
  const pageUrl = `${baseUrl}/guides/`;
  
  // Build unified schema graph
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'collection',
    pageUrl,
    title: 'Homeowner Guides - Total Leak Detection',
    description: 'Comprehensive guides for Florida homeowners. Learn about leak detection, sewer camera inspections, drain cleaning, and mold testing from industry experts.',
    breadcrumbs,
  });

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
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pb-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Educational Resources
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Homeowner Guides
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive resources to help Florida homeowners understand, prevent, and solve common plumbing problems
              </p>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            {guidePages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No guides available yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {guidePages.map((guide) => {
                  const slugPart = guide.slug.replace(/^\/+|\/+$/g, '').replace(/^guides\//, '');
                  const config = GUIDE_CONFIG[slugPart];
                  const IconComponent = config?.icon || BookOpen;
                  const guideImage = config?.image || '/images/services/leak-detection.jpg';
                  
                  return (
                      <Link
                        key={guide.slug}
                        href={`/${guide.slug.replace(/^\/+|\/+$/g, '')}/`}
                        className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                      >
                        {/* Image Header */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <OptimizedImage
                            src={guideImage}
                            alt={guide.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          
                          {/* Badge */}
                          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-gray-900">Complete Guide</span>
                          </div>
                          
                          {/* Icon */}
                          <div className="absolute bottom-4 left-4 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-200">
                            {guide.title}
                          </h2>
                          
                          {guide.seo_description && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {guide.seo_description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center text-primary font-semibold group-hover:underline">
                              Read the Guide
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                            
                            {config && (
                              <span className="text-sm text-gray-500">
                                Related: {config.serviceName.replace(' Services', '')}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Professional Help?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Our guides are great for understanding the basics, but some problems need expert attention. 
              Total Leak Detection has served Florida homeowners for over 40 years.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:(855)385-5325"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
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
      </main>
      <Footer />
    </>
  );
}
