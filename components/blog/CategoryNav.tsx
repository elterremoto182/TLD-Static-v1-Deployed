import Link from 'next/link';
import { getAllCategories, categoryToSlug } from '@/lib/blog/posts';

interface CategoryNavProps {
  activeCategory?: string;
}

export function CategoryNav({ activeCategory }: CategoryNavProps) {
  const categories = getAllCategories();

  return (
    <nav className="flex flex-wrap gap-3 justify-center" aria-label="Blog categories">
      <Link
        href="/blog/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeCategory
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Posts
      </Link>
      {categories.map((category) => {
        const isActive = activeCategory === category.slug;
        return (
          <Link
            key={category.slug}
            href={`/blog/category/${category.slug}/`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
            <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
          </Link>
        );
      })}
    </nav>
  );
}
