'use client';

import { getIcon, CheckCircle } from '@/lib/icons';
import type { ProcessStep } from '@/lib/local-seo/data';

interface ServiceProcessProps {
  steps: ProcessStep[];
  title?: string;
  subtitle?: string;
}

export function ServiceProcess({ 
  steps, 
  title = "Our Process",
  subtitle = "How we get the job done right"
}: ServiceProcessProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = getIcon(step.icon, CheckCircle);
            
            return (
                <div key={step.step} className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Connector line (hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200" />
                  )}
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

