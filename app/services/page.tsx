import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import OptimizedImage from '@/components/OptimizedImage';
import content from '@/config/content.json';
import * as LucideIcons from 'lucide-react';
import { generatePageMetadata } from '@/lib/utils';

// Map service IDs to their slugs from markdown files
// URLs should not have trailing slashes to match Next.js routing
const serviceSlugMap: Record<string, string> = {
  'camera-inspection': '/services/camera-inspection',
  'clogged-drains': '/services/clogged-drains',
  'leak-detection': '/services/leak-detection',
  'mold-testing': '/services/mold-testing',
  'leaking-toilet': '/services/leaking-toilet',
  'damaged-sewer': '/services/damaged-sewer',
  'hydro-jetting': '/services/hydro-jetting',
  'slab-leaks': '/services/slab-leaks',
  'plumbing-report-writing': '/services/plumbing-report-writing',
  'commercial-services': '/services/commercial-services',
};

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Our Services - Total Leak Detection',
    description: 'Comprehensive plumbing and leak detection services in Miami, FL. Water leak detection, sewer camera inspections, mold testing, and more.',
    keywords: ['plumbing services', 'leak detection services', 'Miami plumbing'],
    path: '/services',
  });
}

export default function ServicesPage() {
  const { services } = content;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="pt-32 pb-20 md:pb-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Our Services
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive plumbing and leak detection services in Miami, FL
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = (LucideIcons[
                  service.icon as keyof typeof LucideIcons
                ] || LucideIcons.Wrench) as React.ElementType;
                const serviceSlug = serviceSlugMap[service.id] || '/services';

                return (
                  <AnimateOnScroll
                    key={service.id}
                    animation="fade-in-up"
                    duration={600}
                    delay={index * 100}
                  >
                    <Link
                      href={serviceSlug}
                      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
                    >
                      {service.image && (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <OptimizedImage
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        {!service.image && (
                          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                        )}

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {service.title}
                        </h2>

                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        <ul className="space-y-2 mb-4">
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <svg
                                className="w-4 h-4 text-accent mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:underline">
                          Learn More
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

