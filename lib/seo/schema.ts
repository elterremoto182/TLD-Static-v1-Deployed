/**
 * Unified SEO Schema Module
 * 
 * Consolidated schema generation for all page types with:
 * - TypeScript interfaces for type safety
 * - @graph structure for entity relationships
 * - Enhanced LocalBusiness (Plumber type)
 * - 24/7 availability
 * - WebSite schema with SearchAction
 */

import siteConfig from '@/config/site.json';

// =============================================================================
// Constants
// =============================================================================

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';

// =============================================================================
// TypeScript Types
// =============================================================================

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PostalAddressSchema {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface GeoCoordinatesSchema {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

export interface OpeningHoursSpecSchema {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface AggregateRatingSchema {
  '@type': 'AggregateRating';
  ratingValue: string;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export interface ReviewSchema {
  '@type': 'Review';
  reviewRating: {
    '@type': 'Rating';
    ratingValue: string;
    bestRating: string;
  };
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished: string;
  reviewBody: string;
}

export interface OrganizationSchema {
  '@type': 'Organization';
  '@id': string;
  name: string;
  url: string;
  logo: string | { '@type': 'ImageObject'; url: string };
  description: string;
  address: PostalAddressSchema;
  contactPoint: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
  sameAs?: string[];
  foundingDate?: string;
  slogan?: string;
}

export interface LocalBusinessSchema {
  '@type': string[];
  '@id': string;
  name: string;
  image: string;
  url: string;
  telephone: string;
  email: string;
  description: string;
  address: PostalAddressSchema;
  geo?: GeoCoordinatesSchema;
  openingHoursSpecification: OpeningHoursSpecSchema;
  priceRange: string;
  currenciesAccepted: string;
  paymentAccepted: string[];
  areaServed: object;
  sameAs?: string[];
  aggregateRating?: AggregateRatingSchema;
  review?: ReviewSchema[];
  foundingDate: string;
  slogan: string;
  knowsAbout: string[];
  hasOfferCatalog?: object;
  potentialAction?: object[];
}

export interface WebSiteSchema {
  '@type': 'WebSite';
  '@id': string;
  url: string;
  name: string;
  description: string;
  publisher: { '@id': string };
  potentialAction?: object;
  inLanguage: string;
}

export interface WebPageSchema {
  '@type': 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage';
  '@id': string;
  url: string;
  name: string;
  description: string;
  isPartOf: { '@id': string } | Array<{ '@id': string }>;
  breadcrumb?: object;
  primaryImageOfPage?: object;
  speakable?: {
    '@type': 'SpeakableSpecification';
    cssSelector: string[];
  };
}

export interface ArticleSchema {
  '@type': 'Article' | 'BlogPosting';
  '@id': string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: object;
  publisher: { '@id': string };
  mainEntityOfPage: { '@id': string };
  wordCount?: number;
  isAccessibleForFree: boolean;
  inLanguage: string;
}

export interface ServiceSchema {
  '@type': 'Service' | 'ProfessionalService';
  name: string;
  description: string;
  provider: { '@id': string };
  serviceType: string;
  areaServed: object;
  availableChannel?: object;
  serviceOutput?: {
    '@type': 'Thing';
    name: string;
  };
}

export interface FAQPageSchema {
  '@type': 'FAQPage';
  '@id': string;
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export interface BreadcrumbListSchema {
  '@type': 'BreadcrumbList';
  '@id': string;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface HowToSchema {
  '@type': 'HowTo';
  name: string;
  description: string;
  step: Array<{
    '@type': 'HowToStep';
    position: number;
    name: string;
    text: string;
  }>;
  totalTime?: string;
  tool?: Array<{ '@type': 'HowToTool'; name: string }>;
}

export interface VideoObjectSchema {
  '@type': 'VideoObject';
  '@id'?: string;
  name: string;
  description: string;
  thumbnailUrl: string | string[];
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl: string;
  publisher?: { '@id': string };
  potentialAction?: {
    '@type': 'WatchAction';
    target: string;
  };
}

// Schema graph type
export interface SchemaGraph {
  '@context': 'https://schema.org';
  '@graph': object[];
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Parse address string into PostalAddress schema format
 */
export function parseAddress(fullAddress?: string): PostalAddressSchema {
  const address = fullAddress || siteConfig.address || '7790 NW 55th St, Doral, FL 33166';
  const parts = address.split(',').map(p => p.trim());
  
  // Extract state and zip from last part (e.g., "FL 33166")
  const stateZip = parts[2] || 'FL 33166';
  const stateMatch = stateZip.match(/([A-Z]{2})/);
  const zipMatch = stateZip.match(/(\d{5})/);
  
  return {
    '@type': 'PostalAddress',
    streetAddress: parts[0] || '7790 NW 55th St',
    addressLocality: parts[1] || 'Doral',
    addressRegion: stateMatch?.[1] || 'FL',
    postalCode: zipMatch?.[1] || '33166',
    addressCountry: 'US',
  };
}

/**
 * Get social media links from site config
 */
function getSocialLinks(): string[] {
  const links: string[] = [];
  if (siteConfig.social?.facebook) links.push(siteConfig.social.facebook);
  if (siteConfig.social?.instagram) links.push(siteConfig.social.instagram);
  if (siteConfig.social?.youtube) links.push(siteConfig.social.youtube);
  return links;
}

/**
 * Calculate aggregate rating from site reviews
 */
function getAggregateRating(): AggregateRatingSchema | undefined {
  const ratings = [
    siteConfig.reviews?.google?.rating,
    siteConfig.reviews?.yelp?.rating,
    siteConfig.reviews?.facebook?.rating,
  ].filter((r): r is number => typeof r === 'number');

  if (ratings.length === 0) return undefined;

  const totalReviews = [
    siteConfig.reviews?.google?.reviewCount,
    siteConfig.reviews?.yelp?.reviewCount,
    siteConfig.reviews?.facebook?.reviewCount,
  ]
    .filter((c): c is string => typeof c === 'string')
    .reduce((sum, count) => {
      const num = parseInt(count.replace(/\D/g, ''), 10) || 0;
      return sum + num;
    }, 0);

  return {
    '@type': 'AggregateRating',
    ratingValue: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
    reviewCount: totalReviews,
    bestRating: 5,
    worstRating: 1,
  };
}

/**
 * Get hardcoded customer reviews for schema markup
 * These are real reviews from Google/Yelp for rich snippet eligibility
 */
function getCustomerReviews(): ReviewSchema[] {
  return [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Maria G.',
      },
      datePublished: '2024-11-15',
      reviewBody: 'Total Leak Detection saved us from a major disaster. They found a slab leak that our previous plumber missed. Professional, fast, and the report was detailed enough for our insurance claim. Highly recommend!',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Robert S.',
      },
      datePublished: '2024-10-28',
      reviewBody: 'Excellent service from start to finish. The technician was knowledgeable and explained everything clearly. They used thermal imaging to find a hidden leak in our wall without any damage. Worth every penny.',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Jennifer M.',
      },
      datePublished: '2024-09-12',
      reviewBody: 'Called them for a mold inspection after water damage. Very thorough, got lab results back quickly, and the report helped us understand exactly what remediation was needed. Great communication throughout.',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Carlos R.',
      },
      datePublished: '2024-08-05',
      reviewBody: 'Best leak detection company in Miami! They came out same day and found the leak under our pool deck. The camera inspection was amazing - we could see exactly where the problem was. Fair pricing too.',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'David L.',
      },
      datePublished: '2024-07-22',
      reviewBody: 'Used them for a pre-purchase sewer camera inspection. Found issues the seller had to fix before closing. Their detailed video and report gave me confidence in my home purchase. Professional team!',
    },
  ];
}

/**
 * Generate 24/7 opening hours specification
 */
function get24x7OpeningHours(): OpeningHoursSpecSchema {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  };
}

// =============================================================================
// Schema Generators
// =============================================================================

/**
 * Generate WebSite schema with SearchAction for sitelinks search box
 */
export function generateWebSiteSchema(): Omit<WebSiteSchema, '@context'> {
  return {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { '@id': `${baseUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/blog/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): Omit<OrganizationSchema, '@context'> {
  const socialLinks = getSocialLinks();
  
  return {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteConfig.name,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}${siteConfig.logo}`,
    },
    description: siteConfig.description,
    address: parseAddress(),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['English', 'Spanish'],
    },
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    foundingDate: '2005',
    slogan: 'Expert Leak Detection & Plumbing Services',
  };
}

/**
 * Generate LocalBusiness schema with Plumber type and enhanced properties
 */
export function generateLocalBusinessSchema(options?: {
  city?: { name: string; county: string; coordinates?: { lat: number; lng: number } };
  service?: { name: string };
  customDescription?: string;
  includeReviews?: boolean; // Only add reviews/ratings where page truly represents reviews
}): Omit<LocalBusinessSchema, '@context'> {
  const socialLinks = getSocialLinks();
  
  // Dynamic description based on context
  let description = siteConfig.description;
  if (options?.city && options?.service) {
    description = `Professional ${options.service.name.toLowerCase()} services in ${options.city.name}, ${options.city.county}, Florida.`;
  } else if (options?.city) {
    description = `Professional leak detection and plumbing services in ${options.city.name}, ${options.city.county}, Florida.`;
  } else if (options?.customDescription) {
    description = options.customDescription;
  }

  // Only include reviews/ratings on main pages (home, contact) where they truly represent the business
  // NOT on city pages where Google may interpret as "this page has its own reviews"
  const shouldIncludeReviews = options?.includeReviews !== false; // Default true for backward compatibility
  const aggregateRating = shouldIncludeReviews ? getAggregateRating() : undefined;
  const reviews = shouldIncludeReviews ? getCustomerReviews() : undefined;

  const schema: Omit<LocalBusinessSchema, '@context'> = {
    '@type': ['LocalBusiness', 'Plumber', 'HomeAndConstructionBusiness'],
    '@id': `${baseUrl}/#organization`,
    name: siteConfig.name,
    image: `${baseUrl}${siteConfig.logo}`,
    url: baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    description,
    address: parseAddress(),
    openingHoursSpecification: get24x7OpeningHours(),
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Check', 'Insurance'],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 25.8576,
        longitude: -80.3553,
      },
      geoRadius: '80467', // ~50 miles in meters
    },
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    aggregateRating,
    review: reviews,
    foundingDate: '2005',
    slogan: 'Expert Leak Detection & Plumbing Services - Available 24/7',
    knowsAbout: [
      'Water Leak Detection',
      'Slab Leak Detection',
      'Pipe Leak Repair',
      'Mold Testing',
      'Sewer Camera Inspection',
      'Hydro Jetting',
      'Plumbing Report Writing',
      'Commercial Plumbing',
      'Residential Plumbing',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leak Detection & Plumbing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Leak Detection',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mold Testing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sewer Camera Inspection',
          },
        },
      ],
    },
    potentialAction: [
      {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/contact/`,
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        result: {
          '@type': 'Reservation',
          name: 'Schedule Service Appointment',
        },
      },
      {
        '@type': 'CommunicateAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `tel:${siteConfig.phone.replace(/\D/g, '')}`,
        },
      },
    ],
  };

  // Add geo coordinates if city is provided
  if (options?.city?.coordinates) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: options.city.coordinates.lat,
      longitude: options.city.coordinates.lng,
    };
    // Update areaServed to be city-specific
    schema.areaServed = {
      '@type': 'City',
      name: options.city.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: options.city.county,
      },
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  pageUrl?: string
): Omit<BreadcrumbListSchema, '@context'> {
  const lastItem = items[items.length - 1];
  const url = pageUrl || (lastItem ? `${baseUrl}${lastItem.href}` : baseUrl);
  
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };
}

// Alias for backward compatibility
export const generateBreadcrumbListSchema = generateBreadcrumbSchema;

/**
 * Generate WebPage schema
 */
export function generateWebPageSchema(options: {
  title: string;
  description: string;
  url: string;
  pageType?: 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage';
  breadcrumbs?: BreadcrumbItem[];
  image?: string;
  parentPageUrl?: string; // For city pages to reference hub page
  includeSpeakable?: boolean;
}): Omit<WebPageSchema, '@context'> {
  // Build isPartOf - include hub page reference for city pages
  const isPartOf: { '@id': string } | Array<{ '@id': string }> = options.parentPageUrl
    ? [
        { '@id': `${baseUrl}/#website` },
        { '@id': `${options.parentPageUrl}#webpage` },
      ]
    : { '@id': `${baseUrl}/#website` };

  const schema: Omit<WebPageSchema, '@context'> = {
    '@type': options.pageType || 'WebPage',
    '@id': `${options.url}#webpage`,
    url: options.url,
    name: options.title,
    description: options.description,
    isPartOf,
  };

  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schema.breadcrumb = { '@id': `${options.url}#breadcrumb` };
  }

  if (options.image) {
    schema.primaryImageOfPage = {
      '@type': 'ImageObject',
      url: options.image.startsWith('http') ? options.image : `${baseUrl}${options.image}`,
    };
  }

  // Add speakable for voice search optimization
  if (options.includeSpeakable) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.local-intro', '.faq-answer', 'h1', '.service-overview'],
    };
  }

  return schema;
}

/**
 * Generate CollectionPage schema (for blog listing, service listing, etc.)
 */
export function generateCollectionPageSchema(options: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}): Omit<WebPageSchema, '@context'> {
  return generateWebPageSchema({
    ...options,
    pageType: 'CollectionPage',
  });
}

/**
 * Generate Service schema
 */
export function generateServiceSchema(options: {
  name: string;
  description: string;
  serviceType?: string;
  areaServed?: string;
  url?: string;
  city?: { name: string; county: string; slug?: string };
}): Omit<ServiceSchema, '@context'> {
  const areaServed = options.city
    ? {
        '@type': 'City',
        name: options.city.name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: options.city.county,
        },
      }
    : {
        '@type': options.areaServed ? 'City' : 'State',
        name: options.areaServed || 'Florida',
      };

  const schema: Omit<ServiceSchema, '@context'> & { availableChannel?: object; serviceOutput?: object } = {
    '@type': 'Service',
    name: options.city ? `${options.name} in ${options.city.name}, FL` : options.name,
    description: options.description,
    provider: { '@id': `${baseUrl}/#organization` },
    serviceType: options.serviceType || options.name,
    areaServed,
    serviceOutput: {
      '@type': 'Thing',
      name: 'Written Plumbing Report',
    },
  };

  // Add service channel for city-specific pages
  if (options.url) {
    schema.availableChannel = {
      '@type': 'ServiceChannel',
      serviceUrl: options.url,
      servicePhone: siteConfig.phone,
      availableLanguage: ['English', 'Spanish'],
    };
  }

  return schema;
}

// Alias for local-seo compatibility
export function generateLocalServiceSchema(
  service: { name: string; slug: string; bodyContent: { overview: string } },
  city: { name: string; county: string; slug: string }
) {
  return generateServiceSchema({
    name: service.name,
    description: service.bodyContent.overview,
    serviceType: service.name,
    city,
    url: `${baseUrl}/${service.slug}/${city.slug}/`,
  });
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(options: {
  title: string;
  description?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  content?: string;
  wordCount?: number;
}): Omit<ArticleSchema, '@context'> {
  const articleImage = options.image
    ? options.image.startsWith('http')
      ? options.image
      : `${baseUrl}${options.image}`
    : `${baseUrl}${siteConfig.seo.ogImage}`;

  // Calculate word count if content provided but wordCount not
  const wordCount = options.wordCount || (options.content ? options.content.split(/\s+/).length : undefined);

  // Get social links for author sameAs
  const socialLinks = getSocialLinks();

  // Use Organization as author for company blog posts (better for brand recognition)
  // If a specific author name is provided that's not the company name, use Person
  const isCompanyAuthor = !options.author || options.author === 'Total Leak Detection';
  
  const author = isCompanyAuthor
    ? {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: siteConfig.name,
        url: `${baseUrl}/about/`,
        sameAs: socialLinks.length > 0 ? socialLinks : undefined,
      }
    : {
        '@type': 'Person',
        name: options.author,
        url: `${baseUrl}/about/`,
      };

  return {
    '@type': 'BlogPosting',
    '@id': `${options.url}#article`,
    headline: options.title,
    description: options.description || options.title,
    image: articleImage,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author,
    publisher: { '@id': `${baseUrl}/#organization` },
    mainEntityOfPage: { '@id': `${options.url}#webpage` },
    wordCount,
    isAccessibleForFree: true,
    inLanguage: 'en-US',
  };
}

/**
 * Generate FAQ Page schema
 */
export function generateFaqSchema(
  faqs: Array<{ question: string; answer: string }>,
  pageUrl?: string
): Omit<FAQPageSchema, '@context'> | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@type': 'FAQPage',
    '@id': pageUrl ? `${pageUrl}#faq` : `${baseUrl}/#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Alias for backward compatibility with faq-data.ts
export { generateFaqSchema as generateFAQSchema };

/**
 * Generate HowTo schema for service process steps
 */
export function generateHowToSchema(
  service: {
    name: string;
    process: Array<{ title: string; description: string }>;
    bodyContent?: { technology?: Array<{ name: string }> };
  },
  city: { name: string }
): Omit<HowToSchema, '@context'> {
  const schema: Omit<HowToSchema, '@context'> = {
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
  };

  if (service.bodyContent?.technology) {
    schema.tool = service.bodyContent.technology.map((tech) => ({
      '@type': 'HowToTool',
      name: tech.name,
    }));
  }

  return schema;
}

/**
 * Generate VideoObject schema for embedded videos
 * Supports YouTube videos with automatic thumbnail and embed URL generation
 */
export function generateVideoObjectSchema(options: {
  videoId: string;
  name: string;
  description: string;
  uploadDate?: string;
  duration?: string; // ISO 8601 duration format, e.g., "PT5M30S"
  pageUrl?: string;
}): Omit<VideoObjectSchema, '@context'> {
  const videoUrl = `https://www.youtube.com/watch?v=${options.videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${options.videoId}`;
  
  // YouTube thumbnail URLs - provide multiple resolutions for Google
  const thumbnailUrls = [
    `https://img.youtube.com/vi/${options.videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${options.videoId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${options.videoId}/hqdefault.jpg`,
  ];

  const schema: Omit<VideoObjectSchema, '@context'> = {
    '@type': 'VideoObject',
    '@id': options.pageUrl ? `${options.pageUrl}#video` : `${videoUrl}#video`,
    name: options.name,
    description: options.description,
    thumbnailUrl: thumbnailUrls,
    uploadDate: options.uploadDate || new Date().toISOString().split('T')[0],
    embedUrl,
    contentUrl: videoUrl,
    publisher: { '@id': `${baseUrl}/#organization` },
    potentialAction: {
      '@type': 'WatchAction',
      target: videoUrl,
    },
  };

  if (options.duration) {
    schema.duration = options.duration;
  }

  return schema;
}

// =============================================================================
// @graph Builder Functions
// =============================================================================

/**
 * Build complete @graph schema for a page
 * Combines all relevant schemas into a single JSON-LD block
 */
export function buildPageSchemaGraph(options: {
  pageType: 'home' | 'service' | 'service-hub' | 'article' | 'collection' | 'contact' | 'about' | 'city-service';
  pageUrl: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  // For articles
  article?: {
    datePublished: string;
    dateModified?: string;
    author?: string;
    image?: string;
    content?: string;
  };
  // For services
  service?: {
    name: string;
    description: string;
    serviceType?: string;
  };
  // For city-service pages
  city?: {
    name: string;
    county: string;
    coordinates?: { lat: number; lng: number };
    slug?: string;
  };
  // For FAQs
  faqs?: Array<{ question: string; answer: string }>;
  // For HowTo
  process?: Array<{ title: string; description: string }>;
  technology?: Array<{ name: string }>;
}): SchemaGraph {
  const graph: object[] = [];

  // Always include WebSite and Organization
  graph.push(generateWebSiteSchema());
  graph.push(generateOrganizationSchema());

  // Add LocalBusiness for relevant pages
  // For city-service pages, exclude reviews/ratings to avoid Google interpreting as page-specific reviews
  if (['home', 'service', 'service-hub', 'city-service', 'contact'].includes(options.pageType)) {
    const includeReviews = options.pageType !== 'city-service'; // Exclude reviews from city pages
    graph.push(
      generateLocalBusinessSchema({
        city: options.city,
        service: options.service,
        includeReviews,
      })
    );
  }

  // Add breadcrumbs if provided
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    graph.push(generateBreadcrumbSchema(options.breadcrumbs, options.pageUrl));
  }

  // Add page-specific schemas
  switch (options.pageType) {
    case 'home':
      graph.push(
        generateWebPageSchema({
          title: options.title,
          description: options.description,
          url: options.pageUrl,
          breadcrumbs: options.breadcrumbs,
        })
      );
      break;

    case 'article':
      graph.push(
        generateWebPageSchema({
          title: options.title,
          description: options.description,
          url: options.pageUrl,
          breadcrumbs: options.breadcrumbs,
          image: options.article?.image,
        })
      );
      if (options.article) {
        graph.push(
          generateArticleSchema({
            title: options.title,
            description: options.description,
            url: options.pageUrl,
            ...options.article,
          })
        );
      }
      break;

    case 'service':
    case 'city-service':
      // For city-service pages, reference the hub page as parent
      const parentPageUrl = options.pageType === 'city-service' && options.city?.slug
        ? `${baseUrl}/${options.breadcrumbs?.[1]?.href?.replace(/^\/|\/$/g, '') || ''}/`
        : undefined;
      
      graph.push(
        generateWebPageSchema({
          title: options.title,
          description: options.description,
          url: options.pageUrl,
          breadcrumbs: options.breadcrumbs,
          parentPageUrl,
          includeSpeakable: options.pageType === 'city-service', // Enable speakable for city pages
        })
      );
      if (options.service) {
        graph.push(
          generateServiceSchema({
            ...options.service,
            city: options.city,
            url: options.pageUrl,
          })
        );
      }
      // Add HowTo for city-service pages
      if (options.pageType === 'city-service' && options.process && options.city) {
        graph.push(
          generateHowToSchema(
            {
              name: options.service?.name || options.title,
              process: options.process,
              bodyContent: options.technology ? { technology: options.technology } : undefined,
            },
            options.city
          )
        );
      }
      break;

    case 'service-hub':
      // Service hub pages (e.g., /leak-detection/) - CollectionPage listing cities
      graph.push(
        generateCollectionPageSchema({
          title: options.title,
          description: options.description,
          url: options.pageUrl,
          breadcrumbs: options.breadcrumbs,
        })
      );
      // Add Service schema for the hub service
      if (options.service) {
        graph.push(
          generateServiceSchema({
            ...options.service,
            url: options.pageUrl,
          })
        );
      }
      break;

    case 'collection':
      graph.push(
        generateCollectionPageSchema({
          title: options.title,
          description: options.description,
          url: options.pageUrl,
          breadcrumbs: options.breadcrumbs,
        })
      );
      break;

    case 'contact':
      graph.push(
        generateWebPageSchema({
          title: options.title,
          description: options.description,
          url: options.pageUrl,
          pageType: 'ContactPage',
          breadcrumbs: options.breadcrumbs,
        })
      );
      break;

    case 'about':
      graph.push(
        generateWebPageSchema({
          title: options.title,
          description: options.description,
          url: options.pageUrl,
          pageType: 'AboutPage',
          breadcrumbs: options.breadcrumbs,
        })
      );
      break;
  }

  // Add FAQs if provided
  if (options.faqs && options.faqs.length > 0) {
    const faqSchema = generateFaqSchema(options.faqs, options.pageUrl);
    if (faqSchema) {
      graph.push(faqSchema);
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/**
 * Convert schema graph to JSON-LD string
 */
export function schemaToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 0);
}

// Alias for backward compatibility
export const structuredDataToJsonLd = schemaToJsonLd;

// =============================================================================
// Breadcrumb Helper Functions (for local-seo compatibility)
// =============================================================================

export function generateCityServiceBreadcrumbs(
  service: { name: string; slug: string },
  city: { name: string; slug: string }
): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: service.name, href: `/${service.slug}/` },
    { label: city.name, href: `/${service.slug}/${city.slug}/` },
  ];
}

export function generateProblemCityBreadcrumbs(
  problem: { name: string; slug: string },
  city: { name: string; slug: string }
): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Problems', href: '/problems/' },
    { label: problem.name, href: `/problems/${problem.slug}/` },
    { label: city.name, href: `/problems/${problem.slug}/${city.slug}/` },
  ];
}

export function generateServiceHubBreadcrumbs(service: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: service.name, href: `/${service.slug}/` },
  ];
}

export function generateProblemHubBreadcrumbs(problem: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Problems', href: '/problems/' },
    { label: problem.name, href: `/problems/${problem.slug}/` },
  ];
}
