/**
 * Git-based date utilities for SEO
 * 
 * Extracts git commit dates for accurate lastModified values in sitemaps
 * and structured data. This runs at build time only.
 */

import { execSync } from 'child_process';
import path from 'path';

/**
 * Get the last modified date of a file based on git commit history
 * Falls back to current date if git history is unavailable
 */
export function getGitLastModified(filePath: string): Date {
  try {
    // Get the last commit date for the file
    const timestamp = execSync(
      `git log -1 --format=%cI -- "${filePath}"`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    ).trim();
    
    return timestamp ? new Date(timestamp) : new Date();
  } catch {
    // Git command failed (not a git repo, file not tracked, etc.)
    return new Date();
  }
}

/**
 * Get the last modified date for a config file
 * Used for local SEO pages that are generated from JSON config
 */
export function getConfigFileLastModified(configPath: string): Date {
  const fullPath = path.join(process.cwd(), configPath);
  return getGitLastModified(fullPath);
}

/**
 * Get the most recent modification date from multiple files
 * Useful when a page depends on multiple source files
 */
export function getMostRecentModified(filePaths: string[]): Date {
  const dates = filePaths.map(fp => getGitLastModified(fp));
  return new Date(Math.max(...dates.map(d => d.getTime())));
}

/**
 * Cache for git dates to avoid repeated git commands during build
 */
const gitDateCache = new Map<string, Date>();

/**
 * Cached version of getGitLastModified for build performance
 */
export function getCachedGitLastModified(filePath: string): Date {
  if (gitDateCache.has(filePath)) {
    return gitDateCache.get(filePath)!;
  }
  
  const date = getGitLastModified(filePath);
  gitDateCache.set(filePath, date);
  return date;
}

/**
 * Get git dates for local SEO config files
 * Returns dates for cities.json, services.json, and faqs.json
 */
export function getLocalSeoConfigDates(): {
  cities: Date;
  services: Date;
  faqs: Date;
  problems: Date;
} {
  return {
    cities: getCachedGitLastModified('config/local-seo/cities.json'),
    services: getCachedGitLastModified('config/local-seo/services.json'),
    faqs: getCachedGitLastModified('config/local-seo/faqs.json'),
    problems: getCachedGitLastModified('config/local-seo/problems.json'),
  };
}

/**
 * Get the last modified date for a city-service page
 * Based on the most recent change to either cities.json or services.json
 */
export function getCityServiceLastModified(): Date {
  const dates = getLocalSeoConfigDates();
  return new Date(Math.max(
    dates.cities.getTime(),
    dates.services.getTime(),
    dates.faqs.getTime()
  ));
}

/**
 * Get the last modified date for a problem-city page
 */
export function getProblemCityLastModified(): Date {
  const dates = getLocalSeoConfigDates();
  return new Date(Math.max(
    dates.cities.getTime(),
    dates.problems.getTime()
  ));
}

/**
 * Clear the git date cache (useful for testing)
 */
export function clearGitDateCache(): void {
  gitDateCache.clear();
}
