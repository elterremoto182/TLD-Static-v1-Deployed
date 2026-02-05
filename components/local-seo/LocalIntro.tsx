'use client';

import { Clock, CheckCircle, Award, Quote } from 'lucide-react';

interface LocalIntroProps {
  intro: string;
  extendedContent?: string;
  cityName: string;
  localFactors?: {
    climate: string;
    risks: string[];
    characteristics: string;
  };
  uniqueContent?: {
    whyChooseUsLocal?: string;
    localExpertise?: string;
    testimonialHighlight?: string;
  };
  localStats?: {
    yearsServing?: number;
    jobsCompleted?: string;
    avgResponseMins?: number;
  };
}

export function LocalIntro({
  intro,
  extendedContent,
  cityName,
  localFactors,
  uniqueContent,
  localStats,
}: LocalIntroProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main intro with className for speakable */}
        <div className="local-intro prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              {intro}
            </p>
            {extendedContent && (
              <p className="text-gray-600 leading-relaxed">
                {extendedContent}
              </p>
            )}
          </div>

        {/* Local Stats - if available */}
        {localStats && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {localStats.yearsServing && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{localStats.yearsServing}+</div>
                  <div className="text-sm text-gray-600">Years Serving {cityName}</div>
                </div>
              )}
              {localStats.jobsCompleted && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{localStats.jobsCompleted}</div>
                  <div className="text-sm text-gray-600">Jobs Completed</div>
                </div>
              )}
              {localStats.avgResponseMins && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{localStats.avgResponseMins} min</div>
                  <div className="text-sm text-gray-600">Avg. Response Time</div>
                </div>
              )}
            </div>
        )}

        {/* Unique Content - Why Choose Us Local */}
        {uniqueContent?.whyChooseUsLocal && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Why {cityName} Chooses Us
              </h3>
              <p className="text-gray-700">
                {uniqueContent.whyChooseUsLocal}
              </p>
              {uniqueContent.localExpertise && (
                <p className="text-gray-600 mt-3 text-sm">
                  {uniqueContent.localExpertise}
                </p>
              )}
            </div>
        )}

        {/* Testimonial Highlight */}
        {uniqueContent?.testimonialHighlight && (
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Quote className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <p className="text-gray-700 italic">
                  {uniqueContent.testimonialHighlight}
                </p>
              </div>
            </div>
        )}
        
        {/* Local factors callout */}
        {localFactors && (
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
        )}
      </div>
    </section>
  );
}

