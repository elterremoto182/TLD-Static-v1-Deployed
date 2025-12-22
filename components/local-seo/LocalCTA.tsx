'use client';

import { Phone, Clock, Shield, CheckCircle } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

interface LocalCTAProps {
  cityName: string;
  serviceName: string;
  responseTime: string;
  phone?: string;
  variant?: 'primary' | 'secondary';
}

export function LocalCTA({ 
  cityName, 
  serviceName,
  responseTime,
  phone = '(855) 385-5325',
  variant = 'primary'
}: LocalCTAProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <section className={`py-16 ${isPrimary ? 'bg-gradient-to-br from-primary to-primary/90' : 'bg-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need {serviceName} in {cityName}?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Don&apos;t let hidden problems cause costly damage. Contact our expert team today for fast, professional service.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">{responseTime} Response</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Free Estimates</span>
              </div>
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Phone className="w-6 h-6" />
                Call Now: {phone}
              </a>
              <a
                href="/contact/"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
              >
                Request a Quote
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

// Inline CTA for use within content sections
export function InlineCTA({ 
  phone = '(855) 385-5325' 
}: { 
  phone?: string 
}) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 my-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-1">
            Ready to get started?
          </p>
          <p className="text-gray-600">
            Call now for fast, professional service.
          </p>
        </div>
        <a
          href={`tel:${phone.replace(/[^0-9]/g, '')}`}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap"
        >
          <Phone className="w-5 h-5" />
          {phone}
        </a>
      </div>
    </div>
  );
}

