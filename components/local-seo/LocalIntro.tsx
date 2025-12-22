'use client';

import { AnimateOnScroll } from '@/components/AnimateOnScroll';

interface LocalIntroProps {
  intro: string;
  extendedContent?: string;
  cityName: string;
  localFactors?: {
    climate: string;
    risks: string[];
    characteristics: string;
  };
}

export function LocalIntro({
  intro,
  extendedContent,
  cityName,
  localFactors,
}: LocalIntroProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          {/* Main intro */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              {intro}
            </p>
            {extendedContent && (
              <p className="text-gray-600 leading-relaxed">
                {extendedContent}
              </p>
            )}
          </div>
        </AnimateOnScroll>
        
        {/* Local factors callout */}
        {localFactors && (
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Understanding {cityName}&apos;s Unique Challenges
              </h3>
              <p className="text-gray-700 mb-4">
                {localFactors.climate}
              </p>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Common risks in {cityName}:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {localFactors.risks.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                {localFactors.characteristics}
              </p>
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
}

