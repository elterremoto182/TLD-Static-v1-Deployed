import { MetadataRoute } from 'next';
import { 
  getAllProblemCityCombinations,
  getAllProblems,
} from '@/lib/local-seo/data';
import {
  getProblemCityLastModified,
  getCachedGitLastModified,
} from '@/lib/git-dates';
import { ensureTrailingSlash, getBaseUrl } from '@/lib/sitemap-utils';

/**
 * Problems Sitemap
 * Contains: Problem hub pages + Problem × City pages (long-tail)
 * ~840 URLs total (21 hubs + 819 problem-city combinations)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  
  const problemsConfigDate = getCachedGitLastModified('config/local-seo/problems.json');
  const problemCityDate = getProblemCityLastModified();

  // Problem hub pages
  const problems = getAllProblems();
  const problemHubRoutes = problems.map((problem) => ({
    url: ensureTrailingSlash(`${baseUrl}/problems/${problem.slug}`, baseUrl),
    lastModified: problemsConfigDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Problem × City pages (long-tail)
  const problemCityCombinations = getAllProblemCityCombinations();
  const problemCityRoutes = problemCityCombinations.map(({ problem, city }) => ({
    url: ensureTrailingSlash(`${baseUrl}/problems/${problem}/${city}`, baseUrl),
    lastModified: problemCityDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...problemHubRoutes,
    ...problemCityRoutes,
  ];
}
