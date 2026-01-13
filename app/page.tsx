import dynamic from 'next/dynamic';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { ValueProposition } from '@/components/sections/ValueProposition';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { ServiceAreas } from '@/components/sections/ServiceAreas';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd, baseUrl } from '@/lib/seo/schema';
import { faqs } from '@/lib/seo/faq-data';

// Lazy load below-the-fold components to reduce initial bundle size
const Gallery = dynamic(() => import('@/components/sections/Gallery').then(mod => ({ default: mod.Gallery })), {
  ssr: true, // Keep SSR for SEO, but lazy load JS
});

const Testimonials = dynamic(() => import('@/components/sections/Testimonials').then(mod => ({ default: mod.Testimonials })), {
  ssr: true,
});

const TrustBadges = dynamic(() => import('@/components/sections/TrustBadges').then(mod => ({ default: mod.TrustBadges })), {
  ssr: true,
});

const FAQ = dynamic(() => import('@/components/sections/FAQ').then(mod => ({ default: mod.FAQ })), {
  ssr: true,
});

export async function generateMetadata() {
  const page = getPageBySlug('home');
  
  return generatePageMetadata({
    title: page?.seo_title || page?.title || 'Leak Detection Miami | Water Leak Detection Services',
    description: page?.seo_description || 'Need leak detection in Miami? Our licensed technicians find hidden water leaks fast using non-invasive methods. Family-owned since 2005. Free estimates!',
    keywords: page?.keywords || ['leak detection miami', 'water leak detection', 'leak detection near me'],
    path: '/',
  });
}

export default function Home() {
  // Build unified schema graph with all structured data
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'home',
    pageUrl: baseUrl,
    title: 'Leak Detection Miami | Water Leak Detection Services',
    description: 'Professional water leak detection services in Miami FL. Non-invasive leak detection for residential and commercial properties.',
    service: {
      name: 'Leak Detection',
      description: 'Professional water leak detection services in Miami FL. Non-invasive leak detection for residential and commercial properties.',
      serviceType: 'Water Leak Detection',
    },
    faqs,
  });

  return (
    <>
      {/* Unified structured data with @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd(schemaGraph),
        }}
      />
      <Header />
      <main>
        <Hero />
        <ValueProposition />
        <Services />
        <ServiceAreas />
        <About />
        <Gallery />
        <Testimonials />
        <FAQ />
        <TrustBadges />
        <CTABanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
