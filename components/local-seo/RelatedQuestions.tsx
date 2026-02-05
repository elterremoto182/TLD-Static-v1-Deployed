'use client';

import Link from 'next/link';
import { ChevronRight, HelpCircle } from 'lucide-react';

interface RelatedQuestion {
  question: string;
  href: string;
  description?: string;
}

interface RelatedQuestionsProps {
  questions: RelatedQuestion[];
  title?: string;
  subtitle?: string;
  cityName?: string;
}

/**
 * "People Also Ask" style component for enhanced internal linking
 * Displays questions that link to related problem or service pages
 */
export function RelatedQuestions({
  questions,
  title = 'Common Questions',
  subtitle,
  cityName,
}: RelatedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

        <div className="space-y-3">
          {questions.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {item.question}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
          ))}
        </div>

        {cityName && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Have a different question about our services in {cityName}?{' '}
              <Link href="/contact/" className="text-primary hover:underline">
                Contact us
              </Link>{' '}
              for personalized assistance.
            </p>
        )}
      </div>
    </section>
  );
}

/**
 * Helper function to generate related questions from problem links
 */
export function generateRelatedQuestions(
  problemLinks: Array<{ name: string; href: string; description?: string }>,
  cityName: string,
  limit: number = 4
): RelatedQuestion[] {
  return problemLinks.slice(0, limit).map((problem) => ({
    question: `Having ${problem.name.toLowerCase()} issues in ${cityName}?`,
    href: problem.href,
    description: problem.description || `Learn about our ${problem.name.toLowerCase()} detection and solutions.`,
  }));
}
