import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { About } from '@/components/sections/About';
import { Gallery } from '@/components/sections/Gallery';
import { Testimonials } from '@/components/sections/Testimonials';
import { TrustBadges } from '@/components/sections/TrustBadges';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata } from '@/lib/utils';

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
  return (
    <>
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
