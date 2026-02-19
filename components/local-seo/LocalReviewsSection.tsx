import { Star, ExternalLink, MessageSquareQuote } from 'lucide-react';
import { Review, truncateReviewText, GBP_REVIEWS_URL } from '@/lib/local-seo/reviews';

interface LocalReviewsSectionProps {
  reviews: Review[];
  serviceName: string;
  cityName?: string;
  showGbpLink?: boolean;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < stars ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
}

export function LocalReviewsSection({
  reviews,
  serviceName,
  cityName,
  showGbpLink = false,
}: LocalReviewsSectionProps) {
  if (reviews.length === 0) return null;

  const title = cityName
    ? `What ${cityName} Customers Say About Our ${serviceName}`
    : `What Our Customers Say About Our ${serviceName}`;

  return (
    <section id="reviews" className="py-16 bg-white" aria-labelledby="reviews-heading">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
            <MessageSquareQuote className="w-7 h-7 text-primary" />
          </div>
          <h2 id="reviews-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">
            Real reviews from verified customers on Google
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <article
              key={review.reviewId}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <StarRating stars={review.stars} />
                <span className="text-sm text-gray-500">
                  {formatDate(review.publishedAtDate)}
                </span>
              </div>

              <blockquote className="text-gray-700 leading-relaxed flex-grow mb-4">
                &ldquo;{truncateReviewText(review.text, 200)}&rdquo;
              </blockquote>

              <footer className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <cite className="not-italic font-semibold text-gray-900">
                    — {review.name}
                  </cite>
                  <a
                    href={review.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                    aria-label={`Read full review by ${review.name} on Google`}
                  >
                    <span>Read full review</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </footer>
            </article>
          ))}
        </div>

        {showGbpLink && (
          <div className="text-center mt-10">
            <a
              href={GBP_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors [&_span]:text-white [&_svg]:text-white"
            >
              <span>Read More Reviews on Google</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
