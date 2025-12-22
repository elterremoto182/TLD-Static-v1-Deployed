'use client';

import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import type { InternalLink } from '@/lib/local-seo/links';

interface NearbyAreasProps {
  links: InternalLink[];
  title?: string;
  subtitle?: string;
}

export function NearbyAreas({ 
  links, 
  title = "Nearby Service Areas",
  subtitle = "We also serve these nearby communities"
}: NearbyAreasProps) {
  if (links.length === 0) return null;
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, index) => (
            <AnimateOnScroll
              key={link.href}
              animation="fade-in-up"
              duration={600}
              delay={index * 50}
            >
              <Link
                href={link.href}
                className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                    {link.label}
                  </p>
                  {link.description && (
                    <p className="text-sm text-gray-500 truncate">
                      {link.description.substring(0, 50)}...
                    </p>
                  )}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

