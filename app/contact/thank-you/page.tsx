import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { ThankYouAnalytics } from '@/components/ThankYouAnalytics';
import OptimizedImage from '@/components/OptimizedImage';
import { 
  CheckCircle, 
  Phone, 
  Clock, 
  ArrowRight, 
  BookOpen,
  Droplets,
  Camera,
  AlertTriangle,
  Waves,
  Star,
  Shield,
  FileText
} from 'lucide-react';
import siteConfig from '@/config/site.json';

// noindex - this is a utility page, not meant for search results
export const metadata: Metadata = {
  title: 'Thank You - Total Leak Detection',
  description: 'Thank you for contacting Total Leak Detection. We will respond within 2 hours during business hours.',
  robots: {
    index: false,
    follow: false,
  },
};

// Guide resources to display
const GUIDES = [
  {
    title: 'Leak Detection Guide',
    description: 'Learn how to identify hidden water leaks and what to do when you find one.',
    href: '/guides/leak-detection/',
    icon: Droplets,
    image: '/images/services/leak-detection.jpg',
  },
  {
    title: 'Sewer Camera Inspection Guide',
    description: 'Everything you need to know about video pipe inspections.',
    href: '/guides/sewer-camera-inspection/',
    icon: Camera,
    image: '/images/gallery/camera-inspection-after.jpg',
  },
  {
    title: 'Mold Testing Guide',
    description: 'Understand mold risks, testing methods, and when to call professionals.',
    href: '/guides/mold-testing/',
    icon: AlertTriangle,
    image: '/images/services/mold.jpg',
  },
  {
    title: 'Drain Cleaning Guide',
    description: 'Prevent clogs and learn when professional drain cleaning is needed.',
    href: '/guides/drain-cleaning/',
    icon: Waves,
    image: '/images/services/drain-cleaning.jpg',
  },
];

// Popular blog posts
const POPULAR_POSTS = [
  {
    title: 'Signs You Have a Hidden Water Leak',
    href: '/blog/signs-you-have-a-hidden-water-leak/',
    readTime: '5 min read',
  },
  {
    title: 'How to Prevent Water Leaks in Your Florida Home',
    href: '/blog/how-to-prevent-water-leaks-in-your-florida-home/',
    readTime: '7 min read',
  },
  {
    title: 'How Long After Water Damage Does Mold Grow?',
    href: '/blog/how-long-after-water-damage-does-mold-grow/',
    readTime: '4 min read',
  },
];

export default function ThankYouPage() {
  return (
    <>
      <ThankYouAnalytics />
      <Header />
      <main className="min-h-screen pt-20">
        {/* Confirmation Hero */}
        <section className="bg-gradient-to-br from-green-50 via-white to-primary/5 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                Thank You for Reaching Out!
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                We will reach out within 
                <span className="font-semibold text-gray-900"> 10 minutes</span>.
              </p>

              {/* What happens next */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  What Happens Next
                </h2>
                <ol className="text-left space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">1</span>
                    <div>
                      <p className="font-medium text-gray-900">We review your request</p>
                      <p className="text-sm text-gray-600">Our team assesses your needs to prepare the best solution.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">2</span>
                    <div>
                      <p className="font-medium text-gray-900">A technician calls you</p>
                      <p className="text-sm text-gray-600">We&apos;ll discuss your situation and answer any questions.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">3</span>
                    <div>
                      <p className="font-medium text-gray-900">We schedule your service</p>
                      <p className="text-sm text-gray-600">Same-day service often available for urgent issues.</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Emergency CTA */}
              <div className="bg-primary text-white rounded-xl p-5 max-w-md mx-auto">
                <p className="text-sm text-white/90 mb-2">Need immediate assistance?</p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="inline-flex items-center gap-2 text-2xl font-bold hover:underline"
                >
                  <Phone className="w-6 h-6" />
                  {siteConfig.phone}
                </a>
                <p className="text-xs text-white/80 mt-1">Available 24/7 for emergencies</p>
              </div>
          </div>
        </section>

        {/* While You Wait - Guides */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    While You Wait
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Helpful Resources for Homeowners
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse our guides to learn more about common plumbing issues and how we solve them.
                </p>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {GUIDES.map((guide) => {
                const IconComponent = guide.icon;
                return (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          src={guide.image}
                          alt={guide.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {guide.description}
                        </p>
                        <span className="inline-flex items-center text-sm text-primary font-medium">
                          Read Guide
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Blog Posts */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Popular Articles
                </h2>
                <p className="text-gray-600">
                  Tips and insights from our plumbing experts
                </p>
              </div>

            <div className="space-y-4">
              {POPULAR_POSTS.map((post) => (
                  <Link
                    key={post.href}
                    href={post.href}
                    className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-primary/30 transition-colors">
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500">{post.readTime}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/blog/"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                View All Articles
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust & Testimonial */}
        <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="max-w-4xl mx-auto px-4">
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-white/90">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">4.6 Rating (137 Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Serving Florida Since 2019</span>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl text-white italic mb-4 max-w-2xl mx-auto">
                  &ldquo;Luis and Richard were awesome and extremely helpful in helping me evaluate a potential 
                  mold problem at my house. Hugely professional. Arrived right on time. I highly recommend 
                  working with Total Leak Detection.&rdquo;
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">GS</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">Gabrielle Shirek</p>
                    <p className="text-white/70 text-sm">Verified Google Review</p>
                  </div>
                </div>
              </div>

              {/* Return home link */}
              <div className="text-center mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Return to Homepage
                </Link>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
