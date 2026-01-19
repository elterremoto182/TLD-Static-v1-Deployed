'use client';

import { Phone } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

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
      src: '/images/gallery/leak-detection-technician.jpg',
      alt: 'Total Leak Detection technician using professional moisture detection equipment',
      title: 'Professional Inspection',
      caption: 'Using advanced moisture detection equipment',
    },
    {
      src: '/images/gallery/pipe-leak.jpg',
      alt: 'Hidden pipe leak discovered behind wall during leak detection inspection',
      title: 'Hidden Leak Found',
      caption: 'Water damage discovered behind wall',
    },
    {
      src: '/images/gallery/pipe-leak-closeup.jpg',
      alt: 'Closeup of copper pipe with pinhole leak',
      title: 'Pinhole Leak Detection',
      caption: 'Copper pipe damage identified',
    },
    {
      src: '/images/gallery/leak-detection-equipment.jpg',
      alt: 'Professional leak detection equipment including thermal imaging and moisture meters',
      title: 'Professional Equipment',
      caption: 'State-of-the-art detection technology',
    },
    {
      src: '/images/gallery/moisture-detection.jpg',
      alt: 'Moisture detection being performed to locate hidden water leaks',
      title: 'Moisture Detection',
      caption: 'Identifying water damage sources',
    },
  ],
  'mold-testing': [
    {
      src: '/images/gallery/mold-inspection-before.jpg',
      alt: 'Mold growth discovered during professional inspection',
      title: 'Mold Discovery',
      caption: 'Hidden mold identified during inspection',
    },
    {
      src: '/images/gallery/mold-inspection-after.jpg',
      alt: 'Clean area after mold remediation following our testing report',
      title: 'After Remediation',
      caption: 'Results after following our recommendations',
    },
    {
      src: '/images/gallery/leak-detection-equipment.jpg',
      alt: 'Professional testing equipment for mold detection',
      title: 'Testing Equipment',
      caption: 'Professional-grade inspection tools',
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
      src: '/images/gallery/leak-detection-equipment.jpg',
      alt: 'Professional sewer camera inspection equipment',
      title: 'HD Camera Equipment',
      caption: 'Professional-grade video inspection',
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
        <AnimateOnScroll animation="fade-in-up" duration={600}>
          <h2 className={`font-bold text-gray-900 mb-3 text-center ${variant === 'compact' ? 'text-2xl' : 'text-3xl'}`}>
            {title || defaultTitle}
          </h2>
          <p className={`text-gray-600 text-center max-w-2xl mx-auto ${variant === 'compact' ? 'mb-6 text-base' : 'mb-10 text-lg'}`}>
            {subtitle || defaultSubtitle}
          </p>
        </AnimateOnScroll>
        
        <div className={`grid gap-4 ${
          variant === 'compact' 
            ? 'grid-cols-1 sm:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}>
          {displayImages.map((image, index) => (
            <AnimateOnScroll
              key={image.src}
              animation="fade-in-up"
              duration={600}
              delay={index * 100}
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg group">
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
            </AnimateOnScroll>
          ))}
          
          {/* CTA Card - only show in default variant */}
          {variant === 'default' && (
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={displayImages.length * 100}>
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
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}
