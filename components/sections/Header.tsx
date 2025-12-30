'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Menu, X, Phone, ChevronDown, Droplet, Shield, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import siteConfig from '@/config/site.json';

// Service dropdown items
const serviceDropdownItems = [
  {
    href: '/leak-detection/',
    name: 'Leak Detection',
    description: 'Professional water leak detection services',
    icon: Droplet,
  },
  {
    href: '/mold-testing/',
    name: 'Mold Testing',
    description: 'Certified mold inspection & testing',
    icon: Shield,
  },
  {
    href: '/sewer-camera-inspection/',
    name: 'Sewer Camera Inspection',
    description: 'Non-invasive pipe diagnostics',
    icon: Camera,
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
                  fetchPriority="high"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <span>{siteConfig.name}</span>
            )}
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {siteConfig.navigation.map((item) => {
              // Special handling for Services dropdown
              if (item.name === 'Services') {
                return (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      onMouseEnter={() => setIsServicesOpen(true)}
                      className="flex items-center gap-1 text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                    >
                      {item.name}
                      <ChevronDown className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        isServicesOpen && 'rotate-180'
                      )} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div
                      onMouseLeave={() => setIsServicesOpen(false)}
                      className={cn(
                        'absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200',
                        isServicesOpen 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible -translate-y-2'
                      )}
                    >
                      <div className="p-2">
                        {/* Link to all services page */}
                        <Link
                          href={item.href}
                          onClick={() => setIsServicesOpen(false)}
                          className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900">All Services</span>
                          <span className="block text-sm text-gray-500">View our complete service list</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2" />
                        
                        {/* Service hub links */}
                        {serviceDropdownItems.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setIsServicesOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-10 h-10 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                              <service.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                {service.name}
                              </span>
                              <span className="block text-sm text-gray-500">
                                {service.description}
                              </span>
                            </div>
                          </Link>
                        ))}
                        
                        <div className="border-t border-gray-100 my-2" />
                        
                        {/* Quick link to Areas */}
                        <Link
                          href="/areas/"
                          onClick={() => setIsServicesOpen(false)}
                          className="block px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors text-center"
                        >
                          <span className="font-medium text-primary">Find Services in Your City →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Regular navigation items
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center space-x-2 bg-accent px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors duration-200 whitespace-nowrap"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {siteConfig.navigation.map((item) => {
                // Special handling for Services in mobile
                if (item.name === 'Services') {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                        className="flex items-center justify-between w-full py-2 text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                      >
                        {item.name}
                        <ChevronDown className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isMobileServicesOpen && 'rotate-180'
                        )} />
                      </button>
                      
                      {/* Mobile Services Submenu */}
                      <div className={cn(
                        'overflow-hidden transition-all duration-200',
                        isMobileServicesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      )}>
                        <div className="pl-4 py-2 space-y-2">
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-2 text-gray-600 hover:text-primary font-medium"
                          >
                            All Services
                          </Link>
                          {serviceDropdownItems.map((service) => (
                            <Link
                              key={service.href}
                              href={service.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 py-2 text-gray-600 hover:text-primary"
                            >
                              <service.icon className="w-4 h-4 text-primary" />
                              <span>{service.name}</span>
                            </Link>
                          ))}
                          <Link
                            href="/areas/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-2 text-primary font-medium"
                          >
                            Find Services in Your City →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                );
              })}
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center space-x-2 text-primary font-semibold py-2"
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
