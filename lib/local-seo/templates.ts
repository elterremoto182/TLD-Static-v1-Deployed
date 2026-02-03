import type { City, Service, Problem, FAQ } from './data';

export interface TemplateVariables {
  city?: string;
  county?: string;
  state?: string;
  service?: string;
  problem?: string;
  responseTime?: string;
  phone?: string;
  neighborhoods?: string;
  zipCodes?: string;
  climate?: string;
  risks?: string;
  characteristics?: string;
}

/**
 * Replace template variables in a string
 * Supports: {city}, {county}, {state}, {service}, {problem}, {responseTime}, {phone},
 *           {neighborhoods}, {zipCodes}, {climate}, {risks}, {characteristics}
 */
export function renderTemplate(template: string, variables: TemplateVariables): string {
  let result = template;
  
  if (variables.city) {
    result = result.replace(/\{city\}/gi, variables.city);
  }
  if (variables.county) {
    result = result.replace(/\{county\}/gi, variables.county);
  }
  if (variables.state) {
    result = result.replace(/\{state\}/gi, variables.state);
  }
  if (variables.service) {
    result = result.replace(/\{service\}/gi, variables.service);
  }
  if (variables.problem) {
    result = result.replace(/\{problem\}/gi, variables.problem);
  }
  if (variables.responseTime) {
    result = result.replace(/\{responseTime\}/gi, variables.responseTime);
  }
  if (variables.phone) {
    result = result.replace(/\{phone\}/gi, variables.phone);
  }
  if (variables.neighborhoods) {
    result = result.replace(/\{neighborhoods\}/gi, variables.neighborhoods);
  }
  if (variables.zipCodes) {
    result = result.replace(/\{zipCodes\}/gi, variables.zipCodes);
  }
  if (variables.climate) {
    result = result.replace(/\{climate\}/gi, variables.climate);
  }
  if (variables.risks) {
    result = result.replace(/\{risks\}/gi, variables.risks);
  }
  if (variables.characteristics) {
    result = result.replace(/\{characteristics\}/gi, variables.characteristics);
  }
  
  return result;
}

/**
 * Generate meta title for a city × service page
 */
export function generateCityServiceMetaTitle(service: Service, city: City): string {
  return renderTemplate(service.metaTitleTemplate, {
    service: service.name,
    city: city.name,
    county: city.county,
    state: city.state,
  });
}

/**
 * Generate meta description for a city × service page
 */
export function generateCityServiceMetaDesc(service: Service, city: City): string {
  return renderTemplate(service.metaDescTemplate, {
    service: service.name,
    city: city.name,
    county: city.county,
    state: city.state,
  });
}

/**
 * Generate H1 for a city × service page
 */
export function generateCityServiceH1(service: Service, city: City): string {
  return renderTemplate(service.h1Template, {
    service: service.name,
    city: city.name,
    county: city.county,
    state: city.state,
  });
}

/**
 * Generate subheading for a city × service page
 */
export function generateCityServiceSubheading(service: Service, city: City): string {
  return renderTemplate(service.subheadingTemplate, {
    service: service.name,
    city: city.name,
    county: city.county,
    state: city.state,
  });
}

/**
 * Generate meta title for a problem × city page
 */
export function generateProblemCityMetaTitle(problem: Problem, city: City): string {
  return renderTemplate(problem.metaTitleTemplate, {
    problem: problem.name,
    city: city.name,
    county: city.county,
    state: city.state,
  });
}

/**
 * Generate meta description for a problem × city page
 */
export function generateProblemCityMetaDesc(problem: Problem, city: City): string {
  return renderTemplate(problem.metaDescTemplate, {
    problem: problem.name,
    city: city.name,
    county: city.county,
    state: city.state,
  });
}

/**
 * Generate H1 for a problem × city page
 */
export function generateProblemCityH1(problem: Problem, city: City): string {
  return renderTemplate(problem.h1Template, {
    problem: problem.name,
    city: city.name,
    county: city.county,
    state: city.state,
  });
}

/**
 * Render FAQs with city-specific variables
 */
export function renderFaqs(faqs: FAQ[], city: City): FAQ[] {
  return faqs.map(faq => ({
    question: renderTemplate(faq.question, {
      city: city.name,
      county: city.county,
      state: city.state,
      responseTime: city.responseTime,
      phone: '(855) 385-5325',
    }),
    answer: renderTemplate(faq.answer, {
      city: city.name,
      county: city.county,
      state: city.state,
      responseTime: city.responseTime,
      phone: '(855) 385-5325',
    }),
  }));
}

/**
 * Generate keywords array with city name added
 * @deprecated Use generateFocusedKeywords() instead for modern SEO
 */
export function generateLocalKeywords(baseKeywords: string[], city: City): string[] {
  const localKeywords: string[] = [];
  
  // Add city-specific versions of each keyword
  for (const keyword of baseKeywords) {
    localKeywords.push(keyword);
    localKeywords.push(`${keyword} ${city.name}`);
    localKeywords.push(`${keyword} ${city.name} FL`);
  }
  
  // Add city + county combinations
  localKeywords.push(`${city.name} ${city.county}`);
  localKeywords.push(`plumber ${city.name}`);
  localKeywords.push(`plumbing services ${city.name}`);
  
  return [...new Set(localKeywords)]; // Remove duplicates
}

/**
 * Generate focused, intent-driven keywords for city pages.
 * Modern SEO: one primary keyword + 2-3 semantic variants only.
 * Works for both service pages and problem pages.
 */
export function generateFocusedKeywords(
  entity: { name: string; keywords: string[] },
  city: City
): string[] {
  const entityName = entity.name.toLowerCase();
  const cityName = city.name.toLowerCase();
  
  // Primary keyword: {name} {city} fl
  const primary = `${entityName} ${cityName} fl`;
  
  // First semantic variant: use first keyword if different from name
  const firstKeyword = entity.keywords[0]?.toLowerCase();
  const variant1 = firstKeyword && firstKeyword !== entityName 
    ? `${firstKeyword} ${cityName}`
    : `${cityName} ${entityName}`;
  
  // Second semantic variant: reversed word order
  const variant2 = `${cityName} ${entityName}`;
  
  // Return unique keywords only
  return [...new Set([primary, variant1, variant2])];
}

/**
 * Format zip codes as a display string
 */
export function formatZipCodes(zipCodes: string[]): string {
  if (zipCodes.length === 0) return '';
  if (zipCodes.length <= 3) return zipCodes.join(', ');
  return `${zipCodes.slice(0, 3).join(', ')} and ${zipCodes.length - 3} more`;
}

/**
 * Format neighborhoods as a display string
 */
export function formatNeighborhoods(neighborhoods: string[], limit: number = 5): string {
  if (neighborhoods.length === 0) return '';
  if (neighborhoods.length <= limit) return neighborhoods.join(', ');
  return `${neighborhoods.slice(0, limit).join(', ')} and more`;
}

