'use client';

import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import type { City } from '@/lib/local-seo/data';

interface CityGridProps {
  cities: City[];
  serviceSlug: string;
  serviceName: string;
  groupByCounty?: boolean;
}

export function CityGrid({ 
  cities, 
  serviceSlug, 
  serviceName,
  groupByCounty = true 
}: CityGridProps) {
  // Group cities by county
  const citiesByCounty = groupByCounty 
    ? cities.reduce((acc, city) => {
        const county = city.county;
        if (!acc[county]) {
          acc[county] = [];
        }
        acc[county].push(city);
        return acc;
      }, {} as Record<string, City[]>)
    : { 'All Areas': cities };
  
  const counties = Object.keys(citiesByCounty).sort();
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {serviceName} Service Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your city for local {serviceName.toLowerCase()} information and service
            </p>
          </div>
        </AnimateOnScroll>
        
        {counties.map((county) => (
          <div key={county} className="mb-12 last:mb-0">
            {groupByCounty && (
              <AnimateOnScroll animation="fade-in-up" duration={600}>
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                  {county}
                </h3>
              </AnimateOnScroll>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {citiesByCounty[county].map((city, index) => (
                <AnimateOnScroll
                  key={city.slug}
                  animation="fade-in-up"
                  duration={600}
                  delay={index * 30}
                >
                  <Link
                    href={`/${serviceSlug}/${city.slug}/`}
                    className="group flex items-center gap-2 p-3 bg-gray-50 hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200"
                  >
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-gray-800 group-hover:text-primary transition-colors truncate">
                      {city.name}
                    </span>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

