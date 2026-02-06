'use client';

import { Phone } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  caption: string;
}

interface RealWorkGalleryProps {
  serviceSlug: 'leak-detection' | 'mold-testing' | 'sewer-camera-inspection';
  variant?: 'default' | 'compact';
  title?: string;
  subtitle?: string;
  cityName?: string;
}

// Service-specific image configurations
const serviceImages: Record<string, GalleryImage[]> = {
  'leak-detection': [
    {
      src: '/images/gallery/thermal-imaging-leak-detection-attic-miami-doral-miramar.jpeg',
      alt: 'Thermal imaging camera detecting hidden water leaks in attic insulation in Miami-Dade',
      title: 'Thermal Imaging Detection',
      caption: 'Advanced thermal imaging technology',
    },
    {
      src: '/images/gallery/miami-moisture-meter-leak-detection.jpeg',
      alt: 'Professional moisture meter detecting water intrusion levels during leak inspection',
      title: 'Moisture Meter Reading',
      caption: 'Precision moisture detection equipment',
    },
    {
      src: '/images/gallery/moisture-detection-water-leak.jpeg',
      alt: 'Moisture detection equipment identifying active water leak behind wall',
      title: 'Active Leak Detection',
      caption: 'Finding hidden water damage',
    },
    {
      src: '/images/gallery/active-supply-water-line-leak.jpeg',
      alt: 'Active supply water line leak discovered during professional inspection',
      title: 'Supply Line Leak',
      caption: 'Water line leak identified and located',
    },
    {
      src: '/images/gallery/shower-pan-inspection-tool-leak-detection-doral-tiled-bathroom-floor.jpeg',
      alt: 'Shower pan leak detection using specialized inspection tools on tiled bathroom floor',
      title: 'Shower Pan Inspection',
      caption: 'Testing shower pan for leaks',
    },
    {
      src: '/images/gallery/leak%20detection%20technitian.JPG',
      alt: 'Professional leak detection technician using moisture detection equipment during inspection',
      title: 'Professional Inspection',
      caption: 'Expert technician performing leak detection',
    },
    {
      src: '/images/gallery/pipe%20leak%20closeup.JPG',
      alt: 'Copper pipe pinhole leak discovered during professional leak detection inspection',
      title: 'Leak Discovered',
      caption: 'Pinhole leak found behind wall',
    },
    {
      src: '/images/gallery/miami-shower-repair-leak-detection.jpeg',
      alt: 'Shower repair and leak detection service in Miami bathroom',
      title: 'Shower Leak Repair',
      caption: 'Identifying shower leak sources',
    },
    {
      src: '/images/gallery/process-for-a-shower-pan-leak-test.jpeg',
      alt: 'Professional shower pan leak test process with water retention testing',
      title: 'Shower Pan Test',
      caption: 'Comprehensive leak testing process',
    },
    {
      src: '/images/gallery/plumbing-inspection-tub-spout-leakage.jpeg',
      alt: 'Plumbing inspection identifying tub spout leakage during bathroom assessment',
      title: 'Tub Spout Inspection',
      caption: 'Checking fixtures for leaks',
    },
  ],
  'mold-testing': [
    {
      src: '/images/gallery/air-test-bathroom-mold-test.jpeg',
      alt: 'Professional air quality testing for mold spores in bathroom environment',
      title: 'Air Quality Testing',
      caption: 'Testing air for mold spores',
    },
    {
      src: '/images/gallery/dangerous-mold-testing-swab-test.jpeg',
      alt: 'Swab test sample collection from dangerous mold growth for laboratory analysis',
      title: 'Mold Swab Testing',
      caption: 'Collecting samples for lab analysis',
    },
    {
      src: '/images/gallery/mold-test-with-visible-mold-swab.jpeg',
      alt: 'Surface swab test being performed on visible mold growth for identification',
      title: 'Surface Mold Testing',
      caption: 'Identifying mold species present',
    },
    {
      src: '/images/gallery/mold-behind-base-boards-mold-inspection-swab-test.jpeg',
      alt: 'Hidden mold discovered behind baseboards during comprehensive inspection',
      title: 'Hidden Mold Found',
      caption: 'Mold behind baseboards discovered',
    },
    {
      src: '/images/gallery/testing-air-for-mold-livingroom.jpeg',
      alt: 'Air quality mold testing equipment set up in living room for spore count analysis',
      title: 'Living Room Air Test',
      caption: 'Comprehensive indoor air testing',
    },
    {
      src: '/images/gallery/visible-mold-being-tested.jpeg',
      alt: 'Visible mold growth being tested and sampled for professional analysis',
      title: 'Mold Sample Collection',
      caption: 'Professional mold sampling',
    },
    {
      src: '/images/gallery/mold-test-air-vent.jpeg',
      alt: 'Mold testing and inspection of HVAC air vent for contamination',
      title: 'HVAC Mold Check',
      caption: 'Testing vents for mold growth',
    },
    {
      src: '/images/gallery/mold-inspection-before.jpg',
      alt: 'Mold growth discovered during professional inspection',
      title: 'Mold Discovery',
      caption: 'Hidden mold identified during inspection',
    },
    {
      src: '/images/gallery/moisture-meter-with-visible-mold.jpeg',
      alt: 'Moisture meter reading near visible mold growth to identify water source',
      title: 'Moisture Source Found',
      caption: 'Locating moisture feeding mold',
    },
    {
      src: '/images/gallery/hidden-mold-test-swab-test.jpeg',
      alt: 'Swab test being performed on hidden mold behind wall materials',
      title: 'Hidden Mold Testing',
      caption: 'Testing concealed mold growth',
    },
  ],
  'sewer-camera-inspection': [
    {
      src: '/images/gallery/camera-inspection-before.jpg',
      alt: 'Camera inspection revealing blockage in sewer line',
      title: 'Blockage Found',
      caption: 'HD camera reveals pipe obstruction',
    },
    {
      src: '/images/gallery/camera-inspection-after.jpg',
      alt: 'Clear sewer line after issue was resolved',
      title: 'Problem Solved',
      caption: 'Clean pipe after targeted repair',
    },
    {
      src: '/images/gallery/leak%20detection%20technitian.JPG',
      alt: 'Professional technician preparing sewer camera inspection equipment',
      title: 'Professional Service',
      caption: 'Expert camera inspection service',
    },
  ],
};

export function RealWorkGallery({
  serviceSlug,
  variant = 'default',
  title,
  subtitle,
  cityName,
}: RealWorkGalleryProps) {
  const images = serviceImages[serviceSlug] || serviceImages['leak-detection'];
  const displayImages = variant === 'compact' ? images.slice(0, 3) : images;
  
  const defaultTitle = cityName 
    ? `Our Work in ${cityName}` 
    : 'See Our Work in Action';
  const defaultSubtitle = cityName
    ? `Real projects from ${cityName} and surrounding areas`
    : 'Real projects from South Florida homes and businesses';

  return (
    <section className={`py-12 ${variant === 'compact' ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`font-bold text-gray-900 mb-3 text-center ${variant === 'compact' ? 'text-2xl' : 'text-3xl'}`}>
            {title || defaultTitle}
          </h2>
          <p className={`text-gray-600 text-center max-w-2xl mx-auto ${variant === 'compact' ? 'mb-6 text-base' : 'mb-10 text-lg'}`}>
            {subtitle || defaultSubtitle}
          </p>
        
        <div className={`grid gap-4 ${
          variant === 'compact' 
            ? 'grid-cols-1 sm:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}>
          {displayImages.map((image) => (
              <div key={image.src} className="relative rounded-xl overflow-hidden shadow-lg group">
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={variant === 'compact' ? 250 : 300}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    variant === 'compact' ? 'h-48' : 'h-64'
                  }`}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">{image.title}</p>
                  <p className="text-white/80 text-sm">{image.caption}</p>
                </div>
              </div>
          ))}
          
          {/* CTA Card - only show in default variant */}
          {variant === 'default' && (
              <div className="relative rounded-xl overflow-hidden shadow-lg group bg-primary flex items-center justify-center h-64">
                <div className="text-center p-6">
                  <p className="text-white font-bold text-xl mb-2">Need Our Help?</p>
                  <p className="text-white/80 mb-4">Get a free inspection today</p>
                  <a
                    href="tel:8553855325"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>
          )}
        </div>
      </div>
    </section>
  );
}
