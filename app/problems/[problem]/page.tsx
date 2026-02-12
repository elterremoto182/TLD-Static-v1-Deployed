import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Shield, AlertTriangle, MapPin, getIcon } from '@/lib/icons';

import {
  getProblem,
  getAllProblems,
  getService,
  getAllCities,
} from '@/lib/local-seo/data';
import {
  generateProblemHubBreadcrumbs,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  schemaToJsonLd,
} from '@/lib/local-seo/schema';
import { baseUrl } from '@/lib/site-url';

import { LocalCTA, CityGrid } from '@/components/local-seo';

// Problem-specific hero images (fallback to service images)
const PROBLEM_IMAGES: Record<string, string> = {
  // Leak detection problems - using new specific gallery images
  'slab-leak': '/images/gallery/miami-moisture-meter-leak-detection.jpeg',
  'pipe-burst': '/images/gallery/active-supply-water-line-leak.jpeg',
  'water-heater-leak': '/images/gallery/moisture-detection-water-leak.jpeg',
  'pool-leak': '/images/gallery/thermal-imaging-leak-detection-attic-miami-doral-miramar.jpeg',
  'underground-leak': '/images/gallery/thermal-imaging-leak-detection-attic-miami-doral-miramar.jpeg',
  'shower-pan-leak': '/images/gallery/shower-pan-inspection-tool-leak-detection-doral-tiled-bathroom-floor.jpeg',
  'toilet-leak': '/images/gallery/plumbing-inspection-tub-spout-leakage.jpeg',
  // Mold problems - using new specific gallery images
  'bathroom-mold': '/images/gallery/mold-testing-bathroom-swap-test.jpeg',
  'water-damage-mold': '/images/gallery/moisture-meter-with-visible-mold.jpeg',
  'hidden-mold': '/images/gallery/hidden-mold-test-swab-test.jpeg',
  'ac-mold': '/images/gallery/mold-test-air-vent.jpeg',
  'kitchen-mold': '/images/gallery/mold-test-under-sink.jpeg',
  'closet-mold': '/images/gallery/mold-behind-base-boards-mold-inspection-swab-test.jpeg',
  'crawlspace-mold': '/images/gallery/dangerous-mold-testing-swab-test.jpeg',
  // Sewer problems - keeping existing service images (no new images for this category)
  'root-intrusion': '/images/services/drain-cleaning.jpg',
  'pipe-collapse': '/images/services/drain-cleaning.jpg',
  'sewer-blockage': '/images/services/drain-cleaning.jpg',
  'offset-joint': '/images/services/drain-cleaning.jpg',
  'scale-buildup': '/images/services/drain-cleaning.jpg',
  'foreign-object': '/images/services/drain-cleaning.jpg',
  'cracked-pipe': '/images/services/drain-cleaning.jpg',
};

export async function generateStaticParams() {
  const problems = getAllProblems();
  return problems.map((problem) => ({
    problem: problem.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { problem: string } | Promise<{ problem: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const problemSlug = resolvedParams?.problem;
  
  if (!problemSlug) {
    return {
      title: 'Problem Not Found - Total Leak Detection',
      description: 'The requested problem page could not be found.',
    };
  }
  
  const problem = getProblem(problemSlug);
  if (!problem) {
    return {
      title: 'Problem Not Found - Total Leak Detection',
      description: 'The requested problem page could not be found.',
    };
  }

  const canonicalUrl = `${baseUrl}/problems/${problemSlug}/`;
  
  return {
    title: `${problem.name} | Expert Detection & Solutions in Florida`,
    description: problem.overview,
    keywords: problem.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${problem.name} | Total Leak Detection`,
      description: problem.overview,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: { url: canonicalUrl },
  };
}

export default async function ProblemHubPage({
  params,
}: {
  params: { problem: string } | Promise<{ problem: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const problemSlug = resolvedParams?.problem;
  
  if (!problemSlug) {
    notFound();
  }
  
  const problem = getProblem(problemSlug);
  if (!problem) {
    notFound();
  }
  
  const parentService = getService(problem.parentService);
  const cities = getAllCities();
  const breadcrumbs = generateProblemHubBreadcrumbs(problem);
  const canonicalUrl = `${baseUrl}/problems/${problemSlug}/`;
  
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, canonicalUrl);
  const webPageSchema = generateWebPageSchema({
    title: `${problem.name} | Expert Detection & Solutions`,
    description: problem.overview,
    url: canonicalUrl,
    breadcrumbs,
  });
  
  const IconComponent = getIcon(problem.icon);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(webPageSchema) }}
      />
      
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[450px] overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedImage
              src={PROBLEM_IMAGES[problemSlug] || '/images/services/leak-detection.jpg'}
              alt={`${problem.name} - Total Leak Detection`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70" />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-16">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbs} variant="light" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {problem.name}
                </h1>
                {parentService && (
                  <p className="text-white/70 text-lg">
                    Part of our {parentService.name} services
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              {problem.overview}
            </p>
            
            <a
              href="tel:8553855325"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
            >
              <Phone className="w-6 h-6" />
              Call (855) 385-5325
            </a>
          </div>
        </section>
        
        {/* Symptoms Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Symptoms */}
                <div className="bg-red-50 rounded-xl p-8 border border-red-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Warning Signs
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {problem.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              
              {/* Causes */}
                <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Common Causes
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {problem.causes.map((cause, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
          </div>
        </section>
        
        {/* Why Urgent + Our Approach */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Why Immediate Action Matters
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {problem.whyUrgent}
                </p>
              </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Our Approach to {problem.name}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {problem.ourApproach}
                </p>
              </div>
          </div>
        </section>
        
        {/* City Grid for Problem Pages */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {problem.name} Detection by Location
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Select your city for local information about {problem.name.toLowerCase()} detection and solutions
                </p>
              </div>
            
            {/* All city links for problem pages - grouped by county */}
            <div className="space-y-8">
              {/* Miami-Dade County */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Miami-Dade County
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {cities
                    .filter(city => city.county === 'Miami-Dade County')
                    .map((city) => (
                      <Link
                        key={city.slug}
                        href={`/problems/${problemSlug}/${city.slug}/`}
                        className="group flex items-center gap-2 p-3 bg-gray-50 hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200"
                      >
                        <span className="font-medium text-gray-800 group-hover:text-primary transition-colors truncate text-sm">
                          {city.name}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
              
              {/* Broward County */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Broward County
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {cities
                    .filter(city => city.county === 'Broward County')
                    .map((city) => (
                      <Link
                        key={city.slug}
                        href={`/problems/${problemSlug}/${city.slug}/`}
                        className="group flex items-center gap-2 p-3 bg-gray-50 hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200"
                      >
                        <span className="font-medium text-gray-800 group-hover:text-primary transition-colors truncate text-sm">
                          {city.name}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
              
              {/* Palm Beach County */}
              {cities.filter(city => city.county === 'Palm Beach County').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Palm Beach County
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {cities
                      .filter(city => city.county === 'Palm Beach County')
                      .map((city) => (
                        <Link
                          key={city.slug}
                          href={`/problems/${problemSlug}/${city.slug}/`}
                          className="group flex items-center gap-2 p-3 bg-gray-50 hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200"
                        >
                          <span className="font-medium text-gray-800 group-hover:text-primary transition-colors truncate text-sm">
                            {city.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <LocalCTA
          cityName="South Florida"
          serviceName={problem.name}
          responseTime="30-60 minutes"
          variant="secondary"
        />
      </main>
      <Footer />
    </>
  );
}

