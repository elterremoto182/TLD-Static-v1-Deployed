import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { Phone, MapPin, Droplet, Shield, Camera, ArrowRight } from 'lucide-react';

import { getAllCities, getAllServices } from '@/lib/local-seo/data';
import { groupCitiesByCounty } from '@/lib/local-seo/links';
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  schemaToJsonLd,
} from '@/lib/local-seo/schema';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { getPageBySlug } from '@/lib/pages/pages';

const SERVICE_ICONS: Record<string, React.ElementType> = {
  'leak-detection': Droplet,
  'mold-testing': Shield,
  'sewer-camera-inspection': Camera,
};

export async function generateMetadata() {
  const page = getPageBySlug('areas');
  
  return {
    ...generatePageMetadata({
      title: page?.seo_title || 'Service Areas | Leak Detection Throughout South Florida',
      description: page?.seo_description || 'Total Leak Detection serves Miami-Dade and Broward counties with professional leak detection, mold testing, and sewer camera inspection services. Find your city.',
      keywords: page?.keywords || ['leak detection service areas', 'South Florida leak detection', 'Miami leak detection', 'Broward leak detection'],
      path: '/areas',
    }),
    // noindex, follow - Safety net page ensures all cities are crawlable
    // while concentrating indexable link equity on tiered pages
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function AreasPage() {
  const cities = getAllCities();
  const services = getAllServices();
  const citiesByCounty = groupCitiesByCounty(cities);
  const breadcrumbs = generateBreadcrumbs('/areas', 'Service Areas');
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const pageUrl = `${baseUrl}/areas/`;
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, pageUrl);
  const webPageSchema = generateWebPageSchema({
    title: 'Service Areas | Total Leak Detection',
    description: 'Professional leak detection services throughout South Florida',
    url: `${baseUrl}/areas/`,
    breadcrumbs,
  });
  
  // Popular cities for quick access
  const popularCities = [
    'miami', 'fort-lauderdale', 'coral-gables', 'hollywood', 
    'pembroke-pines', 'doral', 'hialeah', 'miami-beach'
  ];
  
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
        <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbs} />
            </div>
            
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Service Areas
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mb-8">
                Total Leak Detection proudly serves Miami-Dade and Broward counties with professional 
                leak detection, mold testing, and sewer camera inspection services. Find your city below.
              </p>
              
              <a
                href="tel:8553855325"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                Call (855) 385-5325
              </a>
            </AnimateOnScroll>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Our Services
              </h2>
            </AnimateOnScroll>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const IconComponent = SERVICE_ICONS[service.slug] || Droplet;
                return (
                  <AnimateOnScroll
                    key={service.slug}
                    animation="fade-in-up"
                    duration={600}
                    delay={index * 100}
                  >
                    <Link
                      href={`/${service.slug}/`}
                      className="group block bg-gray-50 hover:bg-primary/5 rounded-xl p-6 border border-gray-100 hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center transition-colors">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {service.hubContent.intro.substring(0, 120)}...
                      </p>
                      <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:underline">
                        View All Cities
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Popular Cities Quick Links */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Popular Service Areas
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Quick access to our most requested service areas
              </p>
            </AnimateOnScroll>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCities.map((citySlug, index) => {
                const city = cities.find(c => c.slug === citySlug);
                if (!city) return null;
                
                return (
                  <AnimateOnScroll
                    key={citySlug}
                    animation="fade-in-up"
                    duration={600}
                    delay={index * 50}
                  >
                    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">{city.name}</h3>
                      </div>
                      <div className="flex flex-col gap-1">
                        {services.map(service => (
                          <Link
                            key={`${citySlug}-${service.slug}`}
                            href={`/${service.slug}/${citySlug}/`}
                            className="text-sm text-gray-600 hover:text-primary transition-colors"
                          >
                            {service.name} →
                          </Link>
                        ))}
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* All Cities by County */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                All Service Areas
              </h2>
            </AnimateOnScroll>
            
            {Object.entries(citiesByCounty).sort().map(([county, countyCities]) => (
              <div key={county} className="mb-12 last:mb-0">
                <AnimateOnScroll animation="fade-in-up" duration={600}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    {county}
                  </h3>
                </AnimateOnScroll>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {countyCities.map((city, index) => (
                    <AnimateOnScroll
                      key={city.slug}
                      animation="fade-in-up"
                      duration={600}
                      delay={index * 30}
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-primary/5 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-gray-900">{city.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {services.map(service => (
                            <Link
                              key={`${city.slug}-${service.slug}`}
                              href={`/${service.slug}/${city.slug}/`}
                              className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                            >
                              {service.name.split(' ')[0]}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary to-primary/90">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Don&apos;t See Your City?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                We serve additional areas throughout South Florida. Call us to confirm service 
                availability in your location.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="tel:8553855325"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
                >
                  <Phone className="w-6 h-6" />
                  Call (855) 385-5325
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

