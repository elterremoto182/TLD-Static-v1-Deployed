import citiesData from '@/config/local-seo/cities.json';
import servicesData from '@/config/local-seo/services.json';
import problemsData from '@/config/local-seo/problems.json';
import faqsData from '@/config/local-seo/faqs.json';

// Type definitions
export interface CityLocalFactors {
  climate: string;
  risks: string[];
  characteristics: string;
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

