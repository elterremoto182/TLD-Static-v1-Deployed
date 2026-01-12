import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Shield, AlertTriangle, Clock, MapPin, ArrowRight, getIcon } from '@/lib/icons';

import {
  getProblem,
  getCity,
  getService,
  getAllProblemCityCombinations,
  getNearbyCities,
} from '@/lib/local-seo/data';
import {
  generateProblemCityMetaTitle,
  generateProblemCityMetaDesc,
  generateProblemCityH1,
} from '@/lib/local-seo/templates';
import {
  generateProblemCityBreadcrumbs,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
  generateWebPageSchema,
  schemaToJsonLd,
} from '@/lib/local-seo/schema';
import { getProblemCityCanonicalUrl } from '@/lib/local-seo/links';
import { LocalCTA } from '@/components/local-seo';

// Problem-specific hero images
const PROBLEM_IMAGES: Record<string, string> = {
  'slab-leak': '/images/services/leak-detection.jpg',
  'pipe-burst': '/images/services/leak-detection.jpg',
  'water-heater-leak': '/images/services/leak-detection.jpg',
  'pool-leak': '/images/services/leak-detection.jpg',
  'underground-leak': '/images/services/leak-detection.jpg',
  'shower-pan-leak': '/images/services/leak-detection.jpg',
  'toilet-leak': '/images/services/leak-detection.jpg',
  'bathroom-mold': '/images/services/mold.jpg',
  'water-damage-mold': '/images/services/mold.jpg',
  'hidden-mold': '/images/services/mold.jpg',
  'root-intrusion': '/images/services/drain-cleaning.jpg',
  'pipe-collapse': '/images/services/drain-cleaning.jpg',
  'sewer-blockage': '/images/services/drain-cleaning.jpg',
};

export async function generateStaticParams() {
  const combinations = getAllProblemCityCombinations();
  return combinations.map(({ problem, city }) => ({
    problem,
    city,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { problem: string; city: string } | Promise<{ problem: string; city: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { problem: problemSlug, city: citySlug } = resolvedParams || {};
  
  if (!problemSlug || !citySlug) {
    return {
      title: 'Page Not Found - Total Leak Detection',
      description: 'The requested page could not be found.',
    };
  }
  
  const problem = getProblem(problemSlug);
  const city = getCity(citySlug);
  
  if (!problem || !city) {
    return {
      title: 'Page Not Found - Total Leak Detection',
      description: 'The requested page could not be found.',
    };
  }
  
  const title = generateProblemCityMetaTitle(problem, city);
  const description = generateProblemCityMetaDesc(problem, city);
  const canonicalUrl = getProblemCityCanonicalUrl(problemSlug, citySlug);
  
  return {
    title,
    description,
    keywords: [...problem.keywords, city.name, city.county],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function ProblemCityPage({
  params,
}: {
  params: { problem: string; city: string } | Promise<{ problem: string; city: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { problem: problemSlug, city: citySlug } = resolvedParams || {};
  
  if (!problemSlug || !citySlug) {
    notFound();
  }
  
  const problem = getProblem(problemSlug);
  const city = getCity(citySlug);
  
  if (!problem || !city) {
    notFound();
  }
  
  const parentService = getService(problem.parentService);
  const h1 = generateProblemCityH1(problem, city);
  const breadcrumbs = generateProblemCityBreadcrumbs(problem, city);
  const canonicalUrl = getProblemCityCanonicalUrl(problemSlug, citySlug);
  const nearbyCities = getNearbyCities(citySlug, 6);
  
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, canonicalUrl);
  const localBusinessSchema = generateLocalBusinessSchema(city);
  const webPageSchema = generateWebPageSchema({
    title: h1,
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
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(localBusinessSchema) }}
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
              alt={`${problem.name} in ${city.name} - Total Leak Detection`}
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
            
            {/* Location Badge */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                {city.name}, {city.county}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {h1}
              </h1>
            </div>
            
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              {problem.overview}
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">{city.responseTime} Response</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Licensed & Insured</span>
              </div>
            </div>
            
            <a
              href="tel:8553855325"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
            >
              <Phone className="w-6 h-6" />
              Call (855) 385-5325
            </a>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            {/* City-specific intro */}
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed">
                  If you suspect {problem.name.toLowerCase()} at your {city.name} property, 
                  Total Leak Detection can help. {city.localFactors.characteristics} {city.localFactors.climate}
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Symptoms and Causes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <AnimateOnScroll animation="fade-in-up" duration={600}>
                <div className="bg-red-50 rounded-xl p-6 border border-red-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-bold text-gray-900">Warning Signs</h2>
                  </div>
                  <ul className="space-y-2">
                    {problem.symptoms.slice(0, 6).map((symptom, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Common Causes</h2>
                  </div>
                  <ul className="space-y-2">
                    {problem.causes.slice(0, 6).map((cause, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>
            
            {/* Why Urgent */}
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Why {city.name} Property Owners Should Act Fast
                </h3>
                <p className="text-gray-700">
                  {problem.whyUrgent}
                </p>
              </div>
            </AnimateOnScroll>
            
            {/* Our Approach */}
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How We Solve {problem.name} in {city.name}
                </h3>
                <p className="text-gray-700">
                  {problem.ourApproach}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
        
        {/* Related Service Link */}
        {parentService && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <AnimateOnScroll animation="fade-in-up" duration={600}>
                <Link
                  href={`/${parentService.slug}/${citySlug}/`}
                  className="group flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Related Service</p>
                    <p className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {parentService.name} in {city.name}
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </AnimateOnScroll>
            </div>
          </section>
        )}
        
        {/* Nearby Cities */}
        {nearbyCities.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <AnimateOnScroll animation="fade-in-up" duration={600}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {problem.name} Detection in Nearby Areas
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {nearbyCities.map((nearbyCity) => (
                    <Link
                      key={nearbyCity.slug}
                      href={`/problems/${problemSlug}/${nearbyCity.slug}/`}
                      className="group flex items-center gap-2 p-3 bg-gray-50 hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all"
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                        {nearbyCity.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}
        
        {/* CTA */}
        <LocalCTA
          cityName={city.name}
          serviceName={problem.name}
          responseTime={city.responseTime}
          variant="secondary"
        />
      </main>
      <Footer />
    </>
  );
}

