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
      src: '/images/gallery/leak%20detection%20gun.JPG',
      alt: 'Thermal imaging camera detecting hidden water leaks in walls with temperature variations',
      title: 'Thermal Imaging Detection',
      caption: 'Advanced thermal imaging technology',
    },
    {
      src: '/images/gallery/leak%20detection%20moisture.JPG',
      alt: 'Moisture detection equipment showing thermal readings to locate hidden leaks',
      title: 'Moisture Detection',
      caption: 'Precision moisture detection equipment',
    },
    {
      src: '/images/gallery/pipe-leak.jpg',
      alt: 'Water damage from hidden pipe leak discovered during inspection',
      title: 'Hidden Leak Found',
      caption: 'Water damage discovered behind wall',
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
      src: '/images/gallery/leak%20detection%20moisture.JPG',
      alt: 'Moisture detection equipment used to identify water sources causing mold growth',
      title: 'Moisture Testing',
      caption: 'Locating moisture sources for mold',
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
