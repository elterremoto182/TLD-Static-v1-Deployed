/**
 * Link Budget System
 * 
 * Defines maximum outbound internal links per page type to avoid
 * over-linking (which dilutes SEO value and page authority).
 * 
 * Budget tiers:
 * - min: Minimum recommended links for good internal linking
 * - max: Target maximum for optimal link equity distribution
 * - hardCap: Absolute maximum (exceeding triggers warning)
 */

export interface LinkBudget {
  min: number;
  max: number;
  hardCap: number;
}

export type PageType = 
  | 'blog'
  | 'city'          // Legacy fallback
  | 'city-tier-1'   // High authority pages
  | 'city-tier-2'   // Mid-tier pages
  | 'city-tier-3'   // Lower authority pages
  | 'problem'
  | 'segment'
  | 'service-hub'
  | 'guide'
  | 'static'
  | 'other';

/**
 * Link budgets per page type
 * 
 * Tier 1 cities get higher budgets because they have more authority to share
 * and receive more inbound links from service hubs.
 */
export const LINK_BUDGETS: Record<PageType, LinkBudget> = {
  'blog': { min: 5, max: 7, hardCap: 8 },
  'city': { min: 5, max: 7, hardCap: 8 },          // Legacy fallback
  'city-tier-1': { min: 5, max: 8, hardCap: 10 },  // Higher authority, more outbound allowed
  'city-tier-2': { min: 5, max: 7, hardCap: 9 },   // Mid-tier
  'city-tier-3': { min: 4, max: 6, hardCap: 8 },   // Stricter budget
  'problem': { min: 5, max: 8, hardCap: 10 },
  'segment': { min: 6, max: 10, hardCap: 12 },
  'service-hub': { min: 10, max: 15, hardCap: 18 },
  'guide': { min: 5, max: 10, hardCap: 12 },
  'static': { min: 0, max: 50, hardCap: 100 },
  'other': { min: 0, max: 50, hardCap: 100 },
};

/**
 * Get the link budget for a specific page type
 */
export function getLinkBudget(pageType: PageType): LinkBudget {
  return LINK_BUDGETS[pageType] || LINK_BUDGETS.other;
}

/**
 * Check if a link count is within budget
 */
export function isWithinBudget(pageType: PageType, linkCount: number): boolean {
  const budget = getLinkBudget(pageType);
  return linkCount <= budget.max;
}

/**
 * Check if a link count exceeds the hard cap
 */
export function exceedsHardCap(pageType: PageType, linkCount: number): boolean {
  const budget = getLinkBudget(pageType);
  return linkCount > budget.hardCap;
}

/**
 * Get available link slots remaining in budget
 */
export function getRemainingBudget(pageType: PageType, currentLinkCount: number): number {
  const budget = getLinkBudget(pageType);
  return Math.max(0, budget.max - currentLinkCount);
}

/**
 * Trim links array to fit within budget
 */
export function trimToBudget<T>(links: T[], pageType: PageType): T[] {
  const budget = getLinkBudget(pageType);
  return links.slice(0, budget.max);
}
