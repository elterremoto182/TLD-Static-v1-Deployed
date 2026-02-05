'use client';

import { 
  Trophy, 
  Clock, 
  DollarSign, 
  Wrench, 
  Star,
  Shield,
  CheckCircle,
  Phone
} from 'lucide-react';

interface WhyChooseUsItem {
  icon: 'trophy' | 'clock' | 'dollar' | 'wrench' | 'shield' | 'star';
  title: string;
  items: string[];
}

interface WhyChooseUsProps {
  title?: string;
  subtitle?: string;
  sections: WhyChooseUsItem[];
  testimonial?: {
    quote: string;
    author: string;
  };
  stats?: {
    rating: string;
    reviews: string;
    projects: string;
  };
}

const iconMap = {
  trophy: Trophy,
  clock: Clock,
  dollar: DollarSign,
  wrench: Wrench,
  shield: Shield,
  star: Star,
};

export function WhyChooseUs({
  title = 'Why Choose Total Leak Detection',
  subtitle,
  sections,
  testimonial,
  stats,
}: WhyChooseUsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
            {stats && (
              <p className="text-xl font-semibold text-primary mt-4">
                {stats.rating} Google Rating | {stats.reviews} Five-Star Reviews | {stats.projects} Projects
              </p>
            )}
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => {
            const IconComponent = iconMap[section.icon];
            return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            );
          })}
        </div>

        {testimonial && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 max-w-3xl mx-auto text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <blockquote className="text-lg text-gray-700 italic mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <p className="text-gray-900 font-semibold">— {testimonial.author}</p>
            </div>
        )}
      </div>
    </section>
  );
}
