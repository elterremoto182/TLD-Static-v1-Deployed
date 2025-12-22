'use client';

import { Phone, Shield, Clock, MapPin } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { BreadcrumbItem } from '@/lib/local-seo/schema';

interface LocalHeroProps {
  title: string;
  subtitle: string;
  cityName: string;
  serviceName: string;
  responseTime: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundImage?: string;
  phone?: string;
}

export function LocalHero({
  title,
  subtitle,
  cityName,
  serviceName,
  responseTime,
  breadcrumbs,
  backgroundImage = '/images/services/leak-detection.jpg',
  phone = '(855) 385-5325',
}: LocalHeroProps) {
  return (
    <section className="relative min-h-[500px] md:min-h-[550px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={backgroundImage}
          alt={`${serviceName} in ${cityName} - Professional Services`}
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-32 md:pb-20">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbs} variant="light" />
        </div>
        
        {/* Location Badge */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Serving {cityName}, FL
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8">
          {subtitle}
        </p>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-accent" />
            <span className="text-white text-sm font-medium">{responseTime} Response</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <Shield className="w-5 h-5 text-accent" />
            <span className="text-white text-sm font-medium">Licensed & Insured</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <a
            href={`tel:${phone.replace(/[^0-9]/g, '')}`}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Phone className="w-5 h-5 md:w-6 md:h-6" />
            Call {phone}
          </a>
          <a
            href="/contact/"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold text-lg transition-all duration-200 border border-white/30"
          >
            Get Free Estimate
          </a>
        </div>
      </div>
    </section>
  );
}

