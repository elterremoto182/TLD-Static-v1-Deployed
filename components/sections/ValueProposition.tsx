import { CheckCircle } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

const detectTypes = [
  'Slab leaks under foundations',
  'Pipe leaks behind walls',
  'Water line leaks underground',
  'Pool and spa leaks',
];

export function ValueProposition() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Why Homeowners Choose Us for Leak Detection
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto leading-relaxed">
            Finding a hidden water leak can save you thousands in damage. Our Miami-based team 
            uses advanced acoustic and thermal technology to pinpoint leaks without tearing up 
            your property.
          </p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={200}>
            <div className="bg-muted/30 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What We Detect
              </h3>
              <ul className="space-y-3">
                {detectTypes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-in-up" duration={600} delay={300}>
            <div className="bg-muted/30 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Our Approach
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We arrive on time, explain what we find, and provide a detailed report within 48 hours. 
                No guesswork, no unnecessary demolition.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">48hr</div>
                    <div className="text-sm text-gray-500">Report Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-sm text-gray-500">Non-Invasive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">$49</div>
                    <div className="text-sm text-gray-500">Evaluation</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}

