'use client';

import Link from 'next/link';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
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
        <AnimateOnScroll animation="fade-in-up" duration={600}>
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
        </AnimateOnScroll>

        <div className="space-y-3">
          {questions.map((item, index) => (
            <AnimateOnScroll
              key={index}
              animation="fade-in-up"
              duration={600}
              delay={index * 50}
            >
              <Link
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
            </AnimateOnScroll>
          ))}
        </div>

        {cityName && (
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={questions.length * 50 + 100}>
            <p className="text-center text-sm text-gray-500 mt-6">
              Have a different question about our services in {cityName}?{' '}
              <Link href="/contact/" className="text-primary hover:underline">
                Contact us
              </Link>{' '}
              for personalized assistance.
            </p>
          </AnimateOnScroll>
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
