'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

interface FAQ {
  question: string;
  answer: string;
}

interface LocalFAQProps {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
}

export function LocalFAQ({ 
  faqs, 
  title = "Frequently Asked Questions",
  subtitle = "Get answers to common questions about our services"
}: LocalFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  if (faqs.length === 0) return null;
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600">
              {subtitle}
            </p>
          </div>
        </AnimateOnScroll>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimateOnScroll
              key={index}
              animation="fade-in-up"
              duration={600}
              delay={index * 50}
            >
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

