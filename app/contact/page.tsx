'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2, Clock, Shield, Star, PhoneCall, MessageCircle } from 'lucide-react';
import siteConfig from '@/config/site.json';
import content from '@/config/content.json';
import { generateBreadcrumbs } from '@/lib/utils';
import { buildPageSchemaGraph, schemaToJsonLd } from '@/lib/seo/schema';

// Lazy load heavy components
const AnimateOnScroll = dynamic(
  () => import('@/components/AnimateOnScroll').then((mod) => ({ default: mod.AnimateOnScroll })),
  { ssr: true }
);

// Lazy load map with facade pattern - only loads on user interaction
const GoogleMapLazy = dynamic(
  () => import('@/components/sections/GoogleMapLazy').then((mod) => ({ default: mod.GoogleMapLazy })),
  { 
    ssr: false,
    loading: () => <MapPlaceholder />
  }
);

// Lightweight placeholder for map
function MapPlaceholder() {
  return (
    <div className="w-full min-h-[400px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  );
}

// Trust badges component
function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1.5">
        <Shield className="w-4 h-4 text-primary" />
        <span>Licensed & Insured</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span>4.7 Rating (136+ Reviews)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-primary" />
        <span>24/7 Available</span>
      </div>
    </div>
  );
}


export default function ContactPage() {
  const { contact } = content;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        message: formData.get('message'),
        service: formData.get('service') || undefined,
        timestamp: new Date().toISOString(),
        source: 'contact-form',
      };

      // Same-origin API route avoids CORS; server proxies to n8n webhook
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || `HTTP ${response.status}`);
      }

      setSubmitStatus('success');
      form.reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Google Maps search URL for the address link
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://totalleakdetection.com';
  const breadcrumbs = generateBreadcrumbs('/contact', 'Contact');
  const pageUrl = `${baseUrl}/contact/`;
  
  // Build unified schema graph
  const schemaGraph = buildPageSchemaGraph({
    pageType: 'contact',
    pageUrl,
    title: 'Contact - Total Leak Detection',
    description: contact.description,
    breadcrumbs,
  });

  return (
    <>
      {/* Unified structured data with @graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd(schemaGraph),
        }}
      />
      <Header />
      <main className="min-h-screen pt-20">
        {/* Hero Section with Strong Value Proposition */}
        <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6">
              <Breadcrumb items={breadcrumbs} />
            </div>

            <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                  Get Your Free Leak Detection Estimate
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                  Same-day service available. Our licensed technicians respond within 2 hours and can often diagnose your leak the same day.
                </p>
                <TrustBadges />
              </div>
            </AnimateOnScroll>

            {/* Urgent Contact Banner */}
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
              <div className="bg-primary rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <PhoneCall className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-white text-sm font-medium">Need immediate help? Call us now</p>
                      <p className="text-2xl md:text-3xl font-bold text-white">{siteConfig.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors duration-200 border border-white/30"
                    >
                      <Mail className="w-5 h-5" />
                      Email Us
                    </a>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Contact Information and Form - Form First on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              
              {/* Contact Form - Main Focus (7 columns on desktop) */}
              <AnimateOnScroll animation="fade-in-up" duration={600} delay={0} className="lg:col-span-7 order-1">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 lg:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Request Your Free Estimate</h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll contact you within 10 minutes during business hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="John Smith"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number <span className="text-gray-400 font-normal">(faster response)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="(555) 123-4567"
                          disabled={isSubmitting}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        />
                      </div>
                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Service Needed
                        </label>
                        <select
                          id="service"
                          name="service"
                          disabled={isSubmitting}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-base"
                        >
                          <option value="">Select a service (optional)</option>
                          <option value="leak-detection">Leak Detection</option>
                          <option value="sewer-camera">Sewer Camera Inspection</option>
                          <option value="mold-testing">Mold Testing</option>
                          <option value="hydro-jetting">Hydro Jetting</option>
                          <option value="plumbing-report">Plumbing Report</option>
                          <option value="other">Other / Not Sure</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Describe Your Issue <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Please describe your leak or plumbing issue. Include any details about location, when you first noticed it, etc."
                        rows={4}
                        required
                        disabled={isSubmitting}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-base"
                      />
                    </div>

                    {/* Success Message */}
                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-800 font-semibold">Message sent successfully!</p>
                          <p className="text-green-700 text-sm mt-1">We&apos;ll get back to you as soon as possible.</p>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 font-semibold">Unable to Send Request</p>
                          <p className="text-red-700 text-sm mt-1">
                            {errorMessage || 'Please try again or call us directly at '}<a href={`tel:${siteConfig.phone}`} className="font-semibold underline">{siteConfig.phone}</a>
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white font-bold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Get My Free Estimate
                        </>
                      )}
                    </button>

                    {/* Trust Indicators Below Button */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>No obligation</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Free estimates</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Same-day service</span>
                      </div>
                    </div>
                  </form>
                </div>
              </AnimateOnScroll>

              {/* Contact Information - Sidebar (5 columns on desktop) */}
              <AnimateOnScroll animation="fade-in-up" duration={600} delay={100} className="lg:col-span-5 order-2">
                <div className="space-y-5 lg:sticky lg:top-24">
                  {/* Trust & Credentials Card */}
                  <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-white">Why Choose Us?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Licensed & Insured</p>
                          <p className="text-blue-100 text-sm">FL License #CFC1430460</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">4.7 Star Rating</p>
                          <p className="text-blue-100 text-sm">136+ Google Reviews</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">24/7 Emergency Service</p>
                          <p className="text-blue-100 text-sm">Always available when you need us</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <a
                        href={`tel:${siteConfig.phone}`}
                        className="flex items-center p-3 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors duration-200 group"
                      >
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone (24/7)</p>
                          <p className="font-bold text-gray-900">{siteConfig.phone}</p>
                        </div>
                      </a>

                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="font-semibold text-gray-900 text-sm">{siteConfig.email}</p>
                        </div>
                      </a>

                      <a
                        href={googleMapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Office</p>
                          <p className="font-semibold text-gray-900 text-sm">{siteConfig.address}</p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic text-sm mb-3">
                      "These guys in one day found the leak and fixed it the same day. If you want your problems solved call them."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-xs">HR</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Hector Rodriguez</p>
                        <p className="text-xs text-gray-500">Verified Google Review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Map Section - Lazy loaded with facade pattern */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Location</h2>
                <p className="text-gray-600">Serving Miami-Dade, Broward, and Palm Beach Counties</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
              <Suspense fallback={<MapPlaceholder />}>
                <GoogleMapLazy />
              </Suspense>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
