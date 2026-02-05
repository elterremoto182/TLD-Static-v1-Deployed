'use client';

import Link from 'next/link';
import { MapPin, ArrowRight, Droplet, Shield, Camera } from 'lucide-react';
interface FindInYourCityProps {
  serviceSlug: string;
  serviceName: string;
}

// Service mapping for icons
const SERVICE_ICONS: Record<string, React.ElementType> = {
  'leak-detection': Droplet,
  'mold-testing': Shield,
  'sewer-camera-inspection': Camera,
};

// Popular cities for quick access
const popularCities = [
  { slug: 'miami', name: 'Miami', county: 'Miami-Dade' },
  { slug: 'fort-lauderdale', name: 'Fort Lauderdale', county: 'Broward' },
  { slug: 'coral-gables', name: 'Coral Gables', county: 'Miami-Dade' },
  { slug: 'hollywood', name: 'Hollywood', county: 'Broward' },
  { slug: 'pembroke-pines', name: 'Pembroke Pines', county: 'Broward' },
  { slug: 'doral', name: 'Doral', county: 'Miami-Dade' },
  { slug: 'hialeah', name: 'Hialeah', county: 'Miami-Dade' },
  { slug: 'miami-beach', name: 'Miami Beach', county: 'Miami-Dade' },
  { slug: 'boca-raton', name: 'Boca Raton', county: 'Broward' },
  { slug: 'aventura', name: 'Aventura', county: 'Miami-Dade' },
  { slug: 'pompano-beach', name: 'Pompano Beach', county: 'Broward' },
  { slug: 'homestead', name: 'Homestead', county: 'Miami-Dade' },
];

// Mapping from existing service page slugs to local SEO service slugs
const SERVICE_SLUG_MAPPING: Record<string, string> = {
  'leak-detection': 'leak-detection',
  'water-leak-detection': 'leak-detection',
  'plumbing-leak-detection': 'leak-detection',
  'slab-leak-detection': 'leak-detection',
  'pool-leak-detection': 'leak-detection',
  'mold-testing': 'mold-testing',
  'mold-inspection': 'mold-testing',
  'mold-remediation': 'mold-testing',
  'sewer-camera-inspection': 'sewer-camera-inspection',
  'sewer-video-inspection': 'sewer-camera-inspection',
  'drain-camera-inspection': 'sewer-camera-inspection',
};

export function FindInYourCity({ serviceSlug, serviceName }: FindInYourCityProps) {
  // Map service slug to local SEO service slug
  const localSeoServiceSlug = SERVICE_SLUG_MAPPING[serviceSlug] || 'leak-detection';
  const IconComponent = SERVICE_ICONS[localSeoServiceSlug] || Droplet;
  
  // Derive display name for local SEO services
  const localSeoServiceName = {
    'leak-detection': 'Leak Detection',
    'mold-testing': 'Mold Testing',
    'sewer-camera-inspection': 'Sewer Camera Inspection',
  }[localSeoServiceSlug] || serviceName;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold text-sm">Local Service Available</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Find {localSeoServiceName} in Your City
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide {localSeoServiceName.toLowerCase()} services throughout South Florida. 
              Select your city below to learn about local services and response times.
            </p>
          </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${localSeoServiceSlug}/${city.slug}/`}
                className="group flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <IconComponent className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium text-gray-900 group-hover:text-primary transition-colors block truncate">
                    {city.name}
                  </span>
                  <span className="text-xs text-gray-500 truncate block">
                    {city.county}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        <div className="text-center">
            <Link
              href={`/${localSeoServiceSlug}/`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Service Areas
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              Serving 38+ cities in Miami-Dade & Broward counties
            </p>
          </div>
      </div>
    </section>
  );
}

