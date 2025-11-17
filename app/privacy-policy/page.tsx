import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { getPageBySlug } from '@/lib/pages/pages';
import { Home } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('privacy-policy');
  
  if (!page) {
    return {
      title: 'Privacy Policy - Total Leak Detection',
    };
  }

  return {
    title: page.seo_title || page.title,
    description: page.seo_description || '',
  };
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

