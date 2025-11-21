import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { getPostBySlug, getAllPosts } from '@/lib/blog/posts';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { generatePageMetadata } from '@/lib/utils';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Handle params as either a direct object or Promise (Next.js 14.2 compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  
  if (!resolvedParams || typeof resolvedParams !== 'object' || !resolvedParams.slug) {
    return generatePageMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      path: '/blog',
    });
  }
  
  const slug = String(resolvedParams.slug || '').trim();
  const post = getPostBySlug(slug);

  if (!post) {
    return generatePageMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      path: `/blog/${slug}`,
    });
  }

  return generatePageMetadata({
    title: `${post.title} | Blog - Total Leak Detection`,
    description: post.excerpt || post.title,
    keywords: post.category ? [post.category, 'blog'] : ['blog'],
    path: `/blog/${post.slug}`,
    ogImage: post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Handle params as either a direct object or Promise (Next.js 14.2 compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  
  if (!resolvedParams || typeof resolvedParams !== 'object' || !resolvedParams.slug) {
    notFound();
  }
  
  const slug = String(resolvedParams.slug || '').trim();
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <article className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {post.category && (
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <span className="inline-flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {post.author && (
                <span className="inline-flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {post.author}
                </span>
              )}
            </div>

            {post.image && (
              <div className="aspect-video rounded-xl overflow-hidden mb-12 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 90vw"
                />
              </div>
            )}

            <MarkdownRenderer content={post.content} />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/blog"
                className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
