/**
 * Default FAQ data for the home page
 */
export const faqs = [
  {
    question: 'How do I know if I have a water leak?',
    answer:
      'Signs include unexpectedly high water bills, the sound of running water when nothing is on, wet spots on floors or walls, and musty odors. If you notice any of these, it\'s worth getting a professional inspection.',
  },
  {
    question: 'How much does leak detection cost in Miami?',
    answer:
      'Most leak detection services in Miami range from $150-$400 depending on accessibility and complexity. We offer a $49 evaluation to help identify if you have a leak before committing to full detection.',
  },
  {
    question: 'Can you find leaks without breaking walls or floors?',
    answer:
      'Yes. We use non-invasive methods including acoustic listening devices, thermal imaging, and pressure testing to locate leaks precisely before any cutting is needed.',
  },
  {
    question: 'How long does leak detection take?',
    answer:
      'A typical residential leak detection takes 1-3 hours. We\'ll give you findings on-site and a detailed written report within 48 hours.',
  },
  {
    question: 'Do you service areas outside Miami?',
    answer:
      'We serve all of Miami-Dade, Broward, and Palm Beach counties including Doral, Kendall, Coral Gables, Fort Lauderdale, and surrounding areas.',
  },
];

// Re-export the generateFAQSchema function from the consolidated schema module
// but provide a pre-configured version that uses the default faqs
import { generateFaqSchema, baseUrl } from './schema';

/**
 * Generate FAQ schema using the default home page FAQs
 */
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    ...generateFaqSchema(faqs, baseUrl),
  };
}
