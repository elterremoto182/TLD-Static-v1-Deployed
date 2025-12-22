'use client';

import Link from 'next/link';
import { ArrowRight, Wrench, AlertTriangle, BookOpen } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import type { InternalLink } from '@/lib/local-seo/links';

interface RelatedLinksProps {
  serviceLinks?: InternalLink[];
  problemLinks?: InternalLink[];
  blogLinks?: InternalLink[];
}

export function RelatedLinks({ 
  serviceLinks = [], 
  problemLinks = [],
  blogLinks = []
}: RelatedLinksProps) {
  const hasContent = serviceLinks.length > 0 || problemLinks.length > 0 || blogLinks.length > 0;
  
  if (!hasContent) return null;
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Related Resources
            </h2>
            <p className="text-gray-600">
              Explore more services and helpful information
            </p>
          </div>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Related Services */}
          {serviceLinks.length > 0 && (
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Other Services
                  </h3>
                </div>
                <ul className="space-y-3">
                  {serviceLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between text-gray-700 hover:text-primary transition-colors"
                      >
                        <span className="text-sm">{link.label}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          )}
          
          {/* Related Problems */}
          {problemLinks.length > 0 && (
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Common Problems
                  </h3>
                </div>
                <ul className="space-y-3">
                  {problemLinks.slice(0, 5).map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between text-gray-700 hover:text-primary transition-colors"
                      >
                        <span className="text-sm">{link.label}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          )}
          
          {/* Related Blog Posts */}
          {blogLinks.length > 0 && (
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={200}>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Helpful Articles
                  </h3>
                </div>
                <ul className="space-y-3">
                  {blogLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between text-gray-700 hover:text-primary transition-colors"
                      >
                        <span className="text-sm">{link.label}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}

