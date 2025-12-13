import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownRenderer, processMarkdown } from '@/components/blog/MarkdownRenderer';
import { YouTubeHydrator } from '@/components/YouTubeHydrator';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import {
  generateWebPageSchema,
  generateBreadcrumbListSchema,
  structuredDataToJsonLd,
} from '@/lib/seo/structured-data';

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

export default async function PrivacyPolicyPage() {
  const page = getPageBySlug('privacy-policy');

  if (!page) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const breadcrumbs = generateBreadcrumbs('/privacy-policy', page.title);
  const webPageSchema = generateWebPageSchema({
    title: page.seo_title || page.title || 'Privacy Policy - Total Leak Detection',
    description: page.seo_description || 'Privacy Policy for Total Leak Detection.',
    url: `${baseUrl}/privacy-policy`,
    breadcrumbs,
  });
  const breadcrumbSchema = generateBreadcrumbListSchema(breadcrumbs);
  const html = await processMarkdown(page.content);

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

          <YouTubeHydrator>
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer html={html} />
            </div>
          </YouTubeHydrator>
        </article>
      </main>
      <Footer />
    </>
  );
}

