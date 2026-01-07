import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Camera, Zap, Shield, Droplet, AlertTriangle, Waves, FileText, Building, Wrench, LucideIcon } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import content from '@/config/content.json';

// Icon mapping for service icons - selective imports for better tree-shaking
const iconMap: Record<string, LucideIcon> = {
  Camera,
  Zap,
  Shield,
  Droplet,
  AlertTriangle,
  Waves,
  FileText,
  Building,
  Wrench,
};

// Map service IDs to their slugs from markdown files
// URLs should have trailing slashes to match Next.js trailingSlash: true configuration
const serviceSlugMap: Record<string, string> = {
  'camera-inspection': '/services/camera-inspection/',
  'clogged-drains': '/services/clogged-drains/',
  'leak-detection': '/services/leak-detection/',
  'mold-testing': '/services/mold-testing/',
  'leaking-toilet': '/services/leaking-toilet/',
  'damaged-sewer': '/services/damaged-sewer/',
  'hydro-jetting': '/services/hydro-jetting/',
  'slab-leaks': '/services/slab-leaks/',
  'plumbing-report-writing': '/services/plumbing-report-writing/',
  'commercial-services': '/services/commercial-services/',
};

export function Services() {
  const { services } = content;

  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leak detection and plumbing services for Miami homes and businesses
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Wrench;
            const serviceSlug = serviceSlugMap[service.id] || '/services/';

            return (
              <AnimateOnScroll
                key={service.id}
                animation="fade-in-up"
                duration={600}
                delay={index * 100}
              >
                <Link
                  href={serviceSlug}
                  className="block bg-white rounded-xl border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer"
                >
                  {service.image && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <OptimizedImage
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
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

                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                      {service.description}
                    </p>

                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
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
                  </div>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
