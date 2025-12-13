import dynamic from 'next/dynamic';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata } from '@/lib/utils';
import { generateLocalBusinessSchema, structuredDataToJsonLd } from '@/lib/seo/structured-data';

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

export async function generateMetadata() {
  const page = getPageBySlug('home');
  
  return generatePageMetadata({
    title: page?.seo_title || page?.title || 'Water Meter Leak Detection, Miami Florida | Total Leak Detection',
    description: page?.seo_description || 'Get water leak detection in Florida. Get plumbing & water meter repair services. Plumbing reports in 2 days. Licensed & insured. Get a free estimate today!',
    keywords: page?.seo_title ? ['water leak detection'] : undefined,
    path: '/',
  });
}

export default function Home() {
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      {/* Structured data - placed early in body for static export compatibility */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(localBusinessSchema),
        }}
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Gallery />
        <Testimonials />
        <TrustBadges />
        <CTABanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
