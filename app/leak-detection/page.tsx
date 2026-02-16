import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Shield, Clock, CheckCircle, Droplet } from 'lucide-react';

import { getService, getAllCities, getServiceVideo } from '@/lib/local-seo/data';
import {
  generateServiceHubBreadcrumbs,
  buildPageSchemaGraph,
  schemaToJsonLd,
} from '@/lib/local-seo/schema';
import { getServiceHubCanonicalUrl } from '@/lib/local-seo/links';
import { 
  ServiceHubCityGrid, 
  ServiceProcess, 
  LocalCTA, 
  ServiceVideoEmbed,
  ServiceUrgency,
  ServiceBenefits,
  WhyChooseUs,
  LocalFAQ,
  RelatedProblems,
  RealWorkGallery,
} from '@/components/local-seo';

const SERVICE_SLUG = 'leak-detection';

// Enhanced SEO metadata from markdown content
export async function generateMetadata() {
  const service = getService(SERVICE_SLUG);
  if (!service) return { title: 'Service Not Found' };
  
  const canonicalUrl = getServiceHubCanonicalUrl(SERVICE_SLUG);
  
  return {
    title: 'Leak Detection Services Florida | 24/7 Expert Water Leak Locators',
    description: 'Hire leak detection services in Miami, Ft Lauderdale & more. Quick & accurate detection & repairs. 40+ years of experience. Commercial & residential.',
    keywords: [
      'water leak detection services',
      'leak detection',
      'professional leak detection',
      'plumbing leak detection',
      'hidden leak detection',
      'slab leak detection',
      'pipe leak detection',
      'non-invasive leak detection',
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: 'Leak Detection Services Florida | Total Leak Detection',
      description: 'Professional water leak detection services throughout South Florida. Non-invasive methods, 24/7 emergency service, free estimates.',
      url: canonicalUrl,
      type: 'website',
    },
  };
}

// Content data for the page sections
const urgencyItems = [
  {
    icon: 'home' as const,
    title: 'Foundation Damage',
    description: 'Costing $5,000-$15,000+ to repair when water weakens structural supports',
  },
  {
    icon: 'alert' as const,
    title: 'Mold Growth',
    description: 'Threatens your family\'s health and requires expensive remediation',
  },
  {
    icon: 'dollar' as const,
    title: 'Skyrocketing Bills',
    description: 'Water bills can double or triple your monthly costs from hidden leaks',
  },
  {
    icon: 'trending' as const,
    title: 'Property Value Loss',
    description: 'Can reduce your home\'s worth by tens of thousands of dollars',
  },
  {
    icon: 'droplet' as const,
    title: 'Structural Damage',
    description: 'Walls, floors, and ceilings requiring complete renovation',
  },
];

const solutionBenefits = [
  'Locates leaks accurately using thermal imaging, acoustic detection, and moisture meters',
  'Zero property damage - no holes, no excavation, no mess',
  'Fast results - most leaks detected within 1-2 hours',
  'Insurance-ready reports - detailed documentation for your claims',
  'Works with all insurance companies - we handle the paperwork',
  'Pinpoints leaks in underground pipes and slab foundations',
  'Detects hidden leaks behind walls and under floors',
  'Covers water heaters, pools, and irrigation systems',
];

const whyChooseUsSections = [
  {
    icon: 'trophy' as const,
    title: 'Proven Track Record',
    items: [
      '1,000+ successful leak detections completed',
      'Licensed & Insured (CFC1430460)',
      'Better Business Bureau Accredited',
      'Industry-certified technicians',
    ],
  },
  {
    icon: 'clock' as const,
    title: 'Fast Response Times',
    items: [
      '24/7 emergency service available',
      'Same-day inspections in most cases',
      'Quick, accurate detection saves you time and money',
    ],
  },
  {
    icon: 'dollar' as const,
    title: 'Insurance & Cost Benefits',
    items: [
      'We work with ALL insurance companies',
      'Free estimates and inspections',
      'Transparent pricing - no hidden fees',
      'Save thousands by catching leaks early',
    ],
  },
  {
    icon: 'wrench' as const,
    title: 'Complete Service',
    items: [
      'Non-invasive leak detection',
      'Detailed reports for insurance claims',
      'Expert guidance on repairs',
      'Connection to trusted repair partners',
    ],
  },
];

const leakDetectionFaqs = [
  {
    question: 'How quickly can you detect a leak?',
    answer: 'Most leaks are located within 1-2 hours using our advanced non-invasive technology. Emergency service is available 24/7 for urgent situations. We understand that every hour counts when water is damaging your property.',
  },
  {
    question: 'Will leak detection damage my property?',
    answer: 'Absolutely not. Our non-invasive methods use thermal imaging, acoustic detection, and moisture meters—no digging, drilling, or property damage required. That\'s one of the key advantages of choosing Total Leak Detection.',
  },
  {
    question: 'Do you work with insurance companies?',
    answer: 'Yes, we work with ALL insurance companies. We provide detailed, insurance-ready reports with clear documentation of leak locations and recommended repairs. Our team can help guide you through the claims process.',
  },
  {
    question: 'What types of leaks can you detect?',
    answer: 'We specialize in detecting all types of water leaks including slab leaks under foundations, underground pipe leaks, leaks behind walls and under floors, pool and spa leaks, water heater leaks, irrigation system leaks, and commercial plumbing leaks.',
  },
  {
    question: 'How much does leak detection cost?',
    answer: 'We offer free estimates and inspections. Our pricing is transparent with no hidden fees. The cost depends on the complexity of your situation, but early detection typically saves you thousands compared to the cost of extensive water damage repairs.',
  },
  {
    question: 'What makes Total Leak Detection different from other companies?',
    answer: 'With 40+ years of experience, 4.6-star rating, and 1,000+ successful detections, we combine proven expertise with cutting-edge technology. We\'re licensed, insured, and BBB accredited. Most importantly, we\'ve located leaks that other companies missed—saving our customers thousands in unnecessary repairs.',
  },
  {
    question: 'Are you available for emergencies?',
    answer: 'Yes, we offer 24/7 emergency leak detection services. Water leaks don\'t wait for business hours, and neither do we. If you have an urgent situation, call us immediately and we\'ll dispatch a technician to your location as soon as possible.',
  },
  {
    question: 'What happens after you detect the leak?',
    answer: 'We provide a detailed report with the exact leak location, photos, and recommendations. We can connect you with trusted repair partners from our sister company network, or you can use our report with any licensed plumber. We\'re here to help guide you through the entire process.',
  },
];

export default function LeakDetectionHubPage() {
  const service = getService(SERVICE_SLUG);
  if (!service) notFound();
  
  const cities = getAllCities();
  const breadcrumbs = generateServiceHubBreadcrumbs(service);
  const canonicalUrl = getServiceHubCanonicalUrl(SERVICE_SLUG);
  const videoConfig = getServiceVideo(SERVICE_SLUG);
  
  // Build comprehensive schema graph for SEO
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'service-hub',
    pageUrl: canonicalUrl,
    title: 'Leak Detection Services Florida | 24/7 Expert Water Leak Locators',
    description: 'Hire leak detection services in Miami, Ft Lauderdale & more. Quick & accurate detection & repairs. 40+ years of experience.',
    breadcrumbs,
    service: {
      name: service.name,
      description: service.bodyContent.overview,
      serviceType: 'Leak Detection',
    },
    faqs: leakDetectionFaqs,
  });
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(schemaGraph) }}
      />
      
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <OptimizedImage
              src="/images/services/leak-detection.jpg"
              alt="Leak Detection Services - Total Leak Detection"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-16">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbs} variant="light" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Stop Water Leaks Before They Cost You Thousands
                </h1>
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-3xl mb-4">
              <strong>Every hour a leak goes undetected, you risk thousands in property damage, mold growth, and skyrocketing water bills.</strong>
            </p>
            <p className="text-lg text-white/80 max-w-2xl mb-8">
              Total Leak Detection is Florida&apos;s leading leak detection company with 40+ years of experience. We use advanced non-invasive technology to locate leaks quickly and accurately—without tearing up your property. <strong>Available 24/7 for emergency service.</strong>
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">24/7 Emergency Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Free Estimates</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:8553855325"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
              >
                <Phone className="w-6 h-6" />
                Call (855) 385-5325
              </a>
              <a
                href="/contact/"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
              >
                Get Free Inspection
              </a>
            </div>
          </div>
        </section>
        
        {/* Urgency Section - Hidden Costs */}
        <ServiceUrgency
          title="The Hidden Cost of Water Leaks"
          subtitle="Why Every Hour Counts"
          intro="Water leaks are silent destroyers. What starts as a small drip can quickly escalate into major damage that threatens your property and your wallet."
          items={urgencyItems}
          costRange="$2,500-$7,500"
        />
        
        {/* Solution Benefits */}
        <ServiceBenefits
          title="Our Non-Invasive Solution"
          subtitle="Detect Leaks Without Property Damage"
          benefits={solutionBenefits}
        />
        
        {/* Real Work Gallery - Early for trust building */}
        <RealWorkGallery serviceSlug="leak-detection" />
        
        {/* Service Areas intro */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Find Leak Detection in Your City
              </h2>
              <p className="text-lg text-gray-600">
                {service.hubContent.serviceAreas}
              </p>
          </div>
        </section>
        
        {/* Service Hub City Grid - Only Tier 1 cities to concentrate link equity */}
        <ServiceHubCityGrid 
          cities={cities}
          serviceSlug={SERVICE_SLUG}
          serviceName={service.name}
        />
        
        {/* Common Leak Problems */}
        <RelatedProblems
          serviceSlug={SERVICE_SLUG}
          title="Common Leak Problems We Detect"
          subtitle="Click on any problem below to learn about warning signs, causes, and our detection approach"
        />
        
        {/* Why Choose Us */}
        <WhyChooseUs
          title="Why Florida Property Owners Choose Total Leak Detection"
          subtitle="We're not just another leak detection company. We're Florida's trusted experts because we deliver results."
          sections={whyChooseUsSections}
          stats={{
            rating: '4.6',
            reviews: '100+',
            projects: '1,000+',
          }}
          testimonial={{
            quote: "I had several technicians come in my property before and charge big money and could not find the leak, these guys in one day found it, and fixed it the same day. If you want your problems solved call them.",
            author: "Hector Rodriguez, Verified Customer",
          }}
        />
        
        <ServiceProcess 
          steps={service.process}
          title={`How Our ${service.name} Works`}
          subtitle="Our proven process delivers accurate results every time"
        />
        
        {videoConfig && (
          <ServiceVideoEmbed 
            videoUrl={videoConfig.url!}
            title={videoConfig.title}
          />
        )}
        
        {/* Technology Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Advanced Technology That Actually Works
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
                We invest in the latest leak detection equipment because your property deserves the best
              </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.bodyContent.technology.map((tech) => (
                  <div key={tech.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tech.name}
                    </h3>
                    <p className="text-gray-600">
                      {tech.description}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <LocalFAQ
          faqs={leakDetectionFaqs}
          title="Leak Detection FAQs"
          subtitle="Get answers to common questions about our services"
        />
        
        <LocalCTA
          cityName="South Florida"
          serviceName={service.name}
          responseTime="30-60 minutes"
        />
      </main>
      <Footer />
    </>
  );
}
