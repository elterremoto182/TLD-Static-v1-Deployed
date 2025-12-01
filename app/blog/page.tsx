import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { getAllPosts } from '@/lib/blog/posts';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { generateCollectionPageSchema, structuredDataToJsonLd } from '@/lib/seo/structured-data';

export async function generateMetadata() {
  const page = getPageBySlug('blog');
  
  return generatePageMetadata({
    title: page?.seo_title || page?.title || 'Total Leak Detection',
    description: page?.seo_description || 'Expert tips, guides, and insights for maintaining your home plumbing and leak detection.',
    keywords: page?.seo_title ? ['blog', 'plumbing tips', 'leak detection'] : undefined,
    path: '/blog',
  });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const breadcrumbs = generateBreadcrumbs('/blog', 'Blog');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const collectionPageSchema = generateCollectionPageSchema({
    title: 'Blog - Total Leak Detection',
    description: 'Expert tips, guides, and insights for maintaining your home plumbing and leak detection.',
    url: `${baseUrl}/blog`,
    breadcrumbs,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: structuredDataToJsonLd(collectionPageSchema),
        }}
      />
      <Header />
      <main className="min-h-screen">
        <section className="pt-32 pb-20 md:pb-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert tips, guides, and insights for maintaining your home
            </p>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No blog posts available yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                  >
                    {post.image && (
                      <div className="aspect-video relative">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="inline-flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        {post.author && (
                          <span className="inline-flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                          </span>
                        )}
                      </div>

                      {post.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                          {post.category}
                        </span>
                      )}

                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <Link
                        href={`/${post.slug}`}
                        className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
