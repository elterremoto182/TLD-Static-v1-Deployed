import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

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

const SERVICE_SLUG = 'mold-testing';

// Enhanced SEO metadata from markdown content
export async function generateMetadata() {
  const service = getService(SERVICE_SLUG);
  if (!service) return { title: 'Service Not Found' };
  
  const canonicalUrl = getServiceHubCanonicalUrl(SERVICE_SLUG);
  
  return {
    title: 'Mold Testing Services in Miami, Broward and Palm Beach | Total Leak Detection',
    description: 'Mold Testing Services by Total Leak Detection: Ensure the safety of your home by detecting and addressing any mold issues promptly. Certified inspectors, lab analysis.',
    keywords: [
      'mold testing services',
      'mold inspection',
      'professional mold testing',
      'air quality testing',
      'indoor mold detection',
      'black mold testing',
      'mold assessment',
      'certified mold inspection',
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: 'Mold Testing Services | Total Leak Detection',
      description: 'Certified mold testing and inspection services throughout South Florida. Professional inspectors, accredited lab analysis, detailed reports.',
      url: canonicalUrl,
      type: 'website',
    },
  };
}

// Content data for the page sections
const urgencyItems = [
  {
    icon: 'alert' as const,
    title: 'Respiratory Problems',
    description: 'Asthma, allergies, chronic coughing, and breathing difficulties from mold exposure',
  },
  {
    icon: 'alert' as const,
    title: 'Allergic Reactions',
    description: 'Sneezing, runny nose, red eyes, and skin rashes triggered by mold spores',
  },
  {
    icon: 'alert' as const,
    title: 'Toxic Environments',
    description: 'Some molds produce mycotoxins that can cause serious illness',
  },
  {
    icon: 'home' as const,
    title: 'Property Damage',
    description: 'Mold destroys drywall, wood, insulation, and building materials',
  },
  {
    icon: 'trending' as const,
    title: 'Property Value Loss',
    description: 'Mold problems can make your home unsellable or significantly reduce value',
  },
];

const testingBenefits = [
  'Detect hidden mold growth in walls, ceilings, HVAC systems, and hidden spaces',
  'Identify mold type - determine if it\'s common mold or toxic varieties',
  'Locate moisture sources - find the root cause of mold growth',
  'Detailed reports with clear documentation and recommendations',
  'Insurance-ready documentation accepted by all insurance companies',
  'Air Quality Testing - samples air to detect mold spores',
  'Surface Testing - swabs and tape samples from visible mold',
  'Thermal Imaging - finds moisture behind walls without damage',
];

const whenToTestItems = [
  'Visible mold growth - any visible mold requires immediate testing',
  'Musty odors - persistent musty smells indicate hidden mold',
  'Water damage - recent leaks, floods, or water damage',
  'Health symptoms - unexplained allergies, respiratory issues, or headaches',
  'Humidity problems - high humidity or condensation issues',
  'Before buying/selling - property transactions require mold testing',
  'After any water damage or leaks',
  'Annually in Florida\'s humid climate',
];

const whyChooseUsSections = [
  {
    icon: 'trophy' as const,
    title: 'Proven Track Record',
    items: [
      '1,000+ successful mold tests completed',
      'Licensed & Insured (CFC1430460)',
      'Better Business Bureau Accredited',
      'Certified mold testing professionals',
    ],
  },
  {
    icon: 'clock' as const,
    title: 'Fast Response Times',
    items: [
      '24/7 emergency testing available',
      'Same-day service in most cases',
      'Quick results help you act fast',
    ],
  },
  {
    icon: 'dollar' as const,
    title: 'Insurance & Cost Benefits',
    items: [
      'We work with ALL insurance companies',
      'Free estimates and consultations',
      'Transparent pricing - no hidden fees',
      'Save thousands by catching mold early',
    ],
  },
  {
    icon: 'wrench' as const,
    title: 'Complete Service',
    items: [
      'Comprehensive testing and analysis',
      'Detailed reports for insurance claims',
      'Expert remediation recommendations',
      'Connection to trusted remediation partners',
    ],
  },
];

const moldTestingFaqs = [
  {
    question: 'How long does mold testing take?',
    answer: 'Most mold tests are completed within 1-2 hours on-site. Lab analysis typically takes 24-48 hours. We provide preliminary results immediately and detailed reports within 48 hours.',
  },
  {
    question: 'Do I need mold testing if I don\'t see any mold?',
    answer: 'Yes, absolutely. Most mold growth is hidden behind walls, in attics, or in HVAC systems. If you notice musty odors, have had water damage, or experience unexplained health symptoms, testing is recommended.',
  },
  {
    question: 'What types of mold can you detect?',
    answer: 'We can detect all types of mold including common varieties (Cladosporium, Penicillium) and toxic molds (Stachybotrys, Aspergillus). Our testing identifies the specific type and concentration levels.',
  },
  {
    question: 'Will my insurance cover mold testing?',
    answer: 'Yes, we work with ALL insurance companies. We provide detailed, insurance-ready reports. Many insurance policies cover mold testing, especially after water damage claims.',
  },
  {
    question: 'How much does mold testing cost?',
    answer: 'We offer free consultations and estimates. Our pricing is transparent with no hidden fees. The cost depends on the size of your property and testing scope, but early detection saves thousands compared to extensive remediation.',
  },
  {
    question: 'What happens after you find mold?',
    answer: 'We provide a detailed report with remediation recommendations. We can connect you with trusted remediation partners or you can use our report with any certified remediation company. We guide you through the entire process.',
  },
  {
    question: 'Can mold testing be done without damaging my property?',
    answer: 'Yes, absolutely. Our testing methods are non-invasive. We use air sampling, surface swabs, and thermal imaging to detect mold without any property damage.',
  },
  {
    question: 'Are you available for emergencies?',
    answer: 'Yes, we offer 24/7 emergency mold testing services. If you have visible mold, water damage, or health concerns, call us immediately. We understand that mold problems require urgent attention.',
  },
];

export default function MoldTestingHubPage() {
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
    title: 'Mold Testing Services in Miami, Broward and Palm Beach',
    description: 'Mold Testing Services by Total Leak Detection: Ensure the safety of your home by detecting and addressing any mold issues promptly.',
    breadcrumbs,
    service: {
      name: service.name,
      description: service.bodyContent.overview,
      serviceType: 'Mold Testing',
    },
    faqs: moldTestingFaqs,
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
              src="/images/services/mold.jpg"
              alt="Mold Testing Services - Total Leak Detection"
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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Mold Testing: Protect Your Family&apos;s Health
                </h1>
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-3xl mb-4">
              <strong>Mold is a silent health threat hiding in your walls, ceilings, and hidden spaces. Don&apos;t wait until your family gets sick—test for mold today.</strong>
            </p>
            <p className="text-lg text-white/80 max-w-2xl mb-8">
              Mold exposure can cause serious health problems including respiratory issues, allergies, and asthma attacks. In Florida&apos;s humid climate, mold can grow undetected for months. <strong>Available 24/7 for emergency testing.</strong>
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Fast Results</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Certified Inspectors</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Accredited Lab Analysis</span>
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
                Get Free Consultation
              </a>
            </div>
          </div>
        </section>
        
        {/* Urgency Section - Hidden Danger */}
        <ServiceUrgency
          title="The Hidden Danger: Why Mold Testing Is Critical"
          subtitle="Mold is a serious problem that can affect your entire family"
          intro="Mold is a serious problem that can cause a range of health issues, especially for children, elderly, and those with compromised immune systems. Hidden mold growth can spread throughout your home undetected."
          items={urgencyItems}
          costRange="$2,000-$6,000 for remediation"
        />
        
        {/* Testing Benefits */}
        <ServiceBenefits
          title="Our Comprehensive Mold Testing Process"
          subtitle="Professional testing methods to identify and locate mold problems"
          benefits={testingBenefits}
        />
        
        {/* Real Work Gallery - Early for trust building */}
        <RealWorkGallery serviceSlug="mold-testing" />
        
        {/* When to Test Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  When Should You Test for Mold?
                </h2>
                <p className="text-lg text-gray-600">
                  Immediate testing is recommended if you notice any of these warning signs
                </p>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whenToTestItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Service Areas intro */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Find Mold Testing in Your City
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
        
        {/* Common Mold Problems */}
        <RelatedProblems
          serviceSlug={SERVICE_SLUG}
          title="Common Mold Problems We Test For"
          subtitle="Click on any problem below to learn about warning signs, causes, and our testing approach"
        />
        
        {/* Why Choose Us */}
        <WhyChooseUs
          title="Why Florida Property Owners Choose Total Leak Detection"
          subtitle="Mold testing requires specialized expertise. We're Florida's trusted experts because we deliver results."
          sections={whyChooseUsSections}
          stats={{
            rating: '4.7',
            reviews: '100+',
            projects: '1,000+',
          }}
          testimonial={{
            quote: "Luis and Richard were awesome and extremely helpful in helping me evaluate a potential mold problem at my house. Hugely professional. Arrived right on time. I highly recommend working with total leak detection.",
            author: "Gabrielle Shirek, Verified Customer",
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
        
        {/* What Reports Include Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                What Our Mold Testing Reports Include
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
                Comprehensive reports provide everything you need for informed decisions
              </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Type of mold detected (common vs. toxic)</li>
                    <li>• Concentration levels in air and surfaces</li>
                    <li>• Exact locations of mold growth</li>
                    <li>• Moisture source identification</li>
                    <li>• Health risk assessment</li>
                  </ul>
                </div>
              
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear Documentation</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• High-resolution photos of findings</li>
                    <li>• Easy-to-understand explanations</li>
                    <li>• Remediation recommendations</li>
                    <li>• Prevention strategies</li>
                    <li>• Insurance-ready format</li>
                  </ul>
                </div>
              
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Plan</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Priority levels for remediation</li>
                    <li>• Estimated costs for repairs</li>
                    <li>• Timeline recommendations</li>
                    <li>• Prevention measures</li>
                    <li>• Follow-up testing schedule</li>
                  </ul>
                </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <LocalFAQ
          faqs={moldTestingFaqs}
          title="Mold Testing FAQs"
          subtitle="Get answers to common questions about our mold testing services"
        />
        
        <LocalCTA
          cityName="South Florida"
          serviceName={service.name}
          responseTime="Same Day"
        />
      </main>
      <Footer />
    </>
  );
}
