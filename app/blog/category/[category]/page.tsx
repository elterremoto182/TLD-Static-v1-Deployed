import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PostCard } from '@/components/blog/PostCard';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { TagCloud } from '@/components/blog/TagCloud';
import {
  getPostsByCategory,
  getAllCategorySlugs,
  slugToCategory,
} from '@/lib/blog/posts';
import { generatePageMetadata, generateBreadcrumbs } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd, baseUrl } from '@/lib/seo/schema';
import categoriesConfig from '@/config/blog-categories.json';

interface CategoryData {
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
}

function getCategoryData(slug: string): CategoryData | null {
  const data = categoriesConfig.categories[slug as keyof typeof categoriesConfig.categories];
  return data || null;
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = slugToCategory(category);
  const categoryData = getCategoryData(category);

  if (!categoryName) {
    return generatePageMetadata({
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      path: `/blog/category/${category}`,
    });
  }

  return generatePageMetadata({
    title: categoryData?.seoTitle || `${categoryName} Articles | Total Leak Detection Blog`,
    description: categoryData?.seoDescription || `Expert articles about ${categoryName.toLowerCase()}. Tips, guides, and professional insights from Total Leak Detection.`,
    keywords: [categoryName.toLowerCase(), 'blog', 'articles', 'guides'],
    path: `/blog/category/${category}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = slugToCategory(category);

  if (!categoryName) {
    notFound();
  }

  const posts = getPostsByCategory(category);
  const categoryData = getCategoryData(category);
  const breadcrumbs = [
    ...generateBreadcrumbs('/blog', 'Blog'),
    { name: categoryName, href: `/blog/category/${category}/` },
  ];
  const pageUrl = `${baseUrl}/blog/category/${category}/`;

  // Build unified schema graph for collection page
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'collection',
    pageUrl,
    title: `${categoryName} Articles - Total Leak Detection`,
    description: categoryData?.seoDescription || `Expert articles about ${categoryName.toLowerCase()}. Tips, guides, and professional insights.`,
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
        <section className="pt-32 pb-12 md:pb-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              {categoryName}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {posts.length} article{posts.length !== 1 ? 's' : ''} about{' '}
              {categoryName.toLowerCase()}
            </p>
            <CategoryNav activeCategory={category} />
          </div>
        </section>

        {/* Category intro content */}
        {categoryData?.intro && (
          <section className="py-12 bg-white border-b">
            <div className="max-w-4xl mx-auto px-4">
              <div className="prose prose-lg prose-gray max-w-none">
                {categoryData.intro.split('\n\n').map((paragraph, index) => (
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
            <TagCloud />
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No articles in this category yet. Check back soon!
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
                    showCategoryLink={false}
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
