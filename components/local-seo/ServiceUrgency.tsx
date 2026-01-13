'use client';

import { AlertTriangle, DollarSign, Droplet, Home, TrendingDown, Phone } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

interface UrgencyItem {
  icon?: 'dollar' | 'droplet' | 'home' | 'trending' | 'alert';
  title: string;
  description: string;
}

interface ServiceUrgencyProps {
  title: string;
  subtitle?: string;
  intro: string;
  items: UrgencyItem[];
  costRange?: string;
  phone?: string;
}

const iconMap = {
  dollar: DollarSign,
  droplet: Droplet,
  home: Home,
  trending: TrendingDown,
  alert: AlertTriangle,
};

export function ServiceUrgency({
  title,
  subtitle,
  intro,
  items,
  costRange,
  phone = '(855) 385-5325',
}: ServiceUrgencyProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-10">
            {intro}
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {items.map((item, index) => {
            const IconComponent = item.icon ? iconMap[item.icon] : AlertTriangle;
            return (
              <AnimateOnScroll
                key={index}
                animation="fade-in-up"
                duration={600}
                delay={150 + index * 50}
              >
                <div className="bg-white rounded-xl p-6 border border-red-100 shadow-sm">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {costRange && (
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={300}>
            <div className="bg-white border-2 border-red-200 rounded-xl p-6 text-center max-w-2xl mx-auto mb-8">
              <p className="text-xl font-bold text-gray-900 mb-2">
                Average Damage Cost: <span className="text-red-600">{costRange}</span>
              </p>
              <p className="text-gray-600">
                Early detection saves you money and prevents costly repairs.
              </p>
            </div>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll animation="fade-in-up" duration={600} delay={350}>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              Don&apos;t wait until it&apos;s too late. Schedule your inspection today.
            </p>
            <a
              href={`tel:${phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Phone className="w-6 h-6" />
              Call Now: {phone}
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
