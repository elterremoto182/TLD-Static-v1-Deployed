import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata } from '@/lib/utils';

export async function generateMetadata() {
  const page = getPageBySlug('contact');
  
  return generatePageMetadata({
    title: page?.seo_title || page?.title || 'Contact Us - Total Leak Detection',
    description: page?.seo_description || 'Get in touch with Total Leak Detection. Schedule an estimate or receive more information on our leak detection services in Miami, FL.',
    keywords: page?.seo_title ? ['contact', 'leak detection', 'Miami'] : undefined,
    path: '/contact',
  });
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

