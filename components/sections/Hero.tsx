'use client';

import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import content from '@/config/content.json';

export function Hero() {
  const { hero } = content;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {hero.backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <VideoPlayer
            src={hero.backgroundVideo}
            autoPlay
            loop
            muted
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {!hero.backgroundVideo && hero.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={hero.backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />
        </div>
      )}

      {!hero.backgroundVideo && !hero.backgroundImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1
          className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 ${
            hero.backgroundVideo || hero.backgroundImage
              ? 'text-white'
              : 'text-gray-900'
          }`}
        >
          {hero.headline}
        </h1>

        <p
          className={`text-xl md:text-2xl mb-8 leading-relaxed ${
            hero.backgroundVideo || hero.backgroundImage
              ? 'text-gray-100'
              : 'text-gray-600'
          }`}
        >
          {hero.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={hero.ctaPrimary.href}
            className="inline-block bg-accent text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            {hero.ctaPrimary.text}
          </Link>

          <Link
            href={hero.ctaSecondary.href}
            className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-primary transition-all duration-200"
          >
            {hero.ctaSecondary.text}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className={`w-6 h-6 ${
            hero.backgroundVideo || hero.backgroundImage
              ? 'text-white'
              : 'text-gray-400'
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
