'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import siteConfig from '@/config/site.json';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white backdrop-blur-sm',
        isScrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <nav className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-gray-900"
          >
            {siteConfig.logo && !logoError ? (
              <div className="relative">
                <OptimizedImage
                  src={siteConfig.logo}
                  alt={siteConfig.logoAlt || siteConfig.name}
                  width={isScrolled ? siteConfig.logoWidth * 0.85 : siteConfig.logoWidth}
                  height={isScrolled ? siteConfig.logoHeight * 0.85 : siteConfig.logoHeight}
                  className={cn(
                    'transition-all duration-300',
                    'object-contain'
                  )}
                  priority
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <span>{siteConfig.name}</span>
            )}
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center space-x-2 bg-[#FF6200] px-4 py-2 rounded-lg font-semibold hover:bg-[#E55A00] transition-colors duration-200 whitespace-nowrap"
            >
              <Phone className="w-4 h-4 !text-white flex-shrink-0" />
              <span className="!text-white">Call Now – Same-Day Service</span>
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center space-x-2 text-primary font-semibold"
              >
                <Phone className="w-4 h-4" />
                <span>{siteConfig.phone}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
