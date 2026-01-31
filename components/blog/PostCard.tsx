import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { categoryToSlug } from '@/lib/blog/posts';

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  showCategoryLink?: boolean;
}

export function PostCard({
  slug,
  title,
  excerpt,
  date,
  author,
  category,
  image,
  imageAlt,
  showCategoryLink = true,
}: PostCardProps) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      {image && (
        <div className="aspect-video relative">
          <Image
            src={image}
            alt={imageAlt || title}
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
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {author && (
            <span className="inline-flex items-center">
              <User className="w-4 h-4 mr-1" />
              {author}
            </span>
          )}
        </div>

        {category && (
          showCategoryLink ? (
            <Link
              href={`/blog/category/${categoryToSlug(category)}/`}
              className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3 hover:bg-primary/20 transition-colors"
            >
              {category}
            </Link>
          ) : (
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
              {category}
            </span>
          )
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>

        <Link
          href={`/${slug}/`}
          className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </article>
  );
}
