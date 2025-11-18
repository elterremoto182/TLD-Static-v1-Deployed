import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Metadata } from 'next';
import siteConfig from '@/config/site.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  path = '',
  ogImage,
}: {
  title: string;
  description?: string;
  keywords?: string | string[];
  path?: string;
  ogImage?: string;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const url = `${baseUrl}${path}`;
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

  return {
    title,
    description: finalDescription,
    keywords: keywordsArray.length > 0 ? keywordsArray.join(', ') : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: finalDescription,
      images: [ogImageUrl],
    },
  };
}
