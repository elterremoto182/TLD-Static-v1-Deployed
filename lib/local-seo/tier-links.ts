/**
 * Tier-Based Internal Linking System
 * 
 * Implements strategic link distribution using a 3-tier city hierarchy:
 * - Service Hubs → All Tier 1 cities
 * - Tier 1 cities → 3 nearest Tier 2 cities + supplemental orphans
 * - Tier 2 cities → 3 nearest Tier 3 cities
 * - Tier 3 cities → 3 nearest other Tier 3 cities (mesh network)
 */

import { getCity, getService, getAllCitySlugs, type City, type Service } from './data';
import { 
  TIER_1_CITIES, 
  TIER_2_CITIES, 
  getCityTier, 
  getTierCities,
  getTargetTierForCity,
  type CityTier 
} from './city-tiers';
import type { InternalLink } from './links';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get geographically nearest cities from a specific tier
 * @param citySlug - The source city
 * @param targetTierCities - Array of city slugs to search within
 * @param limit - Maximum number of cities to return
 * @returns Array of city slugs sorted by distance
 */
export function getGeographicallyNearbyFromTier(
  citySlug: string,
  targetTierCities: readonly string[],
  limit: number = 3
): string[] {
  const sourceCity = getCity(citySlug);
  if (!sourceCity) return [];

  const distances: Array<{ slug: string; distance: number }> = [];

  for (const targetSlug of targetTierCities) {
    if (targetSlug === citySlug) continue; // Skip self
    
    const targetCity = getCity(targetSlug);
    if (!targetCity) continue;

    const distance = calculateDistance(
      sourceCity.coordinates.lat,
      sourceCity.coordinates.lng,
      targetCity.coordinates.lat,
      targetCity.coordinates.lng
    );

    distances.push({ slug: targetSlug, distance });
  }

  // Sort by distance and return the nearest
  return distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(d => d.slug);
}

/**
 * Get the target city slugs for tier-based linking
 * - Tier 1 → nearest Tier 2 cities
 * - Tier 2 → nearest Tier 3 cities
 * - Tier 3 → nearest other Tier 3 cities (mesh)
 */
export function getTierCitySlugs(citySlug: string, limit: number = 3): string[] {
  const currentTier = getCityTier(citySlug);
  const targetTier = getTargetTierForCity(citySlug);
  const targetCities = getTierCities(targetTier);

  // For Tier 3 linking to other Tier 3, exclude self
  if (currentTier === 3) {
    const otherTier3 = targetCities.filter(slug => slug !== citySlug);
    return getGeographicallyNearbyFromTier(citySlug, otherTier3, limit);
  }

  return getGeographicallyNearbyFromTier(citySlug, targetCities, limit);
}

// ============================================================================
// SERVICE HUB LINKING FUNCTIONS
// ============================================================================

/**
 * Get links to ALL Tier 1 cities for a service hub page
 * Every service hub links to every Tier 1 city to maximize their authority
 */
export function getAllTier1CityLinks(serviceSlug: string): InternalLink[] {
  const service = getService(serviceSlug);
  if (!service) return [];

  return TIER_1_CITIES.map(slug => {
    const city = getCity(slug);
    return {
      href: `/${serviceSlug}/${slug}/`,
      label: `${service.name} in ${city?.name || slug}`,
      description: `Professional ${service.name.toLowerCase()} services in ${city?.name || slug}, ${city?.county || 'FL'}`,
    };
  });
}

/**
 * Get links to Tier 2 cities for a service hub page
 * These are shown in a secondary section
 */
export function getAllTier2CityLinks(serviceSlug: string): InternalLink[] {
  const service = getService(serviceSlug);
  if (!service) return [];

  return TIER_2_CITIES.map(slug => {
    const city = getCity(slug);
    return {
      href: `/${serviceSlug}/${slug}/`,
      label: `${service.name} in ${city?.name || slug}`,
      description: `Professional ${service.name.toLowerCase()} services in ${city?.name || slug}, ${city?.county || 'FL'}`,
    };
  });
}

// ============================================================================
// CITY PAGE LINKING FUNCTIONS
// ============================================================================

/**
 * Get tier-based city links for a city page
 * Returns links to cities in the appropriate tier below (or same tier for Tier 3)
 */
export function getTierLinksForCity(
  citySlug: string,
  serviceSlug: string,
  limit: number = 3
): InternalLink[] {
  const city = getCity(citySlug);
  const service = getService(serviceSlug);

  if (!city || !service) return [];

  const targetSlugs = getTierCitySlugs(citySlug, limit);

  return targetSlugs.map(slug => {
    const targetCity = getCity(slug);
    return {
      href: `/${serviceSlug}/${slug}/`,
      label: `${service.name} in ${targetCity?.name || slug}`,
      description: `Professional ${service.name.toLowerCase()} in ${targetCity?.name || slug}`,
    };
  });
}

// ============================================================================
// ORPHAN PREVENTION (SUPPLEMENTAL LINKS)
// ============================================================================

/**
 * Identify Tier 2 cities that wouldn't receive links through the 
 * "nearest 3" selection from Tier 1 cities
 */
function getOrphanedTier2Cities(): string[] {
  const covered = new Set<string>();

  // Simulate nearest-3 selection from each Tier 1 city
  for (const t1Slug of TIER_1_CITIES) {
    const nearest3 = getGeographicallyNearbyFromTier(t1Slug, TIER_2_CITIES, 3);
    nearest3.forEach(slug => covered.add(slug));
  }

  // Return Tier 2 cities not in covered set
  return TIER_2_CITIES.filter(slug => !covered.has(slug));
}

/**
 * Get supplemental Tier 2 city links for cities that would otherwise be orphaned.
 * Distributes orphaned Tier 2 cities across Tier 1 city pages deterministically.
 * 
 * Only Tier 1 cities receive supplemental links (they link "down" to Tier 2).
 * The distribution ensures each orphaned Tier 2 city gets at least one inbound link.
 * 
 * @param citySlug - Current city slug (must be Tier 1 to receive supplemental links)
 * @param serviceSlug - Service slug for the URL
 * @returns Array of InternalLink objects for orphaned Tier 2 cities assigned to this page
 */
export function getSupplementalTier2Links(
  citySlug: string,
  serviceSlug: string
): InternalLink[] {
  // Only Tier 1 cities get supplemental links (they link down to Tier 2)
  if (getCityTier(citySlug) !== 1) return [];

  const service = getService(serviceSlug);
  if (!service) return [];

  // Get the list of orphaned Tier 2 cities
  const orphanedTier2 = getOrphanedTier2Cities();

  // If no orphaned cities, nothing to do
  if (orphanedTier2.length === 0) return [];

  // Deterministically assign orphaned cities to Tier 1 pages
  // Each Tier 1 city gets a subset based on its index
  const tier1Index = TIER_1_CITIES.indexOf(citySlug as typeof TIER_1_CITIES[number]);
  if (tier1Index === -1) return [];

  // Distribute orphaned cities across all Tier 1 cities using modulo
  const assigned = orphanedTier2.filter((_, i) => 
    i % TIER_1_CITIES.length === tier1Index
  );

  return assigned.map(slug => {
    const city = getCity(slug);
    return {
      href: `/${serviceSlug}/${slug}/`,
      label: `${service.name} in ${city?.name || slug}`,
      description: `Professional ${service.name.toLowerCase()} in ${city?.name || slug}`,
    };
  });
}

// ============================================================================
// COMBINED FUNCTIONS FOR PAGE USE
// ============================================================================

/**
 * Get all nearby city links for a city page (tier links + supplemental)
 * This is the main function to use in city service pages
 */
export function getAllNearbyTierLinks(
  citySlug: string,
  serviceSlug: string,
  limit: number = 3
): InternalLink[] {
  const tierLinks = getTierLinksForCity(citySlug, serviceSlug, limit);
  const supplementalLinks = getSupplementalTier2Links(citySlug, serviceSlug);
  return [...tierLinks, ...supplementalLinks];
}

/**
 * Get cities grouped by tier for display purposes
 */
export function getCitiesGroupedByTier(): {
  tier1: string[];
  tier2: string[];
  tier3: string[];
} {
  return {
    tier1: [...TIER_1_CITIES],
    tier2: [...TIER_2_CITIES],
    tier3: getTierCities(3) as string[],
  };
}

/**
 * Debug function: Show link flow for a specific city
 */
export function debugCityLinkFlow(citySlug: string): {
  city: string;
  tier: CityTier;
  linksTo: string[];
  receivesLinksFrom: string[];
} {
  const tier = getCityTier(citySlug);
  const linksTo = getTierCitySlugs(citySlug, 3);
  
  // Calculate who links TO this city
  const receivesLinksFrom: string[] = [];
  
  if (tier === 1) {
    // Tier 1 receives links from service hubs (represented as 'service-hub')
    receivesLinksFrom.push('service-hubs');
  } else if (tier === 2) {
    // Tier 2 receives links from Tier 1 cities that have it in their nearest-3
    for (const t1Slug of TIER_1_CITIES) {
      const nearest3 = getGeographicallyNearbyFromTier(t1Slug, TIER_2_CITIES, 3);
      if (nearest3.includes(citySlug)) {
        receivesLinksFrom.push(t1Slug);
      }
    }
    // Also check supplemental links
    const orphaned = getOrphanedTier2Cities();
    if (orphaned.includes(citySlug)) {
      const orphanIndex = orphaned.indexOf(citySlug);
      const assignedTier1 = TIER_1_CITIES[orphanIndex % TIER_1_CITIES.length];
      if (!receivesLinksFrom.includes(assignedTier1)) {
        receivesLinksFrom.push(`${assignedTier1} (supplemental)`);
      }
    }
  } else {
    // Tier 3 receives links from Tier 2 cities
    for (const t2Slug of TIER_2_CITIES) {
      const nearest3 = getGeographicallyNearbyFromTier(t2Slug, getTierCities(3), 3);
      if (nearest3.includes(citySlug)) {
        receivesLinksFrom.push(t2Slug);
      }
    }
    // And from other Tier 3 cities (mesh)
    for (const t3Slug of getTierCities(3)) {
      if (t3Slug === citySlug) continue;
      const nearest3 = getGeographicallyNearbyFromTier(t3Slug, getTierCities(3), 3);
      if (nearest3.includes(citySlug)) {
        receivesLinksFrom.push(t3Slug);
      }
    }
  }

  return {
    city: citySlug,
    tier,
    linksTo,
    receivesLinksFrom,
  };
}
