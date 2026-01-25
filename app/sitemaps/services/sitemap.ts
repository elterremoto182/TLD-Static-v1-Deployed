import { MetadataRoute } from 'next';
import { 
  getAllCityServiceCombinations, 
  getAllServices,
} from '@/lib/local-seo/data';
import {
  getCityServiceLastModified,
  getCachedGitLastModified,
} from '@/lib/git-dates';
import { ensureTrailingSlash, getBaseUrl } from '@/lib/sitemap-utils';

/**
 * Services Sitemap
 * Contains: Service hub pages + City × Service pages (money pages)
 * ~120 URLs total (3 hubs + 117 city-service combinations)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  
  const servicesConfigDate = getCachedGitLastModified('config/local-seo/services.json');
  const cityServiceDate = getCityServiceLastModified();

  // Service hub pages (leak-detection, mold-testing, sewer-camera-inspection)
  const services = getAllServices();
  const serviceHubRoutes = services.map((service) => ({
    url: ensureTrailingSlash(`${baseUrl}/${service.slug}`, baseUrl),
    lastModified: servicesConfigDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // City × Service pages (money pages)
  const cityServiceCombinations = getAllCityServiceCombinations();
  const cityServiceRoutes = cityServiceCombinations.map(({ service, city }) => ({
    url: ensureTrailingSlash(`${baseUrl}/${service}/${city}`, baseUrl),
    lastModified: cityServiceDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...serviceHubRoutes,
    ...cityServiceRoutes,
  ];
}
