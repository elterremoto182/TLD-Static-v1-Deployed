import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Metadata } from 'next';
import siteConfig from '@/config/site.json';
import type { BreadcrumbItem } from '@/components/ui/breadcrumb';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate breadcrumb items based on path and title
 */
export function generateBreadcrumbs(path: string, title: string): BreadcrumbItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  // Remove leading/trailing slashes and split path
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const pathParts = cleanPath.split('/').filter(Boolean);

  // Build breadcrumbs from path parts
  let currentPath = '';
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    currentPath += `/${part}`;

    // Skip the last part (current page) - we'll add it with the title
    if (i < pathParts.length - 1) {
      // Capitalize and format the label
      const label = part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      items.push({
        label,
        href: currentPath,
      });
    }
  }

  // Add the current page with its title
  items.push({
    label: title,
    href: path,
  });

  return items;
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  path = '',
  ogImage,
  articleAuthor,
  articlePublishedTime,
  articleModifiedTime,
  articleType = 'website',
}: {
  title: string;
  description?: string;
  keywords?: string | string[];
  path?: string;
  ogImage?: string;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleType?: 'website' | 'article';
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  
  // Home page: canonical without trailing slash (https://totalleakdetection.com)
  // All other pages: trailing slash per Next.js trailingSlash configuration
  let canonicalPath = path;
  if (!path || path === '/') {
    canonicalPath = '';
  } else if (!path.endsWith('/')) {
    canonicalPath = `${path}/`;
  }
  
  const url = `${baseUrl}${canonicalPath}`;
  const finalDescription = description || siteConfig.seo.description;
  const finalOgImage = ogImage || siteConfig.seo.ogImage;
  const ogImageUrl = finalOgImage.startsWith('http') 
    ? finalOgImage 
    : `${baseUrl}${finalOgImage}`;
  
  const keywordsArray = Array.isArray(keywords) 
    ? keywords 
    : keywords 
      ? [keywords] 
      : siteConfig.seo.keywords 
        ? [siteConfig.seo.keywords] 
        : [];

  const openGraphConfig: any = {
    title,
    description: finalDescription,
    url,
    siteName: siteConfig.name,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    type: articleType,
  };

  // Add article-specific metadata
  if (articleType === 'article') {
    if (articleAuthor) {
      openGraphConfig.authors = [articleAuthor];
    }
    if (articlePublishedTime) {
      openGraphConfig.publishedTime = articlePublishedTime;
    }
    if (articleModifiedTime) {
      openGraphConfig.modifiedTime = articleModifiedTime;
    }
  }

  return {
    title,
    description: finalDescription,
    keywords: keywordsArray.length > 0 ? keywordsArray.join(', ') : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: openGraphConfig,
    twitter: {
      card: 'summary_large_image',
      title,
      description: finalDescription,
      images: [ogImageUrl],
    },
  };
}
