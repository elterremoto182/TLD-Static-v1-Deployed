'use client';

import { CheckCircle } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

interface ServiceBenefitsProps {
  title: string;
  subtitle?: string;
  benefits: string[];
  variant?: 'default' | 'compact';
}

export function ServiceBenefits({
  title,
  subtitle,
  benefits,
  variant = 'default',
}: ServiceBenefitsProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <AnimateOnScroll
              key={index}
              animation="fade-in-up"
              duration={600}
              delay={index * 50}
            >
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
