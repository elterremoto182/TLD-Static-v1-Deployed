import citiesData from '@/config/local-seo/cities.json';
import servicesData from '@/config/local-seo/services.json';
import problemsData from '@/config/local-seo/problems.json';
import faqsData from '@/config/local-seo/faqs.json';
import videosData from '@/config/local-seo/videos.json';

// Type definitions
export interface CityLocalFactors {
  climate: string;
  risks: string[];
  characteristics: string;
}

export interface CityUniqueContent {
  whyChooseUsLocal?: string;
  localExpertise?: string;
  testimonialHighlight?: string;
}

export interface CityLocalStats {
  yearsServing?: number;
  jobsCompleted?: string;
  avgResponseMins?: number;
}

export interface City {
  name: string;
  slug: string;
  county: string;
  state: string;
  coordinates: { lat: number; lng: number };
  neighborhoods: string[];
  zipCodes: string[];
  responseTime: string;
  localFactors: CityLocalFactors;
  intro: string;
  extendedContent: string;
  nearbyAreas: string[];
  uniqueContent?: CityUniqueContent;
  localStats?: CityLocalStats;
  customFaqs?: FAQ[];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface Technology {
  name: string;
  description: string;
}

export interface ServiceBodyContent {
  overview: string;
  whyImportant: string;
  technology: Technology[];
  commonSigns: string[];
  whyChooseUs: string[];
  whenNeeded?: string[];
}

export interface ServiceHubContent {
  intro: string;
  serviceAreas: string;
  callToAction: string;
}

export interface Service {
  name: string;
  slug: string;
  icon: string;
  metaTitleTemplate: string;
  metaDescTemplate: string;
  h1Template: string;
  subheadingTemplate: string;
  keywords: string[];
  process: ProcessStep[];
  problems: string[];
  bodyContent: ServiceBodyContent;
  hubContent: ServiceHubContent;
}

export interface Problem {
  name: string;
  slug: string;
  parentService: string;
  icon: string;
  metaTitleTemplate: string;
  metaDescTemplate: string;
  h1Template: string;
  keywords: string[];
  overview: string;
  symptoms: string[];
  causes: string[];
  whyUrgent: string;
  ourApproach: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

// Type the imported data
const cities = citiesData as Record<string, City>;
const services = servicesData as Record<string, Service>;
const problems = problemsData as Record<string, Problem>;
const faqs = faqsData as Record<string, FAQ[]>;

// Valid service slugs for type safety
export const VALID_SERVICE_SLUGS = ['leak-detection', 'mold-testing', 'sewer-camera-inspection'] as const;
export type ServiceSlug = typeof VALID_SERVICE_SLUGS[number];

// City access functions
export function getCity(slug: string): City | null {
  return cities[slug] || null;
}

export function getAllCities(): City[] {
  return Object.values(cities);
}

export function getAllCitySlugs(): string[] {
  return Object.keys(cities);
}

export function getCitiesByCounty(county: string): City[] {
  return Object.values(cities).filter(city => city.county === county);
}

export function getNearbyCities(citySlug: string, limit: number = 5): City[] {
  const city = getCity(citySlug);
  if (!city) return [];
  
  return city.nearbyAreas
    .slice(0, limit)
    .map(slug => getCity(slug))
    .filter((c): c is City => c !== null);
}

// Service access functions
export function getService(slug: string): Service | null {
  return services[slug] || null;
}

export function getAllServices(): Service[] {
  return Object.values(services);
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(services);
}

export function isValidServiceSlug(slug: string): slug is ServiceSlug {
  return VALID_SERVICE_SLUGS.includes(slug as ServiceSlug);
}

// Problem access functions
export function getProblem(slug: string): Problem | null {
  return problems[slug] || null;
}

export function getAllProblems(): Problem[] {
  return Object.values(problems);
}

export function getAllProblemSlugs(): string[] {
  return Object.keys(problems);
}

export function getProblemsByService(serviceSlug: string): Problem[] {
  return Object.values(problems).filter(
    problem => problem.parentService === serviceSlug
  );
}

// FAQ access functions
export function getFaqsForService(serviceSlug: string): FAQ[] {
  return faqs[serviceSlug] || [];
}

/**
 * Get FAQs for a service with city-specific custom FAQs merged in
 * Custom FAQs from the city are prioritized and appear at the top
 */
export function getFaqsForServiceAndCity(serviceSlug: string, citySlug: string): FAQ[] {
  const serviceFaqs = getFaqsForService(serviceSlug);
  const city = getCity(citySlug);
  
  if (!city || !city.customFaqs || city.customFaqs.length === 0) {
    return serviceFaqs;
  }
  
  // Merge custom FAQs at the top (they're more specific and valuable)
  return [...city.customFaqs, ...serviceFaqs];
}

// Generate all city × service combinations for static generation
export function getAllCityServiceCombinations(): Array<{ service: string; city: string }> {
  const combinations: Array<{ service: string; city: string }> = [];
  
  for (const serviceSlug of getAllServiceSlugs()) {
    for (const citySlug of getAllCitySlugs()) {
      combinations.push({
        service: serviceSlug,
        city: citySlug,
      });
    }
  }
  
  return combinations;
}

// Generate all problem × city combinations for static generation
export function getAllProblemCityCombinations(): Array<{ problem: string; city: string }> {
  const combinations: Array<{ problem: string; city: string }> = [];
  
  for (const problemSlug of getAllProblemSlugs()) {
    for (const citySlug of getAllCitySlugs()) {
      combinations.push({
        problem: problemSlug,
        city: citySlug,
      });
    }
  }
  
  return combinations;
}

// Get related services for a city page (for internal linking)
export function getRelatedServices(currentServiceSlug: string): Service[] {
  return getAllServices().filter(service => service.slug !== currentServiceSlug);
}

// Get statistics
export function getStats() {
  return {
    totalCities: getAllCitySlugs().length,
    totalServices: getAllServiceSlugs().length,
    totalProblems: getAllProblemSlugs().length,
    totalCityServicePages: getAllCitySlugs().length * getAllServiceSlugs().length,
    totalProblemCityPages: getAllProblemSlugs().length * getAllCitySlugs().length,
    totalPages: (getAllCitySlugs().length * getAllServiceSlugs().length) + 
                (getAllProblemSlugs().length * getAllCitySlugs().length) +
                getAllServiceSlugs().length + // service hub pages
                getAllProblemSlugs().length,  // problem hub pages
  };
}

// Video configuration types
export interface VideoConfig {
  url: string | null;
  title: string;
  /** Required for VideoObject schema - ISO 8601 duration, e.g. "PT3M45S" */
  duration?: string;
  /** Required for VideoObject schema */
  description?: string;
  uploadDate?: string;
  viewCount?: number;
}

interface VideosConfig {
  defaultVideos: Record<string, VideoConfig>;
  cityOverrides: Record<string, Record<string, VideoConfig>>;
}

// Extract videos config, filtering out documentation fields (prefixed with _)
const rawVideos = videosData as {
  _description?: string;
  defaultVideos: Record<string, VideoConfig>;
  cityOverrides: Record<string, string | Record<string, VideoConfig>>;
};

const videos: VideosConfig = {
  defaultVideos: rawVideos.defaultVideos,
  cityOverrides: Object.fromEntries(
    Object.entries(rawVideos.cityOverrides)
      .filter(([key]) => !key.startsWith('_'))
  ) as Record<string, Record<string, VideoConfig>>,
};

/**
 * Extract YouTube video ID from URL (watch or embed format)
 */
export function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * Convert VideoConfig to schema-ready format when duration and description are present.
 * Used for VideoObject JSON-LD on hub pages.
 */
export function videoConfigToSchemaVideo(
  config: VideoConfig
): { id: string; title: string; description: string; duration: string; uploadDate?: string; viewCount?: number } | null {
  if (!config.url || !config.duration || !config.description) return null;
  const id = extractYouTubeVideoId(config.url);
  if (!id) return null;
  return {
    id,
    title: config.title,
    description: config.description,
    duration: config.duration,
    uploadDate: config.uploadDate,
    viewCount: config.viewCount,
  };
}

/**
 * Get the video configuration for a service hub page (no city specified)
 * Returns the default video for the service, or null if none configured
 */
export function getServiceVideo(serviceSlug: string): VideoConfig | null {
  const defaultVideo = videos.defaultVideos[serviceSlug];
  if (defaultVideo?.url) {
    return defaultVideo;
  }
  return null;
}

/**
 * Get the video configuration for a city service page
 * First checks for a city-specific override, then falls back to the service default
 * Returns null if no video is configured
 */
export function getCityServiceVideo(serviceSlug: string, citySlug: string): VideoConfig | null {
  // Check for city-specific override first
  const cityOverride = videos.cityOverrides[citySlug]?.[serviceSlug];
  if (cityOverride?.url) {
    return cityOverride;
  }
  
  // Fall back to service default
  return getServiceVideo(serviceSlug);
}

/**
 * Check if a service has any video configured (default or any city override)
 */
export function serviceHasVideo(serviceSlug: string): boolean {
  return !!videos.defaultVideos[serviceSlug]?.url;
}

/**
 * Get all cities that have a video override for a specific service
 */
export function getCitiesWithVideoOverride(serviceSlug: string): string[] {
  return Object.entries(videos.cityOverrides)
    .filter(([_, overrides]) => overrides[serviceSlug]?.url)
    .map(([citySlug]) => citySlug);
}

