import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';

import {
  getService,
  getCity,
  getAllCitySlugs,
  getFaqsForService,
  getCityServiceVideo,
} from '@/lib/local-seo/data';
import {
  generateCityServiceMetaTitle,
  generateCityServiceMetaDesc,
  generateCityServiceH1,
  generateCityServiceSubheading,
  renderFaqs,
  generateFocusedKeywords,
} from '@/lib/local-seo/templates';
import {
  generateCityServiceBreadcrumbs,
  schemaToJsonLd,
} from '@/lib/local-seo/schema';
import { buildPageSchemaGraph } from '@/lib/seo/schema';
import { getCityServiceCanonicalUrl } from '@/lib/local-seo/links';

import {
  LocalHero,
  LocalIntro,
  ServiceProcess,
  ServiceOverview,
  NeighborhoodList,
  LocalFAQ,
  LocalCTA,
  ServiceVideoEmbed,
  RealWorkGallery,
} from '@/components/local-seo';

const SERVICE_SLUG = 'sewer-camera-inspection';

export async function generateStaticParams() {
  const citySlugs = getAllCitySlugs();
  return citySlugs.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: { city: string } | Promise<{ city: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const citySlug = resolvedParams?.city;
  
  const service = getService(SERVICE_SLUG);
  const city = citySlug ? getCity(citySlug) : null;
  
  if (!service || !city) {
    return { title: 'Page Not Found' };
  }
  
  const title = generateCityServiceMetaTitle(service, city);
  const description = generateCityServiceMetaDesc(service, city);
  const canonicalUrl = getCityServiceCanonicalUrl(SERVICE_SLUG, citySlug);
  
  return {
    title,
    description,
    keywords: generateFocusedKeywords(service, city),
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'website' },
  };
}

export default async function SewerCameraInspectionCityPage({
  params,
}: {
  params: { city: string } | Promise<{ city: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const citySlug = resolvedParams?.city;
  
  const service = getService(SERVICE_SLUG);
  const city = citySlug ? getCity(citySlug) : null;
  
  if (!service || !city) notFound();
  
  const h1 = generateCityServiceH1(service, city);
  const subtitle = generateCityServiceSubheading(service, city);
  const breadcrumbs = generateCityServiceBreadcrumbs(service, city);
  
  const baseFaqs = getFaqsForService(SERVICE_SLUG);
  const faqs = renderFaqs(baseFaqs, city);
  const videoConfig = getCityServiceVideo(SERVICE_SLUG, citySlug);
  
  const canonicalUrl = getCityServiceCanonicalUrl(SERVICE_SLUG, citySlug);
  
  // Build unified schema graph with all structured data
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'city-service',
    pageUrl: canonicalUrl,
    title: h1,
    description: subtitle,
    breadcrumbs,
    service: {
      name: service.name,
      description: service.bodyContent.overview,
      serviceType: service.name,
    },
    city: {
      name: city.name,
      county: city.county,
      coordinates: city.coordinates,
      slug: city.slug,
    },
    faqs: faqs.length > 0 ? faqs : undefined,
    process: service.process,
    technology: service.bodyContent.technology,
  });
  
  return (
    <>
      {/* Unified structured data with @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(schemaGraph) }}
      />
      
      <Header />
      <main className="min-h-screen">
        <LocalHero
          title={h1}
          subtitle={subtitle}
          cityName={city.name}
          serviceName={service.name}
          responseTime={city.responseTime}
          breadcrumbs={breadcrumbs}
          backgroundImage="/images/services/drain-cleaning.jpg"
        />
        
        <LocalIntro
          intro={city.intro}
          extendedContent={city.extendedContent}
          cityName={city.name}
          localFactors={city.localFactors}
          uniqueContent={city.uniqueContent}
          localStats={city.localStats}
        />
        
        {/* Real Work Gallery - Early for trust building */}
        <RealWorkGallery 
          serviceSlug="sewer-camera-inspection" 
          variant="compact"
          cityName={city.name}
        />
        
        <ServiceOverview
          overview={service.bodyContent.overview}
          whyImportant={service.bodyContent.whyImportant}
          technology={service.bodyContent.technology}
          commonSigns={service.bodyContent.commonSigns}
          whyChooseUs={service.bodyContent.whyChooseUs}
          cityName={city.name}
          serviceName={service.name}
        />
        
        <ServiceProcess
          steps={service.process}
          title={`Our ${service.name} Process`}
          subtitle={`How we deliver results for ${city.name} properties`}
        />
        
        {videoConfig && (
          <ServiceVideoEmbed 
            videoUrl={videoConfig.url!}
            title={`${service.name} in ${city.name}`}
          />
        )}
        
        <NeighborhoodList
          neighborhoods={city.neighborhoods}
          zipCodes={city.zipCodes}
          cityName={city.name}
          serviceName={service.name}
        />
        
        {faqs.length > 0 && (
          <LocalFAQ
            faqs={faqs}
            title={`${service.name} FAQs for ${city.name}`}
            subtitle="Get answers to common questions about our services"
          />
        )}
        
        <LocalCTA
          cityName={city.name}
          serviceName={service.name}
          responseTime={city.responseTime}
        />
      </main>
      <Footer />
    </>
  );
}
