/**
 * Local SEO Schema Module
 * 
 * Re-exports schema functions from the consolidated schema module
 * with local-seo specific types imported.
 */

import type { City, Service, Problem } from './data';

// Re-export everything from the consolidated schema module
export {
  // Types
  type BreadcrumbItem,
  type SchemaGraph,
  
  // Core schema generators
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateBreadcrumbListSchema,
  generateWebPageSchema,
  generateCollectionPageSchema,
  generateServiceSchema,
  generateArticleSchema,
  generateFaqSchema,
  generateFAQSchema,
  generateHowToSchema,
  
  // Local-SEO specific
  generateLocalServiceSchema,
  generateCityServiceBreadcrumbs,
  generateProblemCityBreadcrumbs,
  generateServiceHubBreadcrumbs,
  generateProblemHubBreadcrumbs,
  
  // Graph builder
  buildPageSchemaGraph,
  
  // Utilities
  schemaToJsonLd,
  structuredDataToJsonLd,
  parseAddress,
  baseUrl,
} from '@/lib/seo/schema';

// Re-export the local business schema with proper typing for local-seo usage
import { generateLocalBusinessSchema as baseGenerateLocalBusinessSchema } from '@/lib/seo/schema';

/**
 * Generate LocalBusiness schema with city-specific information
 * Wrapper for local-seo pages that takes City and Service objects
 * 
 * For problem × city pages, excludes reviews/ratings to avoid schema misinterpretation
 */
export function generateLocalBusinessSchema(city: City, service?: Service, includeReviews?: boolean) {
  return baseGenerateLocalBusinessSchema({
    city: {
      name: city.name,
      county: city.county,
      coordinates: city.coordinates,
    },
    service: service ? { name: service.name } : undefined,
    includeReviews: includeReviews !== undefined ? includeReviews : false, // Default false for city pages
  });
}

// Type exports for local-seo
export type { City, Service, Problem };
