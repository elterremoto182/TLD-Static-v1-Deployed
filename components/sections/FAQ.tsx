'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { faqs } from '@/lib/seo/faq-data';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Common questions about our leak detection services in Miami
          </p>
        </AnimateOnScroll>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimateOnScroll
              key={index}
              animation="fade-in-up"
              duration={600}
              delay={index * 100}
            >
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

