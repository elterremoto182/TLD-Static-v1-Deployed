'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProblemsByService } from '@/lib/local-seo/data';
import { getIcon } from '@/lib/icons';

interface RelatedProblemsProps {
  serviceSlug: string;
  title?: string;
  subtitle?: string;
}

export function RelatedProblems({
  serviceSlug,
  title = 'Common Problems We Solve',
  subtitle,
}: RelatedProblemsProps) {
  const problems = getProblemsByService(serviceSlug);

  if (problems.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => {
            const IconComponent = getIcon(problem.icon);

            return (
                <Link
                  key={problem.slug}
                  href={`/problems/${problem.slug}/`}
                  className="group block bg-gray-50 hover:bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-200 h-full"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                          {problem.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {problem.overview}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
