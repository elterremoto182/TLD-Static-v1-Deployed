import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import content from '@/config/content.json';

export function CTABanner() {
  const { cta } = content;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {cta.backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <OptimizedImage
              src={cta.backgroundImage}
              alt="CTA background"
              fill
              className="object-cover"
              sizes="100vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-primary/90" />
          </div>
        </>
      )}

      {!cta.backgroundImage && (
        <div className="absolute inset-0 z-0 bg-primary" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            {cta.headline}
          </h2>

        <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            {cta.description}
          </p>

        <Link
            href={cta.buttonHref}
            className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 transition-all duration-200"
          >
            {cta.buttonText}
          </Link>
      </div>
    </section>
  );
}
