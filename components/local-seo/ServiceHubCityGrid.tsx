'use client';

import Link from 'next/link';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import type { City } from '@/lib/local-seo/data';
import { getCityTier } from '@/lib/local-seo/city-tiers';

interface ServiceHubCityGridProps {
  cities: City[];
  serviceSlug: string;
  serviceName: string;
}

/**
 * ServiceHubCityGrid displays ONLY Tier 1 cities for service hub pages.
 * 
 * SEO Strategy:
 * - Service hubs link only to Tier 1 cities (10 cities) to concentrate link equity
 * - Tier 2/3 cities are discoverable via the tier cascade:
 *   - Tier 1 → Tier 2 (3 nearest each)
 *   - Tier 2 → Tier 3 (3 nearest each)
 * - /areas/ page (noindex, follow) serves as safety net for crawlability
 * 
 * This prevents link equity dilution that occurs when hub pages link to all 50+ cities.
 */
export function ServiceHubCityGrid({ 
  cities, 
  serviceSlug, 
  serviceName,
}: ServiceHubCityGridProps) {
  // Only show Tier 1 cities - these are the major metros that should receive
  // direct link equity from service hub pages
  const tier1Cities = cities.filter(city => getCityTier(city.slug) === 1);
  
  // Count of other cities for the "View All" link
  const otherCitiesCount = cities.length - tier1Cities.length;
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {serviceName} Service Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your city for local {serviceName.toLowerCase()} information and service
            </p>
          </div>
        
        {/* Tier 1 Cities - Major Service Areas */}
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-primary/20">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-gray-900">
                Major Service Areas
              </h3>
            </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tier1Cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${serviceSlug}/${city.slug}/`}
                  className="group flex items-center gap-2 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-200"
                >
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                    {city.name}
                  </span>
                </Link>
            ))}
          </div>
        </div>
        
        {/* Link to All Service Areas - Single link to /areas/ page */}
        {otherCitiesCount > 0 && (
            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-gray-600 mb-3">
                We also serve {otherCitiesCount}+ additional cities across South Florida
              </p>
              <Link
                href="/areas/"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                View All Service Areas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
        )}
      </div>
    </section>
  );
}
