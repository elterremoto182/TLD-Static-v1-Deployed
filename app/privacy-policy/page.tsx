import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { getPageBySlug } from '@/lib/pages/pages';
import { Home } from 'lucide-react';
import { generatePageMetadata } from '@/lib/utils';

export async function generateMetadata() {
  const page = getPageBySlug('privacy-policy');
  
  if (!page) {
    return generatePageMetadata({
      title: 'Privacy Policy - Total Leak Detection',
      description: 'Privacy Policy for Total Leak Detection.',
      path: '/privacy-policy',
    });
  }

  return generatePageMetadata({
    title: page.seo_title || page.title || 'Privacy Policy - Total Leak Detection',
    description: page.seo_description || 'Privacy Policy for Total Leak Detection.',
    keywords: page.keywords || (page.seo_title ? ['privacy policy'] : undefined),
    path: '/privacy-policy',
  });
}

export default function PrivacyPolicyPage() {
  const page = getPageBySlug('privacy-policy');

  if (!page) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200 mb-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer content={page.content} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

