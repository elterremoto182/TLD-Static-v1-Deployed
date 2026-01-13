import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import siteConfig from '@/config/site.json';
import { StickyCallButton } from '@/components/StickyCallButton';
import { generateOrganizationSchema, schemaToJsonLd } from '@/lib/seo/schema';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional', // Changed from 'swap' for faster FCP - font renders immediately with fallback
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com'),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faviconPath = siteConfig.favicon || '/favicon.ico';

  // Organization schema is included in each page's @graph,
  // but we keep a standalone version here for any pages that might not have their own schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    ...generateOrganizationSchema(),
  };

  // Get critical image paths for preloading
  const heroBackgroundImage = '/images/hero/hero-background.jpeg';
  const logoImage = siteConfig.logo || '/images/logo.png';

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload critical images with explicit types for better optimization */}
        <link
          rel="preload"
          href={heroBackgroundImage}
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href={logoImage}
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        <link rel="icon" href={faviconPath} />
        <link rel="apple-touch-icon" href={faviconPath} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: schemaToJsonLd(organizationSchema),
          }}
        />
      </head>
      <body>
        {children}
        <StickyCallButton />
      </body>
    </html>
  );
}
