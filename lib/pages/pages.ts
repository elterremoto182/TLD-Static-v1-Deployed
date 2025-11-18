import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const pagesDirectory = path.join(process.cwd(), 'content/pages');

export interface Page {
  slug: string;
  title: string;
  seo_title?: string;
  seo_description?: string;
  keywords?: string[];
  menu_order?: number;
  content: string;
}

export function getPageBySlug(slug: string): Page | null {
  try {
    // Normalize slug - remove leading/trailing slashes for file lookup
    const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
    
    // Find the markdown file that matches this slug
    if (!fs.existsSync(pagesDirectory)) {
      return null;
    }

    const files = fs.readdirSync(pagesDirectory).filter((file) => file.endsWith('.md'));
    
    for (const file of files) {
      const fullPath = path.join(pagesDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Get the slug from frontmatter and normalize it
      const pageSlug = (data.slug || '').replace(/^\/+|\/+$/g, '');
      
      // Match if the normalized slugs match
      if (pageSlug === normalizedSlug) {
        return {
          slug: data.slug || '',
          title: data.title || '',
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          keywords: data.keywords,
          menu_order: data.menu_order,
          content,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error reading page:', error);
    return null;
  }
}

export function getAllPages(): Page[] {
  if (!fs.existsSync(pagesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(pagesDirectory).filter((file) => file.endsWith('.md'));
  
  const pages: Page[] = [];
  
  for (const file of files) {
    try {
      const fullPath = path.join(pagesDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      pages.push({
        slug: data.slug || '',
        title: data.title || '',
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        keywords: data.keywords,
        menu_order: data.menu_order || 0,
        content,
      });
    } catch (error) {
      // Skip files that can't be parsed
      console.error(`Error parsing page file ${file}:`, error);
    }
  }
  
  return pages.sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
}

