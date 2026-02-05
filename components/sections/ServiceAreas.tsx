'use client';

import Link from 'next/link';
import { MapPin, Droplet, Shield, Camera, ArrowRight } from 'lucide-react';
// Service hub data
const services = [
  {
    slug: 'leak-detection',
    name: 'Leak Detection',
    icon: Droplet,
    description: 'Professional water leak detection using advanced thermal imaging and acoustic technology.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    slug: 'mold-testing',
    name: 'Mold Testing',
    icon: Shield,
    description: 'Certified mold inspection and air quality testing to protect your health and property.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    slug: 'sewer-camera-inspection',
    name: 'Sewer Camera Inspection',
    icon: Camera,
    description: 'Non-invasive video diagnostics to identify blockages, cracks, and pipe damage.',
    color: 'from-orange-500 to-amber-500',
  },
];

// Popular cities for quick access
const popularCities = [
  { slug: 'miami', name: 'Miami' },
  { slug: 'fort-lauderdale', name: 'Fort Lauderdale' },
  { slug: 'coral-gables', name: 'Coral Gables' },
  { slug: 'hollywood', name: 'Hollywood' },
  { slug: 'pembroke-pines', name: 'Pembroke Pines' },
  { slug: 'doral', name: 'Doral' },
  { slug: 'hialeah', name: 'Hialeah' },
  { slug: 'miami-beach', name: 'Miami Beach' },
];

export function ServiceAreas() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white" id="service-areas">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Serving South Florida
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Expert Services in Your Area
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional leak detection, mold testing, and sewer inspection services 
              throughout Miami-Dade and Broward counties.
            </p>
          </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
              <Link
                key={service.slug}
                href={`/${service.slug}/`}
                className="group block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:underline">
                  Find Local Service
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
          ))}
        </div>

        {/* Popular Cities Grid */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Popular Service Areas
              </h3>
              <Link
                href="/areas/"
                className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
              >
                View All Cities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {popularCities.map((city) => (
                <div key={city.slug} className="space-y-2">
                  <span className="font-semibold text-gray-900">{city.name}</span>
                  <div className="flex flex-col gap-1">
                    {services.map((service) => (
                      <Link
                        key={`${city.slug}-${service.slug}`}
                        href={`/${service.slug}/${city.slug}/`}
                        className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <service.icon className="w-3 h-3" />
                        {service.name.split(' ')[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </section>
  );
}

