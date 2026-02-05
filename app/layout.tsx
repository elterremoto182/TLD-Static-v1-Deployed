import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import siteConfig from '@/config/site.json';
import { StickyCallButton } from '@/components/StickyCallButton';
import { generateOrganizationSchema, schemaToJsonLd } from '@/lib/seo/schema';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
// Microsoft Clarity ID for heatmaps & session recordings
const CLARITY_ID = 'vcow2597yw';

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

  // Logo is above-the-fold on every page; hero image is preloaded only on homepage via (home)/layout
  const logoImage = siteConfig.logo || '/images/logo.png';

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to analytics domains for faster script loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        {/* Preload logo - above-the-fold on every page */}
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
        
        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        {/* Microsoft Clarity - Heatmaps & Session Recordings */}
        {CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/${CLARITY_ID}";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script");
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
