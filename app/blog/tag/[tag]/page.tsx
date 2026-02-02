import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { TagCloud, getTagData, getAllTagSlugsFromConfig } from '@/components/blog/TagCloud';
import { getPostsByTag } from '@/lib/blog/posts';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd, baseUrl } from '@/lib/seo/schema';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllTagSlugsFromConfig();
  return slugs.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const tagData = getTagData(tag);

  if (!tagData) {
    return generatePageMetadata({
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
      path: `/blog/tag/${tag}`,
    });
  }

  return generatePageMetadata({
    title: tagData.seoTitle,
    description: tagData.seoDescription,
    keywords: [tagData.label.toLowerCase(), 'leak detection', 'articles'],
    path: `/blog/tag/${tag}`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const tagData = getTagData(tag);

  if (!tagData) {
    notFound();
  }

  const posts = getPostsByTag(tag);
  const breadcrumbs = [
    ...generateBreadcrumbs('/blog', 'Blog'),
    { label: tagData.label, href: `/blog/tag/${tag}/` },
  ];
  const pageUrl = `${baseUrl}/blog/tag/${tag}/`;

  // Determine if page should be noindex (fewer than minPosts threshold)
  const shouldNoIndex =
    tagData.minPosts && posts.length < tagData.minPosts;

  // Build unified schema graph for collection page
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'collection',
    pageUrl,
    title: `${tagData.label} - Total Leak Detection`,
    description: tagData.description,
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
      {shouldNoIndex && (
        <meta name="robots" content="noindex, follow" />
      )}
      <Header />
      <main className="min-h-screen">
        <section className="pt-32 pb-12 md:pb-16 bg-gradient-to-br from-accent/10 via-background to-primary/10">
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              {tagData.label}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {tagData.description}
            </p>
            <TagCloud activeTag={tag} />
          </div>
        </section>

        {/* Tag intro content */}
        {tagData.intro && (
          <section className="py-12 bg-white border-b">
            <div className="max-w-4xl mx-auto px-4">
              <div className="prose prose-lg prose-gray max-w-none">
                {tagData.intro.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <CategoryNav />
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No articles with this tag yet. Check back soon!
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
