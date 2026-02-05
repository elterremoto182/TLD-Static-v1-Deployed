'use client';

import Link from 'next/link';
import { MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { City } from '@/lib/local-seo/data';
import { getCityTier } from '@/lib/local-seo/city-tiers';

interface TieredCityGridProps {
  cities: City[];
  serviceSlug: string;
  serviceName: string;
}

/**
 * TieredCityGrid displays cities with Tier 1 prominently featured
 * and Tier 2/3 in expandable secondary sections.
 * 
 * Link equity flows: Service Hubs → ALL Tier 1 cities prominently
 */
export function TieredCityGrid({ 
  cities, 
  serviceSlug, 
  serviceName,
}: TieredCityGridProps) {
  const [showAllCities, setShowAllCities] = useState(false);
  
  // Separate cities by tier
  const tier1Cities = cities.filter(city => getCityTier(city.slug) === 1);
  const tier2Cities = cities.filter(city => getCityTier(city.slug) === 2);
  const tier3Cities = cities.filter(city => getCityTier(city.slug) === 3);
  
  // Group tier 2 and tier 3 by county for the secondary section
  const secondaryCities = [...tier2Cities, ...tier3Cities];
  const citiesByCounty = secondaryCities.reduce((acc, city) => {
    const county = city.county;
    if (!acc[county]) {
      acc[county] = [];
    }
    acc[county].push(city);
    return acc;
  }, {} as Record<string, City[]>);
  
  const counties = Object.keys(citiesByCounty).sort();
  
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
        
        {/* Tier 1 Cities - Featured Section */}
        <div className="mb-12">
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
        
        {/* All Other Cities - Expandable Section */}
        <div>
            <button
              onClick={() => setShowAllCities(!showAllCities)}
              className="flex items-center justify-between w-full mb-6 pb-2 border-b border-gray-200 hover:border-gray-300 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-900">
                All Service Areas ({secondaryCities.length} cities)
              </h3>
              {showAllCities ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          
          {showAllCities && (
            <div className="space-y-8">
              {counties.map((county) => (
                <div key={county}>
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">
                      {county}
                    </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {citiesByCounty[county].map((city) => (
                        <Link
                          key={city.slug}
                          href={`/${serviceSlug}/${city.slug}/`}
                          className="group flex items-center gap-2 p-3 bg-gray-50 hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200"
                        >
                          <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors truncate">
                            {city.name}
                          </span>
                        </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Show a preview of cities when collapsed */}
          {!showAllCities && (
            <div className="flex flex-wrap gap-2">
              {secondaryCities.slice(0, 10).map((city) => (
                <Link
                  key={city.slug}
                  href={`/${serviceSlug}/${city.slug}/`}
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  {city.name}
                </Link>
              ))}
              {secondaryCities.length > 10 && (
                <button
                  onClick={() => setShowAllCities(true)}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  +{secondaryCities.length - 10} more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
