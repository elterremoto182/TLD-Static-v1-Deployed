import { 
  getCity, 
  getService, 
  getProblem,
  getNearbyCities, 
  getRelatedServices,
  getProblemsByService,
  getAllServices,
  type City, 
  type Service, 
  type Problem 
} from './data';

export interface InternalLink {
  href: string;
  label: string;
  description?: string;
}

/**
 * Generate links to nearby city pages for the same service
 */
export function getNearbyCityLinks(
  currentCitySlug: string, 
  serviceSlug: string,
  limit: number = 5
): InternalLink[] {
  const nearbyCities = getNearbyCities(currentCitySlug, limit);
  const service = getService(serviceSlug);
  
  if (!service) return [];
  
  return nearbyCities.map(city => ({
    href: `/${serviceSlug}/${city.slug}/`,
    label: `${service.name} in ${city.name}`,
    description: `Professional ${service.name.toLowerCase()} services in ${city.name}, ${city.county}`,
  }));
}

/**
 * Generate links to other services for the same city
 */
export function getRelatedServiceLinks(
  currentServiceSlug: string,
  citySlug: string
): InternalLink[] {
  const city = getCity(citySlug);
  const relatedServices = getRelatedServices(currentServiceSlug);
  
  if (!city) return [];
  
  return relatedServices.map(service => ({
    href: `/${service.slug}/${citySlug}/`,
    label: `${service.name} in ${city.name}`,
    description: service.bodyContent.overview.substring(0, 100) + '...',
  }));
}

/**
 * Generate links to problem pages for a service in a specific city
 */
export function getProblemLinksForService(
  serviceSlug: string,
  citySlug: string
): InternalLink[] {
  const city = getCity(citySlug);
  const problems = getProblemsByService(serviceSlug);
  
  if (!city) return [];
  
  return problems.map(problem => ({
    href: `/problems/${problem.slug}/${citySlug}/`,
    label: `${problem.name} in ${city.name}`,
    description: problem.overview.substring(0, 100) + '...',
  }));
}

/**
 * Generate links to all cities for a service (for service hub page)
 */
export function getAllCityLinksForService(
  serviceSlug: string,
  cities: City[]
): InternalLink[] {
  const service = getService(serviceSlug);
  if (!service) return [];
  
  return cities.map(city => ({
    href: `/${serviceSlug}/${city.slug}/`,
    label: city.name,
    description: `${service.name} in ${city.name}, ${city.county}`,
  }));
}

/**
 * Generate links to all services for a city (for city landing page if needed)
 */
export function getAllServiceLinksForCity(citySlug: string): InternalLink[] {
  const city = getCity(citySlug);
  const services = getAllServices();
  
  if (!city) return [];
  
  return services.map(service => ({
    href: `/${service.slug}/${citySlug}/`,
    label: service.name,
    description: `Professional ${service.name.toLowerCase()} in ${city.name}`,
  }));
}

/**
 * Generate links to related blog posts (placeholder - would connect to blog system)
 */
export function getRelatedBlogLinks(
  serviceSlug: string,
  citySlug: string,
  limit: number = 3
): InternalLink[] {
  // This would typically query the blog system for related posts
  // For now, return some static relevant blog links
  // Note: Blog posts are served at root level (e.g., /slug/) not under /blog/
  const blogLinks: Record<string, InternalLink[]> = {
    'leak-detection': [
      {
        href: '/the-importance-of-professional-leak-detection-in-preventing-water-damage/',
        label: 'The Importance of Professional Leak Detection',
        description: 'Learn why early detection saves thousands in repair costs.',
      },
      {
        href: '/advanced-techniques-for-detecting-and-repairing-leaks-beneath-concrete-foundations/',
        label: 'Detecting Leaks Under Concrete Foundations',
        description: 'Advanced techniques for slab leak detection.',
      },
      {
        href: '/how-to-check-shower-pan-leaks/',
        label: 'How to Check for Shower Pan Leaks',
        description: 'DIY tips and when to call professionals.',
      },
    ],
    'mold-testing': [
      {
        href: '/how-mold-inspection-can-improve-your-indoor-air-quality/',
        label: 'How Mold Inspection Improves Indoor Air Quality',
        description: 'The connection between mold testing and healthy air.',
      },
      {
        href: '/what-is-a-post-remediation-verification/',
        label: 'What is Post-Remediation Verification?',
        description: 'Ensuring mold removal was successful.',
      },
      {
        href: '/7-simple-steps-to-do-a-mold-test/',
        label: '7 Simple Steps to Do a Mold Test',
        description: 'Understanding the mold testing process.',
      },
    ],
    'sewer-camera-inspection': [
      {
        href: '/the-benefits-of-sewer-camera-inspections-for-miami-homeowners/',
        label: 'Benefits of Sewer Camera Inspections',
        description: 'Why camera inspection is essential for homeowners.',
      },
      {
        href: '/how-much-does-a-sewer-line-camera-inspection-cost/',
        label: 'Sewer Camera Inspection Cost Guide',
        description: 'What to expect for pricing and value.',
      },
      {
        href: '/what-to-expect-during-a-sewer-camera-inspection-in-miami-fl/',
        label: 'What to Expect During Sewer Camera Inspection',
        description: 'A walkthrough of the inspection process.',
      },
    ],
  };
  
  return (blogLinks[serviceSlug] || []).slice(0, limit);
}

/**
 * Generate canonical URL for city × service page
 */
export function getCityServiceCanonicalUrl(serviceSlug: string, citySlug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  return `${baseUrl}/${serviceSlug}/${citySlug}/`;
}

/**
 * Generate canonical URL for problem × city page
 */
export function getProblemCityCanonicalUrl(problemSlug: string, citySlug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  return `${baseUrl}/problems/${problemSlug}/${citySlug}/`;
}

/**
 * Generate canonical URL for service hub page
 */
export function getServiceHubCanonicalUrl(serviceSlug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  return `${baseUrl}/${serviceSlug}/`;
}

/**
 * Group cities by county for display
 */
export function groupCitiesByCounty(cities: City[]): Record<string, City[]> {
  return cities.reduce((acc, city) => {
    const county = city.county;
    if (!acc[county]) {
      acc[county] = [];
    }
    acc[county].push(city);
    return acc;
  }, {} as Record<string, City[]>);
}

