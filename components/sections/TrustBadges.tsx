import OptimizedImage from '@/components/OptimizedImage';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { Shield, Award, CheckCircle, BadgeCheck, FileCheck, Users } from 'lucide-react';
import content from '@/config/content.json';

export function TrustBadges() {
  const { branding } = content;

  // Default badges with icons if not provided in config
  const defaultBadges = [
    {
      name: 'Licensed & Insured',
      icon: Shield,
      description: 'Fully licensed and insured for your protection',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      iconColor: 'text-blue-600',
      image: '',
    },
    {
      name: 'BBB Accredited',
      icon: Award,
      description: 'Better Business Bureau accredited business',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      iconColor: 'text-yellow-600',
      image: '',
    },
    {
      name: 'Certified Professional',
      icon: BadgeCheck,
      description: 'Industry certified technicians',
      color: 'bg-green-50 border-green-200 text-green-700',
      iconColor: 'text-green-600',
      image: '',
    },
    {
      name: 'Satisfaction Guaranteed',
      icon: CheckCircle,
      description: '100% satisfaction guarantee',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      iconColor: 'text-purple-600',
      image: '',
    },
  ];

  const badges = branding?.badges && branding.badges.length > 0 
    ? branding.badges.map((badge, index) => ({
        ...defaultBadges[index % defaultBadges.length],
        ...badge, // Config badges override defaults
      }))
    : defaultBadges;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Trusted & Certified
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your peace of mind is our priority. We're fully licensed, insured, and committed to excellence.
            </p>
            
            {/* License Number - Prominently Displayed */}
            <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-xl border-2 border-primary shadow-lg mb-12">
              <FileCheck className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="text-sm text-gray-600 font-medium">Florida Licensed Contractor</p>
                <p className="text-lg font-bold text-gray-900">
                  License # {branding?.licenseNumber || 'CFC1430460'}
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon || Shield;
            const hasImage = badge.image && badge.image !== '';

            return (
              <AnimateOnScroll
                key={index}
                animation="fade-in-up"
                duration={600}
                delay={index * 100}
              >
                <div className={`bg-white rounded-xl border-2 ${badge.color || 'border-gray-200'} p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group`}>
                  <div className="flex flex-col items-center text-center">
                    {hasImage ? (
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-md mb-4 group-hover:shadow-lg transition-shadow duration-200 border-2 border-gray-100">
                        <OptimizedImage
                          src={badge.image}
                          alt={badge.name}
                          width={80}
                          height={80}
                          className="object-contain p-2"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className={`w-20 h-20 rounded-full ${badge.color || 'bg-primary/10'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-10 h-10 ${badge.iconColor || 'text-primary'}`} />
                      </div>
                    )}
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {badge.name}
                    </h3>
                    {badge.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {badge.description}
                      </p>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Additional Trust Indicators */}
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={400}>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">1000+ Satisfied Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="font-medium">10+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">24/7 Emergency Service</span>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
