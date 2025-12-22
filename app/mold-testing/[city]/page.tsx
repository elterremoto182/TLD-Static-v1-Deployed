import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';

import {
  getService,
  getCity,
  getAllCitySlugs,
  getFaqsForService,
} from '@/lib/local-seo/data';
import {
  generateCityServiceMetaTitle,
  generateCityServiceMetaDesc,
  generateCityServiceH1,
  generateCityServiceSubheading,
  renderFaqs,
} from '@/lib/local-seo/templates';
import {
  generateCityServiceBreadcrumbs,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
  generateLocalServiceSchema,
  generateFaqSchema,
  generateHowToSchema,
  schemaToJsonLd,
} from '@/lib/local-seo/schema';
import {
  getNearbyCityLinks,
  getRelatedServiceLinks,
  getProblemLinksForService,
  getRelatedBlogLinks,
  getCityServiceCanonicalUrl,
} from '@/lib/local-seo/links';

import {
  LocalHero,
  LocalIntro,
  ServiceProcess,
  ServiceOverview,
  NeighborhoodList,
  LocalFAQ,
  LocalCTA,
  NearbyAreas,
  RelatedLinks,
} from '@/components/local-seo';

const SERVICE_SLUG = 'mold-testing';

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
    keywords: [...service.keywords, city.name, city.county],
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'website' },
  };
}

export default async function MoldTestingCityPage({
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
  
  const nearbyCityLinks = getNearbyCityLinks(citySlug, SERVICE_SLUG, 6);
  const relatedServiceLinks = getRelatedServiceLinks(SERVICE_SLUG, citySlug);
  const problemLinks = getProblemLinksForService(SERVICE_SLUG, citySlug);
  const blogLinks = getRelatedBlogLinks(SERVICE_SLUG, citySlug, 3);
  
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const localBusinessSchema = generateLocalBusinessSchema(city, service);
  const serviceSchema = generateLocalServiceSchema(service, city);
  const howToSchema = generateHowToSchema(service, city);
  const faqSchema = faqs.length > 0 ? generateFaqSchema(faqs) : null;
  
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
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(howToSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(faqSchema) }}
        />
      )}
      
      <Header />
      <main className="min-h-screen">
        <LocalHero
          title={h1}
          subtitle={subtitle}
          cityName={city.name}
          serviceName={service.name}
          responseTime={city.responseTime}
          breadcrumbs={breadcrumbs}
          backgroundImage="/images/services/mold.jpg"
        />
        
        <LocalIntro
          intro={city.intro}
          extendedContent={city.extendedContent}
          cityName={city.name}
          localFactors={city.localFactors}
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
        
        {nearbyCityLinks.length > 0 && (
          <NearbyAreas
            links={nearbyCityLinks}
            title={`${service.name} in Nearby Areas`}
            subtitle={`We also serve communities near ${city.name}`}
          />
        )}
        
        <RelatedLinks
          serviceLinks={relatedServiceLinks}
          problemLinks={problemLinks}
          blogLinks={blogLinks}
        />
        
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

