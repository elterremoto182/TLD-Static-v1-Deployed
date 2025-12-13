import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import siteConfig from '@/config/site.json';
import { StickyCallButton } from '@/components/StickyCallButton';
import { generateOrganizationSchema, structuredDataToJsonLd } from '@/lib/seo/structured-data';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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

  const organizationSchema = generateOrganizationSchema();

  // Get critical image paths for preloading
  const heroBackgroundImage = '/images/hero/hero-background.jpeg';
  const logoImage = siteConfig.logo || '/images/logo.png';

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical images */}
        <link
          rel="preload"
          href={heroBackgroundImage}
          as="image"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href={logoImage}
          as="image"
          fetchPriority="high"
        />
        <link rel="icon" href={faviconPath} />
        <link rel="apple-touch-icon" href={faviconPath} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: structuredDataToJsonLd(organizationSchema),
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
