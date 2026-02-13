import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import OptimizedImage from '@/components/OptimizedImage';
import { Phone, Shield, Clock, CheckCircle, Camera, AlertTriangle, Search, Video, Eye } from 'lucide-react';

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

const SERVICE_SLUG = 'sewer-camera-inspection';

// Enhanced SEO metadata from markdown content
export async function generateMetadata() {
  const service = getService(SERVICE_SLUG);
  if (!service) return { title: 'Service Not Found' };
  
  const canonicalUrl = getServiceHubCanonicalUrl(SERVICE_SLUG);
  
  return {
    title: 'Sewer Camera Inspection Services, Miami | Total Leak Detection',
    description: 'Get reliable sewer camera inspection services in Miami, FL. Our pipe inspection cameras diagnose blockages/leaks without invasive procedures. Fast reports!',
    keywords: [
      'sewer camera inspection services',
      'video pipe inspection',
      'sewer line inspection',
      'drain camera inspection',
      'plumbing camera inspection',
      'sewer scope inspection',
      'pipe video inspection',
      'non-invasive pipe diagnosis',
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: 'Sewer Camera Inspection Services | Total Leak Detection',
      description: 'Professional HD video sewer line and drain inspection throughout South Florida. See inside your pipes without digging.',
      url: canonicalUrl,
      type: 'website',
    },
    twitter: { url: canonicalUrl },
  };
}

// Content data for the page sections
const problemItems = [
  {
    icon: 'dollar' as const,
    title: 'Wasted Money',
    description: 'Treatments that don\'t work because the real problem wasn\'t identified',
  },
  {
    icon: 'alert' as const,
    title: 'Misdiagnosed Problems',
    description: 'Leading to unnecessary and expensive repairs that don\'t fix the issue',
  },
  {
    icon: 'alert' as const,
    title: 'Recurring Issues',
    description: 'Problems that keep coming back because they were never properly diagnosed',
  },
  {
    icon: 'home' as const,
    title: 'Hidden Damage',
    description: 'Pipe problems that get worse over time without proper identification',
  },
  {
    icon: 'trending' as const,
    title: 'Property Damage',
    description: 'From invasive exploratory work that could be avoided with camera inspection',
  },
];

const cameraBenefits = [
  'See cracks and structural damage - exactly where pipes are failing',
  'Identify clog sources - what\'s actually blocking your drains',
  'Spot tree root intrusion before they cause major damage',
  'Find misaligned joints and connection problems',
  'Detect collapsed pipes and structural failures',
  'Locate lost items like jewelry or other objects',
  'Assess overall pipe condition and system health',
  'HD video quality for crystal-clear diagnosis',
];

const whenNeededItems = [
  { icon: AlertTriangle, text: 'Persistent clogs that keep coming back' },
  { icon: AlertTriangle, text: 'Sewer backups in your home' },
  { icon: AlertTriangle, text: 'Slow drains throughout the house' },
  { icon: AlertTriangle, text: 'Foul odors from drains' },
  { icon: Search, text: 'Before buying a home - know the condition of sewer lines' },
  { icon: Eye, text: 'Older homes (20+ years) - assess pipe condition' },
  { icon: Video, text: 'Before renovations - ensure pipes can handle additional usage' },
  { icon: CheckCircle, text: 'Annual maintenance - catch problems early' },
];

const advantageItems = [
  {
    title: 'Accurate Diagnosis',
    description: 'Get a first-hand look at the condition of your pipes and accurately pinpoint the location of your issue.',
  },
  {
    title: 'Prevent Major Expenses',
    description: 'Locate potential problems early before they become costly issues requiring emergency repairs.',
  },
  {
    title: 'No Property Damage',
    description: 'Unlike traditional methods that require digging or breaking through walls, camera inspections are completely non-invasive.',
  },
  {
    title: 'Insurance Documentation',
    description: 'Our detailed reports with HD images provide perfect documentation for insurance claims.',
  },
  {
    title: 'Informed Decisions',
    description: 'See the problem yourself and make informed decisions about repairs, replacements, or maintenance.',
  },
];

const whyChooseUsSections = [
  {
    icon: 'trophy' as const,
    title: 'Proven Track Record',
    items: [
      '1,000+ successful camera inspections completed',
      'Licensed & Insured (CFC1430460)',
      'Better Business Bureau Accredited',
      'Industry-certified technicians',
    ],
  },
  {
    icon: 'clock' as const,
    title: 'Fast & Reliable Service',
    items: [
      '24/7 emergency inspections available',
      'Most inspections completed in 30-60 minutes',
      'Detailed reports provided same day',
      'Quick, accurate diagnosis saves time and money',
    ],
  },
  {
    icon: 'dollar' as const,
    title: 'Affordable & Transparent',
    items: [
      'Competitive pricing with no hidden fees',
      'Free estimates and consultations',
      'Insurance-ready reports',
      'Save money by avoiding unnecessary repairs',
    ],
  },
  {
    icon: 'wrench' as const,
    title: 'Advanced Technology',
    items: [
      'HD video cameras with self-righting capability',
      'Professional-grade video scopes and locator units',
      'High-resolution imaging for accurate diagnosis',
      'Complete system inspection capability',
    ],
  },
];

const sewerCameraFaqs = [
  {
    question: 'What is a sewer camera inspection?',
    answer: 'A sewer camera inspection is a non-invasive diagnostic procedure that involves inserting a high-resolution waterproof camera into your home\'s sewer line. The camera transmits real-time video footage, allowing professionals to identify issues such as blockages, cracks, root intrusions, and pipe deterioration without digging.',
  },
  {
    question: 'When is it necessary to conduct a sewer line inspection?',
    answer: 'We recommend scheduling a sewer camera inspection for persistent clogs, sewer backups, slow drains, or foul odors. Additionally, when purchasing a new home, it\'s crucial to arrange a comprehensive inspection to evaluate the condition of your sewer lines.',
  },
  {
    question: 'How frequently should I arrange a sewer camera inspection?',
    answer: 'The frequency depends largely on the age of your plumbing system. Typically, consider scheduling a sewer camera inspection service annually to detect issues before they escalate into costly plumbing repairs. Older homes (20+ years) should be inspected more frequently.',
  },
  {
    question: 'Can I perform a sewer camera inspection myself?',
    answer: 'We don\'t recommend it! While it\'s possible to conduct a sewer camera inspection independently, standard homeowner-level inspection devices lack auto-focus and only examine the initial few feet of the pipeline. Our professional-grade video scopes and locator units are self-righting and high resolution, ensuring efficient detection of signs of damage.',
  },
  {
    question: 'What are the advantages of a sewer inspection?',
    answer: 'A sewer camera inspection is a cost-effective and time-saving measure that can spare you from future headaches. Our skilled plumbers install a high-resolution camera that thoroughly examines your sewer line, identifies potential problems like clogs, tree root intrusion, and broken pipes. This proactive approach allows for early detection and timely resolution.',
  },
  {
    question: 'How do sewer cameras work?',
    answer: 'Sewer cameras utilize a small waterproof camera on a flexible cable, feeding live images to a laptop for a clear view of the drainage system. They work in underground pipes, including those beneath house foundations and encased in concrete, offering a non-invasive solution for detecting and addressing current issues or preventing future problems.',
  },
  {
    question: 'How long does a sewer camera inspection take?',
    answer: 'Most inspections take between 30 minutes to 1 hour, depending on the complexity of the system and the length of the sewer line. We provide detailed reports the same day.',
  },
  {
    question: 'Are you available for emergencies?',
    answer: 'Yes, we offer 24/7 emergency sewer camera inspection services. If you have a sewer backup, persistent clogs, or urgent plumbing issues, call us immediately. We understand the importance of quick and reliable service in emergency situations.',
  },
];

export default function SewerCameraInspectionHubPage() {
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
    title: 'Sewer Camera Inspection Services, Miami | Total Leak Detection',
    description: 'Get reliable sewer camera inspection services in Miami, FL. Our pipe inspection cameras diagnose blockages/leaks without invasive procedures.',
    breadcrumbs,
    service: {
      name: service.name,
      description: service.bodyContent.overview,
      serviceType: 'Sewer Camera Inspection',
    },
    faqs: sewerCameraFaqs,
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
              src="/images/services/drain-cleaning.jpg"
              alt="Sewer Camera Inspection Services - Total Leak Detection"
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
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  See Inside Your Pipes Without Digging
                </h1>
              </div>
            </div>
            
            <p className="text-xl text-white/90 max-w-3xl mb-4">
              <strong>Stop guessing what&apos;s wrong with your pipes. Our HD video camera inspections show you exactly what&apos;s happening inside your sewer lines—without any excavation or property damage.</strong>
            </p>
            <p className="text-lg text-white/80 max-w-2xl mb-8">
              Persistent clogs, slow drains, and sewer backups are warning signs of serious problems. Without seeing inside your pipes, you&apos;re just guessing at the cause. <strong>Fast, reliable, and affordable sewer camera inspection services. Available 24/7.</strong>
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Same Day Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">HD Video Quality</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-white text-sm font-medium">Video Recording Included</span>
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
                Schedule Inspection
              </a>
            </div>
          </div>
        </section>
        
        {/* Problem Section - Why You Need Camera Inspection */}
        <ServiceUrgency
          title="You Can't Fix What You Can't See"
          subtitle="Without seeing inside your pipes, you're flying blind"
          intro="Determining the cause of a clogged drain or examining the condition of your plumbing system sometimes requires a more in-depth examination. Without seeing inside your pipes, you risk costly mistakes."
          items={problemItems}
          costRange="$2,000-$5,000 in unnecessary repairs"
        />
        
        {/* What Camera Can Detect */}
        <ServiceBenefits
          title="What Our HD Camera Inspections Reveal"
          subtitle="See exactly what's happening inside your pipes with crystal-clear video"
          benefits={cameraBenefits}
        />
        
        {/* Real Work Gallery - Early for trust building */}
        <RealWorkGallery serviceSlug="sewer-camera-inspection" />
        
        {/* Advantages Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                Advantages of Professional Camera Inspection
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
                Leave it to the professionals—we have a 4.6 Rating on Google with 137 Reviews!
              </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantageItems.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-full">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* When You Need Inspection */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  When Do You Need a Camera Inspection?
                </h2>
                <p className="text-lg text-gray-600">
                  Schedule an inspection if you notice any of these warning signs
                </p>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whenNeededItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                      <IconComponent className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Service Areas intro */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Find Sewer Camera Inspection in Your City
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
        
        {/* Common Sewer Problems */}
        <RelatedProblems
          serviceSlug={SERVICE_SLUG}
          title="Common Sewer Problems We Diagnose"
          subtitle="Click on any problem below to learn about warning signs, causes, and our inspection approach"
        />
        
        {/* Why Choose Us */}
        <WhyChooseUs
          title="Why Miami Property Owners Choose Total Leak Detection"
          subtitle="Sewer camera inspection requires specialized equipment and expertise. We're Miami's trusted experts."
          sections={whyChooseUsSections}
          stats={{
            rating: '4.6',
            reviews: '100+',
            projects: '1,000+',
          }}
        />
        
        <ServiceProcess 
          steps={service.process}
          title={`How Our ${service.name} Works`}
          subtitle="Fast and reliable inspection process"
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
                Advanced Camera Technology
              </h2>
              <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
                We use professional-grade equipment for accurate diagnosis
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
          faqs={sewerCameraFaqs}
          title="Sewer Camera Inspection FAQs"
          subtitle="Get answers to common questions about our inspection services"
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
