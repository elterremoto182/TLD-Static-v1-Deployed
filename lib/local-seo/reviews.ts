/**
 * Reviews data layer for city and hub pages
 * 
 * Loads Google reviews from JSON, scores by relevance (city + service),
 * and provides deterministic selection with rotation to avoid repetition.
 */

import reviewsData from '@/config/local-seo/reviews.json';
import { GBP_REVIEWS_URL } from '@/config/local-seo/gbp';

export interface Review {
  reviewId: string;
  text: string;
  reviewUrl: string;
  name: string;
  stars: number;
  publishedAtDate: string;
}

interface RawReview {
  reviewId: string;
  text: string | null;
  reviewUrl: string;
  reviewImageUrls?: string[];
  name: string;
  stars: number;
  publishedAtDate: string;
}

// Service keyword mapping for relevance scoring
const SERVICE_KEYWORDS: Record<string, string[]> = {
  'leak-detection': ['leak', 'water', 'pipe', 'slab', 'detection', 'moisture', 'plumbing'],
  'mold-testing': ['mold', 'mould', 'air quality', 'testing', 'remediation', 'spore'],
  'sewer-camera-inspection': ['sewer', 'drain', 'camera', 'inspection', 'clog', 'blockage', 'root'],
};

// City name variations for matching
const CITY_VARIATIONS: Record<string, string[]> = {
  'miami': ['miami'],
  'miami-beach': ['miami beach', 'miami-beach', 'south beach'],
  'coral-gables': ['coral gables'],
  'hialeah': ['hialeah'],
  'fort-lauderdale': ['fort lauderdale', 'ft lauderdale', 'ft. lauderdale'],
  'hollywood': ['hollywood'],
  'pembroke-pines': ['pembroke pines', 'pembroke'],
  'pompano-beach': ['pompano beach', 'pompano'],
  'plantation': ['plantation'],
  'miramar': ['miramar'],
  'doral': ['doral'],
  'kendall': ['kendall'],
  'aventura': ['aventura'],
  'north-miami': ['north miami'],
  'pinecrest': ['pinecrest'],
  'homestead': ['homestead'],
  'miami-lakes': ['miami lakes'],
  'cutler-bay': ['cutler bay'],
  'coral-springs': ['coral springs'],
  'davie': ['davie'],
  'sunrise': ['sunrise'],
  'weston': ['weston'],
  'deerfield-beach': ['deerfield beach', 'deerfield'],
  'hallandale-beach': ['hallandale beach', 'hallandale'],
  'cooper-city': ['cooper city'],
};

/**
 * Simple hash function for deterministic rotation
 */
function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Load and filter reviews (5 stars only, has text)
 * Source file contains only 5-star reviews; we still validate at load time.
 */
export function loadReviews(): Review[] {
  const raw = reviewsData as RawReview[];
  
  return raw
    .filter((r): r is RawReview & { text: string } => {
      if (!r.text || r.text.trim().length === 0) return false;
      if (r.stars !== 5) return false;
      return true;
    })
    .map((r) => ({
      reviewId: r.reviewId,
      text: r.text,
      reviewUrl: r.reviewUrl,
      name: r.name,
      stars: r.stars,
      publishedAtDate: r.publishedAtDate,
    }));
}

/**
 * Score a review for relevance to city and service
 */
export function scoreReview(
  review: Review,
  citySlug: string | null,
  serviceSlug: string
): number {
  let score = 0;
  const textLower = review.text.toLowerCase();

  // City match: +10 points
  if (citySlug) {
    const variations = CITY_VARIATIONS[citySlug] || [citySlug.replace(/-/g, ' ')];
    for (const variation of variations) {
      if (textLower.includes(variation.toLowerCase())) {
        score += 10;
        break;
      }
    }
  }

  // Service keyword matches: +5 per keyword (max 3 keywords = 15 points)
  const keywords = SERVICE_KEYWORDS[serviceSlug] || [];
  let keywordMatches = 0;
  for (const keyword of keywords) {
    if (textLower.includes(keyword.toLowerCase())) {
      keywordMatches++;
      if (keywordMatches >= 3) break;
    }
  }
  score += keywordMatches * 5;

  // Star rating bonus: 5-star gets +2
  if (review.stars === 5) {
    score += 2;
  }

  // Recency bonus: reviews from last 2 years get +3
  const reviewDate = new Date(review.publishedAtDate);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  if (reviewDate > twoYearsAgo) {
    score += 3;
  }

  return score;
}

/**
 * Select reviews for a city page with deterministic rotation
 */
export function selectReviewsForPage(
  citySlug: string,
  serviceSlug: string,
  count: number
): Review[] {
  const allReviews = loadReviews();
  
  // Score and sort reviews
  const scoredReviews = allReviews
    .map((review) => ({
      review,
      score: scoreReview(review, citySlug, serviceSlug),
    }))
    .sort((a, b) => b.score - a.score);

  // Deterministic rotation based on city+service
  const seed = `${citySlug}-${serviceSlug}`;
  const hash = simpleHash(seed);
  const startIndex = hash % scoredReviews.length;

  // Select reviews with wrap-around
  const selected: Review[] = [];
  for (let i = 0; i < count && i < scoredReviews.length; i++) {
    const index = (startIndex + i) % scoredReviews.length;
    selected.push(scoredReviews[index].review);
  }

  return selected;
}

/**
 * Select reviews for a service hub page (no city context)
 */
export function selectReviewsForHub(
  serviceSlug: string,
  count: number = 3
): Review[] {
  const allReviews = loadReviews();
  
  // Score by service relevance only
  const scoredReviews = allReviews
    .map((review) => ({
      review,
      score: scoreReview(review, null, serviceSlug),
    }))
    .sort((a, b) => b.score - a.score);

  // Deterministic rotation based on service slug
  const hash = simpleHash(serviceSlug);
  const startIndex = hash % scoredReviews.length;

  // Select reviews with wrap-around
  const selected: Review[] = [];
  for (let i = 0; i < count && i < scoredReviews.length; i++) {
    const index = (startIndex + i) % scoredReviews.length;
    selected.push(scoredReviews[index].review);
  }

  return selected;
}

/**
 * Truncate review text to specified length with ellipsis
 */
export function truncateReviewText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  
  // Find last space before maxLength to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

// Re-export GBP URL for convenience
export { GBP_REVIEWS_URL };
