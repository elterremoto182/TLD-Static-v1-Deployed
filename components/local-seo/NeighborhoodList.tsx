'use client';

import { MapPin, Home } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

interface NeighborhoodListProps {
  neighborhoods: string[];
  zipCodes: string[];
  cityName: string;
  serviceName: string;
}

export function NeighborhoodList({ 
  neighborhoods, 
  zipCodes, 
  cityName,
  serviceName 
}: NeighborhoodListProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {serviceName} Throughout {cityName}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We serve all neighborhoods and zip codes in {cityName} and surrounding areas
            </p>
          </div>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Neighborhoods */}
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Neighborhoods We Serve
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {neighborhoods.map((neighborhood, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm">{neighborhood}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
          
          {/* Zip Codes */}
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={200}>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Zip Codes Served
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {zipCodes.map((zip, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

