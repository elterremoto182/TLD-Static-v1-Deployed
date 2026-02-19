/**
 * Google Business Profile configuration
 * 
 * The GBP_REVIEWS_URL is used for "Read more reviews" links on city and hub pages.
 * Derived from the place ID found in review URLs (0xe71d994945507136).
 */

// Google Business Profile reviews URL
// Format: Google Maps place URL with embedded place identifier
export const GBP_REVIEWS_URL = 'https://www.google.com/maps/place/Total+Leak+Detection/@25.9653851,-80.2091003,17z/data=!4m8!3m7!1s0x88d9ad36d0a1e4d1:0xe71d994945507136!8m2!3d25.9653851!4d-80.2065254!9m1!1b1!16s%2Fg%2F1td5s2td?entry=ttu';

// Alternative simpler URL (fallback if the above doesn't work)
export const GBP_SEARCH_URL = 'https://www.google.com/maps/search/Total+Leak+Detection';
