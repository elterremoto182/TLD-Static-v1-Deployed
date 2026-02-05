'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2, Clock, Shield, Star, PhoneCall, MessageCircle } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import siteConfig from '@/config/site.json';
import content from '@/config/content.json';

export function Contact() {
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

    // Static export: no server at runtime, so we call n8n from the client.
    // Set NEXT_PUBLIC_N8N_WEBHOOK_URL and allow this origin in n8n CORS.
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
    if (!webhookUrl) {
      setSubmitStatus('error');
      setErrorMessage('Webhook URL not configured. Please set NEXT_PUBLIC_N8N_WEBHOOK_URL.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        source: 'contact-form',
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubmitStatus('success');
      form.reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage(
          'CORS error: The webhook server must allow requests from this site. ' +
            'Configure CORS in your n8n webhook (allow your site origin) and ensure the workflow is active.'
        );
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Failed to send message. Please try again or contact us directly.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-muted/50 to-primary/5">
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              {contact.headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              {contact.description}
            </p>
            {/* Trust Badges */}
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
          </div>
        </AnimateOnScroll>

        {/* Urgent Phone CTA */}
        <AnimateOnScroll animation="fade-in-up" duration={600} delay={100}>
          <div className="bg-primary text-white rounded-2xl p-6 mb-12 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-7 h-7 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-white/90 text-sm font-medium">Need immediate help? Call now</p>
                  <p className="text-2xl md:text-3xl font-bold">{siteConfig.phone}</p>
                </div>
              </div>
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <Phone className="w-5 h-5" />
                Call Now - Free Estimate
              </a>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info - Smaller Column (col-span on grid child so it gets correct width) */}
          <AnimateOnScroll animation="fade-in-left" duration={600} delay={0} className="lg:col-span-2 min-w-0">
            <div className="space-y-4">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone (24/7)</p>
                  <p className="text-lg font-bold text-gray-900">{siteConfig.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-100"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Mail className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-base font-semibold text-gray-900">{siteConfig.email}</p>
                </div>
              </a>

              <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-base font-semibold text-gray-900">{siteConfig.address}</p>
                </div>
              </div>

              {/* Mini Testimonial */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm italic mb-3">
                  "These guys in one day found the leak and fixed it the same day. If you want your problems solved, call them."
                </p>
                <p className="text-sm font-semibold text-gray-900">— Hector R.</p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Form - Larger Column (col-span on grid child so it gets correct width) */}
          <AnimateOnScroll animation="fade-in-right" duration={600} delay={0} className="lg:col-span-3 min-w-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Request Your Free Estimate</h3>
                <p className="text-gray-600 text-sm">We respond within 2 hours during business hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      placeholder="John Smith"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-gray-400 font-normal">(for faster response)</span>
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    placeholder="(555) 123-4567"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Describe Your Issue <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us about your leak or plumbing issue..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <p className="text-red-800 font-semibold">Unable to Send</p>
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Get My Free Estimate
                    </>
                  )}
                </button>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm text-gray-500">
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
        </div>
      </div>
    </section>
  );
}
