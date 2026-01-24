/**
 * City Tier System for Internal Linking
 * 
 * Implements a 3-tier hierarchy for distributing link equity:
 * - Tier 1: Major metros in Miami-Dade & Broward (linked from ALL service hubs)
 * - Tier 2: Secondary cities (linked from Tier 1 city pages)
 * - Tier 3: Remaining cities (linked from Tier 2 city pages + /areas/ safety net)
 */

import { getAllCitySlugs } from './data';

// Tier 1: Major metros - Miami-Dade & Broward (10 cities total)
// All Tier 1 cities receive inbound links from every service hub
export const TIER_1_CITIES = [
  // Miami-Dade
  'miami', 'miami-beach', 'coral-gables', 'hialeah',
  // Broward  
  'fort-lauderdale', 'hollywood', 'pembroke-pines', 'pompano-beach',
  'plantation', 'miramar'
] as const;

// Tier 2: Secondary markets - Miami-Dade, Broward & Palm Beach (15 cities)
// Tier 2 cities receive links from geographically nearby Tier 1 cities
export const TIER_2_CITIES = [
  // Miami-Dade
  'doral', 'kendall', 'aventura', 'north-miami', 'pinecrest',
  'homestead', 'miami-lakes', 'cutler-bay',
  // Broward
  'coral-springs', 'davie', 'sunrise', 'weston', 'deerfield-beach',
  'hallandale-beach', 'cooper-city'
] as const;

// Type exports for type safety
export type Tier1City = typeof TIER_1_CITIES[number];
export type Tier2City = typeof TIER_2_CITIES[number];
export type CityTier = 1 | 2 | 3;

/**
 * Get the tier level for a city
 * @param citySlug - The city slug to check
 * @returns 1, 2, or 3 based on the city's tier
 */
export function getCityTier(citySlug: string): CityTier {
  if (TIER_1_CITIES.includes(citySlug as Tier1City)) {
    return 1;
  }
  if (TIER_2_CITIES.includes(citySlug as Tier2City)) {
    return 2;
  }
  return 3;
}

/**
 * Check if a city is in Tier 1
 */
export function isTier1City(citySlug: string): citySlug is Tier1City {
  return TIER_1_CITIES.includes(citySlug as Tier1City);
}

/**
 * Check if a city is in Tier 2
 */
export function isTier2City(citySlug: string): citySlug is Tier2City {
  return TIER_2_CITIES.includes(citySlug as Tier2City);
}

/**
 * Check if a city is in Tier 3
 */
export function isTier3City(citySlug: string): boolean {
  return !isTier1City(citySlug) && !isTier2City(citySlug);
}

/**
 * Get all cities in a specific tier
 * @param tier - The tier level (1, 2, or 3)
 * @returns Array of city slugs in that tier
 */
export function getTierCities(tier: CityTier): readonly string[] {
  switch (tier) {
    case 1:
      return TIER_1_CITIES;
    case 2:
      return TIER_2_CITIES;
    case 3:
      // Tier 3 is all cities not in Tier 1 or Tier 2
      return getAllCitySlugs().filter(
        slug => !isTier1City(slug) && !isTier2City(slug)
      );
  }
}

/**
 * Get the target tier for outbound links from a city
 * - Tier 1 cities link to Tier 2
 * - Tier 2 cities link to Tier 3
 * - Tier 3 cities link to other Tier 3 (mesh network)
 */
export function getTargetTierForCity(citySlug: string): CityTier {
  const currentTier = getCityTier(citySlug);
  if (currentTier === 1) return 2;
  if (currentTier === 2) return 3;
  return 3; // Tier 3 links to other Tier 3
}

/**
 * Get page type string for link budget based on city tier
 */
export function getPageTypeForCity(citySlug: string): string {
  const tier = getCityTier(citySlug);
  return `city-tier-${tier}`;
}
