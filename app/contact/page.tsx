'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { GoogleMap } from '@/components/sections/GoogleMap';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, Home } from 'lucide-react';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import siteConfig from '@/config/site.json';
import content from '@/config/content.json';

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
    
    // Get the n8n webhook URL from environment variable
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

    if (!webhookUrl) {
      setSubmitStatus('error');
      setErrorMessage('Webhook URL not configured. Please set NEXT_PUBLIC_N8N_WEBHOOK_URL environment variable.');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Success!
      setSubmitStatus('success');
      form.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      
      // Check for CORS errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage(
          'CORS error: The webhook server needs to allow requests from this origin. ' +
          'Please configure CORS in your n8n webhook settings or activate the workflow.'
        );
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to send message. Please try again or contact us directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Google Maps search URL for the address link
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200 mb-6"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <AnimateOnScroll animation="fade-in-up" duration={600} delay={0}>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                {contact.headline}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {contact.description}
              </p>
            </div>
          </AnimateOnScroll>

          {/* Map Section */}
          <AnimateOnScroll animation="fade-in-up" duration={600} delay={200}>
            <div className="mb-12">
              <GoogleMap />
            </div>
          </AnimateOnScroll>

          {/* Contact Information and Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Contact Information */}
            <AnimateOnScroll animation="fade-in-left" duration={600} delay={0}>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule an estimate today</h2>
                <p className="text-gray-600 mb-6">
                  Get in touch to book a service or to receive more information on how we can help get you back to comfort.
                </p>

                <hr className="my-6" />

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Address
                      </h3>
                      <a
                        href={googleMapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary transition-colors duration-200"
                      >
                        {siteConfig.address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Phone
                      </h3>
                      <a
                        href={`tel:${siteConfig.phone}`}
                        className="text-gray-600 hover:text-primary transition-colors duration-200"
                      >
                        {siteConfig.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Email
                      </h3>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-gray-600 hover:text-primary transition-colors duration-200"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Hours
                      </h3>
                      <p className="text-gray-600">{siteConfig.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Contact Form */}
            <AnimateOnScroll animation="fade-in-right" duration={600} delay={0}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    disabled={isSubmitting}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-semibold">Message sent successfully!</p>
                      <p className="text-green-700 text-sm mt-1">We'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-semibold">Failed to send message</p>
                      <p className="text-red-700 text-sm mt-1">{errorMessage || 'Please try again or contact us directly.'}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </AnimateOnScroll>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

