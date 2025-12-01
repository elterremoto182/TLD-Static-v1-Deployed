import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import {
  generateWebPageSchema,
  generateBreadcrumbListSchema,
  structuredDataToJsonLd,
} from '@/lib/seo/structured-data';

export async function generateMetadata() {
  const page = getPageBySlug('about');
  
  if (!page) {
    return generatePageMetadata({
      title: 'About - Total Leak Detection',
      description: 'Learn about Total Leak Detection and our expertise in leak detection services.',
      path: '/about',
    });
  }

  return generatePageMetadata({
    title: page.seo_title || page.title || 'About - Total Leak Detection',
    description: page.seo_description || 'Learn about Total Leak Detection and our expertise in leak detection services.',
    keywords: page.keywords || (page.seo_title ? ['about', 'leak detection', 'Miami'] : undefined),
    path: '/about',
  });
}

export default function AboutPage() {
  const page = getPageBySlug('about');

  if (!page) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const breadcrumbs = generateBreadcrumbs('/about', page.title);
  const webPageSchema = generateWebPageSchema({
    title: page.seo_title || page.title || 'About - Total Leak Detection',
    description: page.seo_description || 'Learn about Total Leak Detection and our expertise in leak detection services.',
    url: `${baseUrl}/about`,
    breadcrumbs,
  });
  const breadcrumbSchema = generateBreadcrumbListSchema(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(breadcrumbSchema),
        }}
      />
      <Header />
      <main className="min-h-screen pt-20">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} />
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

