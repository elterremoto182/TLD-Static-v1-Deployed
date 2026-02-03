import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { TagCloud } from '@/components/blog/TagCloud';
import { getAllPosts } from '@/lib/blog/posts';
import { getPageBySlug } from '@/lib/pages/pages';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd, baseUrl } from '@/lib/seo/schema';

export async function generateMetadata() {
  const page = getPageBySlug('blog');
  
  return generatePageMetadata({
    title: page?.seo_title || page?.title || 'Total Leak Detection',
    description: page?.seo_description || 'Expert tips, guides, and insights for maintaining your home plumbing and leak detection.',
    keywords: page?.keywords || ['blog', 'plumbing tips', 'leak detection'],
    path: '/blog',
  });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const breadcrumbs = generateBreadcrumbs('/blog', 'Blog');
  const pageUrl = `${baseUrl}/blog/`;
  
  // Build unified schema graph
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'collection',
    pageUrl,
    title: 'Blog - Total Leak Detection',
    description: 'Expert tips, guides, and insights for maintaining your home plumbing and leak detection.',
    breadcrumbs,
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
      <main className="min-h-screen">
        <section className="pt-32 pb-20 md:pb-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Expert tips, guides, and insights for maintaining your home
            </p>
            <CategoryNav />
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <TagCloud />
          </div>
        </section>

        <section className="py-12 bg-background">
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
                  <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    author={post.author}
                    category={post.category}
                    image={post.image}
                    imageAlt={post.imageAlt}
                  />
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
