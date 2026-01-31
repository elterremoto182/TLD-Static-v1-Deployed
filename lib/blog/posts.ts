import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  seo_title?: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
  tags?: string[];
  image?: string;
  imageAlt?: string;
  content: string;
}

// Category display name to URL slug mapping
const categorySlugMap: Record<string, string> = {
  'Leak Detection': 'leak-detection',
  'Mold Testing': 'mold-testing',
  'Sewer Camera Inspection': 'sewer-camera-inspection',
  'Drain Cleaning': 'drain-cleaning',
};

// Reverse mapping: URL slug to display name
const slugCategoryMap: Record<string, string> = Object.entries(categorySlugMap).reduce(
  (acc, [name, slug]) => ({ ...acc, [slug]: name }),
  {} as Record<string, string>
);

export function categoryToSlug(category: string): string {
  return categorySlugMap[category] || category.toLowerCase().replace(/\s+/g, '-');
}

export function slugToCategory(slug: string): string | undefined {
  return slugCategoryMap[slug];
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: realSlug,
      title: data.title || '',
      seo_title: data.seo_title,
      date: data.date || '',
      excerpt: data.excerpt || '',
      author: data.author || '',
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      image: data.image || '',
      imageAlt: data.imageAlt || '',
      content,
    };
  } catch (error) {
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  const categoryName = slugToCategory(categorySlug);
  if (!categoryName) return [];
  
  return getAllPosts().filter(
    (post) => post.category.toLowerCase() === categoryName.toLowerCase()
  );
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(
    (post) => post.tags && post.tags.includes(tag)
  );
}

export function getAllCategories(): { slug: string; name: string; count: number }[] {
  const posts = getAllPosts();
  const categoryCounts: Record<string, number> = {};
  
  for (const post of posts) {
    if (post.category) {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    }
  }
  
  return Object.entries(categoryCounts)
    .map(([name, count]) => ({
      slug: categoryToSlug(name),
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  
  for (const post of posts) {
    if (post.tags) {
      post.tags.forEach((tag) => tags.add(tag));
    }
  }
  
  return Array.from(tags).sort();
}

export function getCategoryPostCounts(): Record<string, number> {
  const categories = getAllCategories();
  return categories.reduce(
    (acc, cat) => ({ ...acc, [cat.slug]: cat.count }),
    {} as Record<string, number>
  );
}

export function getTagPostCounts(): Record<string, number> {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};
  
  for (const post of posts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
  }
  
  return tagCounts;
}

// Get all valid category slugs for static generation
export function getAllCategorySlugs(): string[] {
  return Object.values(categorySlugMap);
}

// Get all valid tag slugs for static generation
export function getAllTagSlugs(): string[] {
  return getAllTags();
}
