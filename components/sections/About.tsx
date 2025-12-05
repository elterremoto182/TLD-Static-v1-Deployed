import { Shield, Award, Clock, Users, CheckCircle, LucideIcon } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import content from '@/config/content.json';

// Icon mapping for about features - selective imports for better tree-shaking
const iconMap: Record<string, LucideIcon> = {
  Shield,
  Award,
  Clock,
  Users,
  CheckCircle,
};

export function About() {
  const { about } = content;

  return (
    <section id="about" className="py-20 md:py-28 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {about.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {about.description}
            </p>
          </div>
        </AnimateOnScroll>

        {about.teamImage && (
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
            <div className="mb-16">
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-xl">
                <OptimizedImage
                  src={about.teamImage}
                  alt="Our Professional Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </AnimateOnScroll>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {about.stats.map((stat, index) => (
            <AnimateOnScroll
              key={index}
              animation="scale-in"
              duration={500}
              delay={index * 100}
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || CheckCircle;

            return (
              <AnimateOnScroll
                key={index}
                animation="fade-in-up"
                duration={600}
                delay={index * 100}
              >
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <IconComponent className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
