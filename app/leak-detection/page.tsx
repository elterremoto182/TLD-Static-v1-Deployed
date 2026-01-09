import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Shield, Clock, CheckCircle, Droplet } from 'lucide-react';

import { getService, getAllCities, getServiceVideo } from '@/lib/local-seo/data';
import {
  generateServiceHubBreadcrumbs,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  schemaToJsonLd,
} from '@/lib/local-seo/schema';
import { getServiceHubCanonicalUrl } from '@/lib/local-seo/links';
import { CityGrid, ServiceProcess, LocalCTA, ServiceVideoEmbed } from '@/components/local-seo';

const SERVICE_SLUG = 'leak-detection';

export async function generateMetadata() {
  const service = getService(SERVICE_SLUG);
  if (!service) return { title: 'Service Not Found' };
  
  const canonicalUrl = getServiceHubCanonicalUrl(SERVICE_SLUG);
  
  return {
    title: `${service.name} Services in Florida | Total Leak Detection`,
    description: service.hubContent.intro,
    keywords: service.keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${service.name} Services | Total Leak Detection`,
      description: service.hubContent.intro,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function LeakDetectionHubPage() {
  const service = getService(SERVICE_SLUG);
  if (!service) notFound();
  
  const cities = getAllCities();
  const breadcrumbs = generateServiceHubBreadcrumbs(service);
  const canonicalUrl = getServiceHubCanonicalUrl(SERVICE_SLUG);
  const videoConfig = getServiceVideo(SERVICE_SLUG);
  
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, canonicalUrl);
  const webPageSchema = generateWebPageSchema({
    title: `${service.name} Services in Florida`,
    description: service.hubContent.intro,
    url: canonicalUrl,
    breadcrumbs,
  });
  
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
              src="/images/services/leak-detection.jpg"
              alt="Leak Detection Services - Total Leak Detection"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-16">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbs} variant="light" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {service.name}
                </h1>
                <p className="text-white/80 text-lg">
                  Professional Services Throughout South Florida
                </p>
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              {service.hubContent.intro}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">24/7 Emergency Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Free Estimates</span>
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
        
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <p className="text-lg text-gray-600">
                {service.hubContent.serviceAreas}
              </p>
            </AnimateOnScroll>
          </div>
        </section>
        
        <CityGrid 
          cities={cities}
          serviceSlug={SERVICE_SLUG}
          serviceName={service.name}
          groupByCounty={true}
        />
        
        <ServiceProcess 
          steps={service.process}
          title={`How Our ${service.name} Works`}
          subtitle="Our proven process delivers accurate results every time"
        />
        
        {videoConfig && (
          <ServiceVideoEmbed 
            videoUrl={videoConfig.url!}
            title={videoConfig.title}
          />
        )}
        
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                About Our {service.name} Services
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {service.bodyContent.overview}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {service.bodyContent.whyImportant}
              </p>
            </AnimateOnScroll>
          </div>
        </section>
        
        <LocalCTA
          cityName="South Florida"
          serviceName={service.name}
          responseTime="30-60 minutes"
        />
      </main>
      <Footer />
    </>
  );
}

