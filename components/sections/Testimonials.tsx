import OptimizedImage from '@/components/OptimizedImage';
import { Star } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import content from '@/config/content.json';

export function Testimonials() {
  const { testimonials } = content;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimateOnScroll
              key={testimonial.id}
              animation="fade-in-up"
              duration={600}
              delay={index * 100}
            >
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-accent fill-current"
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-4 overflow-hidden">
                  {testimonial.image ? (
                    <OptimizedImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={96}
                      height={96}
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
