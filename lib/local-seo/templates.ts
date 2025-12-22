import type { City, Service, Problem, FAQ } from './data';

export interface TemplateVariables {
  city?: string;
  county?: string;
  state?: string;
  service?: string;
  problem?: string;
  responseTime?: string;
  phone?: string;
}

/**
 * Replace template variables in a string
 * Supports: {city}, {county}, {state}, {service}, {problem}, {responseTime}, {phone}
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

