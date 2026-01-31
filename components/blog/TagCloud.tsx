import Link from 'next/link';
import { getTagPostCounts } from '@/lib/blog/posts';
import blogTagsData from '@/config/blog-tags.json';
import {
  ShieldCheck,
  Cpu,
  Building2,
  FileText,
  AlertTriangle,
  Tag,
} from 'lucide-react';

interface TagCloudProps {
  activeTag?: string;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'shield-check': ShieldCheck,
  'cpu': Cpu,
  'building-2': Building2,
  'file-text': FileText,
  'alert-triangle': AlertTriangle,
};

export interface TagData {
  label: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  indexable: boolean;
  minPosts?: number;
  icon: string;
  intro?: string;
}

export function TagCloud({ activeTag }: TagCloudProps) {
  const tagCounts = getTagPostCounts();
  const tags = blogTagsData.tags as Record<string, TagData>;

  // Only show tags that have at least one post
  const activeTags = Object.entries(tags).filter(
    ([slug]) => tagCounts[slug] && tagCounts[slug] > 0
  );

  if (activeTags.length === 0) {
    return null;
  }

  return (
    <nav className="flex flex-wrap gap-2 justify-center" aria-label="Blog tags">
      {activeTags.map(([slug, tag]) => {
        const isActive = activeTag === slug;
        const count = tagCounts[slug] || 0;
        const IconComponent = iconMap[tag.icon] || Tag;

        return (
          <Link
            key={slug}
            href={`/blog/tag/${slug}/`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
            title={tag.description}
          >
            <IconComponent className="w-3.5 h-3.5" />
            {tag.label}
            <span className="text-xs opacity-60">({count})</span>
          </Link>
        );
      })}
    </nav>
  );
}

// Export tag data getter for use in pages
export function getTagData(slug: string): TagData | undefined {
  const tags = blogTagsData.tags as Record<string, TagData>;
  return tags[slug];
}

// Export all tag slugs for static generation
export function getAllTagSlugsFromConfig(): string[] {
  return Object.keys(blogTagsData.tags);
}
