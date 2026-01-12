'use client';

import { CheckCircle, AlertTriangle } from '@/lib/icons';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import type { Technology } from '@/lib/local-seo/data';

interface ServiceOverviewProps {
  overview: string;
  whyImportant: string;
  technology: Technology[];
  commonSigns: string[];
  whyChooseUs: string[];
  cityName: string;
  serviceName: string;
}

export function ServiceOverview({
  overview,
  whyImportant,
  technology,
  commonSigns,
  whyChooseUs,
  cityName,
  serviceName,
}: ServiceOverviewProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Overview */}
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Professional {serviceName} in {cityName}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {overview}
            </p>
          </div>
        </AnimateOnScroll>
        
        {/* Why Important */}
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Why This Matters
                </h3>
                <p className="text-gray-700">
                  {whyImportant}
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
        
        {/* Technology Grid */}
        <div className="mb-16">
          <AnimateOnScroll animation="fade-in-up" duration={600}>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Advanced Technology We Use
            </h3>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technology.map((tech, index) => (
              <AnimateOnScroll
                key={tech.name}
                animation="fade-in-up"
                duration={600}
                delay={index * 100}
              >
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {tech.name}
                  </h4>
                  <p className="text-gray-600">
                    {tech.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
        
        {/* Two Column: Signs + Why Choose Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Common Signs */}
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Warning Signs to Watch For
              </h3>
              <ul className="space-y-3">
                {commonSigns.map((sign, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
          
          {/* Why Choose Us */}
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Why Choose Total Leak Detection
              </h3>
              <ul className="space-y-3">
                {whyChooseUs.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

