import siteConfig from '@/config/site.json';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// Parse the address to extract just the street portion
// Address format: "7790 NW 55th St, Doral, FL 33166"
const fullAddress = siteConfig.address || '7790 NW 55th St, Doral, FL 33166';
const streetAddress = fullAddress.split(',')[0]?.trim() || '7790 NW 55th St';

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  const socialLinks: string[] = [];
  if (siteConfig.social?.facebook) socialLinks.push(siteConfig.social.facebook);
  if (siteConfig.social?.instagram) socialLinks.push(siteConfig.social.instagram);
  if (siteConfig.social?.youtube) socialLinks.push(siteConfig.social.youtube);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: baseUrl,
    logo: `${baseUrl}${siteConfig.logo}`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: 'Doral',
      addressRegion: 'FL',
      postalCode: '33166',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  };
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusinessSchema() {
  const socialLinks: string[] = [];
  if (siteConfig.social?.facebook) socialLinks.push(siteConfig.social.facebook);
  if (siteConfig.social?.instagram) socialLinks.push(siteConfig.social.instagram);
  if (siteConfig.social?.youtube) socialLinks.push(siteConfig.social.youtube);

  // Parse hours from siteConfig.hours
  const openingHours = siteConfig.hours
    ? [siteConfig.hours.replace(/\s+/g, ' ')]
    : ['Mo-Fr 09:00-17:00'];

  // Calculate aggregate rating from reviews
  const ratings = [
    siteConfig.reviews?.google?.rating,
    siteConfig.reviews?.yelp?.rating,
    siteConfig.reviews?.facebook?.rating,
  ].filter((r): r is number => typeof r === 'number');

  const aggregateRating = ratings.length > 0
    ? {
        '@type': 'AggregateRating',
        ratingValue: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        reviewCount: [
          siteConfig.reviews?.google?.reviewCount,
          siteConfig.reviews?.yelp?.reviewCount,
          siteConfig.reviews?.facebook?.reviewCount,
        ]
          .filter((c): c is string => typeof c === 'string')
          .reduce((sum, count) => {
            const num = parseInt(count.replace(/\D/g, ''), 10) || 0;
            return sum + num;
          }, 0),
      }
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}#organization`,
    name: siteConfig.name,
    image: `${baseUrl}${siteConfig.logo}`,
    url: baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: 'Doral',
      addressRegion: 'FL',
      postalCode: '33166',
      addressCountry: 'US',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Miami',
    },
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    aggregateRating,
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbListSchema(items: BreadcrumbItem[], pageUrl?: string) {
  // Determine the page URL for @id - use provided pageUrl or derive from last breadcrumb item
  let breadcrumbId: string;
  if (pageUrl) {
    breadcrumbId = `${pageUrl}#BreadcrumbList`;
  } else {
    const lastItem = items[items.length - 1];
    const url = lastItem ? `${baseUrl}${lastItem.href}` : baseUrl;
    breadcrumbId = `${url}#BreadcrumbList`;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };
}

/**
 * Generate Article structured data for blog posts
 */
export function generateArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
  content,
}: {
  title: string;
  description?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  content?: string;
}) {
  const articleImage = image
    ? (image.startsWith('http') ? image : `${baseUrl}${image}`)
    : `${baseUrl}${siteConfig.seo.ogImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || title,
    image: articleImage,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author || 'Total Leak Detection',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${siteConfig.logo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleBody: content,
  };
}

/**
 * Generate Service structured data
 */
export function generateServiceSchema({
  name,
  description,
  provider,
  serviceType,
  areaServed,
}: {
  name: string;
  description?: string;
  provider?: string;
  serviceType?: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: description || name,
    provider: {
      '@type': 'LocalBusiness',
      name: provider || siteConfig.name,
      '@id': `${baseUrl}#organization`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: streetAddress,
        addressLocality: 'Doral',
        addressRegion: 'FL',
        postalCode: '33166',
        addressCountry: 'US',
      },
    },
    serviceType: serviceType || 'Plumbing Service',
    areaServed: {
      '@type': areaServed ? 'City' : 'State',
      name: areaServed || 'Florida',
    },
  };
}

/**
 * Generate WebPage structured data
 */
export function generateWebPageSchema({
  title,
  description,
  url,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description || title,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: baseUrl,
    },
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbListSchema(breadcrumbs, url);
  }

  return schema;
}

/**
 * Generate CollectionPage structured data
 */
export function generateCollectionPageSchema({
  title,
  description,
  url,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description || title,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: baseUrl,
    },
    breadcrumb: breadcrumbs && breadcrumbs.length > 0
      ? generateBreadcrumbListSchema(breadcrumbs, url)
      : undefined,
  };
}

/**
 * Convert structured data object to JSON-LD script tag
 */
export function structuredDataToJsonLd(data: object): string {
  return JSON.stringify(data, null, 0);
}

