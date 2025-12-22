import type { City, Service, Problem, FAQ } from './data';
import siteConfig from '@/config/site.json';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Generate LocalBusiness schema with city-specific information
 */
export function generateLocalBusinessSchema(city: City, service?: Service) {
  // Parse the address to extract just the street portion
  // Address format: "7790 NW 55th St, Doral, FL 33166"
  const fullAddress = siteConfig.address || '7790 NW 55th St, Doral, FL 33166';
  const streetAddress = fullAddress.split(',')[0]?.trim() || '7790 NW 55th St';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}#organization`,
    name: siteConfig.name,
    image: `${baseUrl}${siteConfig.logo}`,
    url: baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    description: service 
      ? `Professional ${service.name.toLowerCase()} services in ${city.name}, ${city.county}, Florida.`
      : `Professional leak detection and plumbing services in ${city.name}, ${city.county}, Florida.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: 'Doral',
      addressRegion: 'FL',
      postalCode: '33166',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: city.county,
      },
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
        description: '24/7 Emergency Service Available',
      },
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Check', 'Insurance'],
  };
}

/**
 * Generate Service schema for city × service pages
 */
export function generateLocalServiceSchema(service: Service, city: City) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${city.name}, FL`,
    description: service.bodyContent.overview,
    provider: {
      '@type': 'LocalBusiness',
      name: siteConfig.name,
      '@id': `${baseUrl}#organization`,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: city.county,
      },
    },
    serviceType: service.name,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/${service.slug}/${city.slug}/`,
      servicePhone: siteConfig.phone,
      availableLanguage: ['English', 'Spanish'],
    },
  };
}

/**
 * Generate FAQ schema for city × service pages
 */
export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  if (faqs.length === 0) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate HowTo schema for service process steps
 */
export function generateHowToSchema(service: Service, city: City) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How ${service.name} Works in ${city.name}, FL`,
    description: `Our ${service.name.toLowerCase()} process for ${city.name} properties`,
    step: service.process.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
    totalTime: 'PT2H',
    tool: service.bodyContent.technology.map(tech => ({
      '@type': 'HowToTool',
      name: tech.name,
    })),
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };
}

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema(options: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.title,
    description: options.description,
    url: options.url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: baseUrl,
    },
  };

  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(options.breadcrumbs);
  }

  return schema;
}

/**
 * Generate breadcrumb items for city × service page
 */
export function generateCityServiceBreadcrumbs(service: Service, city: City): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: service.name, href: `/${service.slug}/` },
    { label: city.name, href: `/${service.slug}/${city.slug}/` },
  ];
}

/**
 * Generate breadcrumb items for problem × city page
 */
export function generateProblemCityBreadcrumbs(problem: Problem, city: City): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Problems', href: '/problems/' },
    { label: problem.name, href: `/problems/${problem.slug}/` },
    { label: city.name, href: `/problems/${problem.slug}/${city.slug}/` },
  ];
}

/**
 * Generate breadcrumb items for service hub page
 */
export function generateServiceHubBreadcrumbs(service: Service): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: service.name, href: `/${service.slug}/` },
  ];
}

/**
 * Generate breadcrumb items for problem hub page
 */
export function generateProblemHubBreadcrumbs(problem: Problem): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Problems', href: '/problems/' },
    { label: problem.name, href: `/problems/${problem.slug}/` },
  ];
}

/**
 * Convert schema object to JSON-LD string
 */
export function schemaToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 0);
}

