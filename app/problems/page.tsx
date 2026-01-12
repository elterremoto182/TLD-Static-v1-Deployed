import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { Phone, AlertTriangle, Wrench, getIcon } from '@/lib/icons';
import { getAllProblems, getAllServices, getProblemsByService } from '@/lib/local-seo/data';
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  schemaToJsonLd,
  BreadcrumbItem,
} from '@/lib/local-seo/schema';

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const canonicalUrl = `${baseUrl}/problems/`;

  return {
    title: 'Common Plumbing Problems | Expert Detection & Solutions in Florida',
    description:
      'Expert diagnosis and solutions for common plumbing problems in Florida. From slab leaks and burst pipes to mold testing and sewer blockages. Call (855) 385-5325!',
    keywords: [
      'plumbing problems',
      'leak detection',
      'mold testing',
      'sewer inspection',
      'slab leak',
      'burst pipe',
      'water heater leak',
      'Florida plumber',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Common Plumbing Problems | Total Leak Detection',
      description:
        'Expert diagnosis and solutions for common plumbing problems in Florida. Slab leaks, burst pipes, mold, sewer issues and more.',
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default function ProblemsPage() {
  const allProblems = getAllProblems();
  const allServices = getAllServices();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const canonicalUrl = `${baseUrl}/problems/`;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Problems', href: '/problems/' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs, canonicalUrl);
  const webPageSchema = generateWebPageSchema({
    title: 'Common Plumbing Problems | Expert Detection & Solutions',
    description:
      'Expert diagnosis and solutions for common plumbing problems in Florida. From slab leaks and burst pipes to mold testing and sewer blockages.',
    url: canonicalUrl,
    breadcrumbs,
  });

  // Group problems by parent service
  const problemsByService = allServices.map((service) => ({
    service,
    problems: getProblemsByService(service.slug),
  })).filter((group) => group.problems.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(webPageSchema) }}
      />

      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pb-28 bg-gradient-to-br from-red-50 via-background to-amber-50">
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <AlertTriangle className="w-4 h-4" />
                Expert Problem Diagnosis
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Common Plumbing Problems
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                We specialize in diagnosing and solving the most challenging plumbing issues
                throughout South Florida. From hidden leaks to mold concerns, our experts have
                the technology and experience to help.
              </p>
              <a
                href="tel:8553855325"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
              >
                <Phone className="w-6 h-6" />
                Call (855) 385-5325
              </a>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Problems by Category */}
        {problemsByService.map((group, groupIndex) => {
          const ServiceIcon = getIcon(group.service.icon, Wrench);

          return (
            <section
              key={group.service.slug}
              className={`py-16 ${groupIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="max-w-6xl mx-auto px-4">
                <AnimateOnScroll animation="fade-in-up" duration={600}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ServiceIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {group.service.name} Problems
                      </h2>
                      <p className="text-gray-600">
                        Common issues we detect and diagnose
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.problems.map((problem, index) => {
                    const ProblemIcon = getIcon(problem.icon);

                    return (
                      <AnimateOnScroll
                        key={problem.slug}
                        animation="fade-in-up"
                        duration={600}
                        delay={index * 100}
                      >
                        <Link
                          href={`/problems/${problem.slug}/`}
                          className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                                <ProblemIcon className="w-6 h-6 text-red-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                  {problem.name}
                                </h3>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                              {problem.overview}
                            </p>

                            {/* Warning Signs Preview */}
                            <div className="mb-4">
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Warning Signs:
                              </p>
                              <ul className="space-y-1">
                                {problem.symptoms.slice(0, 3).map((symptom, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-gray-600"
                                  >
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                                    <span className="line-clamp-1">{symptom}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:underline">
                              Learn More & Find Solutions
                              <svg
                                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
          );
        })}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Not Sure What&apos;s Causing the Problem?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Our expert technicians will diagnose the issue and provide you with clear
                solutions. We serve all of South Florida with fast response times.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:8553855325"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  <Phone className="w-6 h-6" />
                  Call (855) 385-5325
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-200"
                >
                  Request Free Estimate
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* All Problems Quick Links */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in-up" duration={600}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                All Problem Types We Diagnose
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {allProblems.map((problem) => {
                  const ProblemIcon = getIcon(problem.icon);

                  return (
                    <Link
                      key={problem.slug}
                      href={`/problems/${problem.slug}/`}
                      className="group flex items-center gap-2 p-3 bg-white hover:bg-primary/5 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200"
                    >
                      <ProblemIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="font-medium text-gray-800 group-hover:text-primary transition-colors text-sm truncate">
                        {problem.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

