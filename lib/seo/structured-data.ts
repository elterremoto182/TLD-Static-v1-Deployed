/**
 * @deprecated This file is deprecated. Import from '@/lib/seo/schema' instead.
 * Re-exports are provided for backward compatibility.
 */

// Re-export everything from the consolidated schema module
export {
  // Types
  type BreadcrumbItem,
  type SchemaGraph,
  type VideoObjectSchema,
  
  // Core schema generators
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbListSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateCollectionPageSchema,
  generateServiceSchema,
  generateArticleSchema,
  generateFaqSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateVideoObjectSchema,
  
  // Graph builder
  buildPageSchemaGraph,
  
  // Utilities
  schemaToJsonLd,
  structuredDataToJsonLd,
  parseAddress,
  baseUrl,
} from './schema';
