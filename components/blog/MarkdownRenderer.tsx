import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString as hastToString } from 'hast-util-to-string';
import type { Root, Element } from 'hast';

/**
 * Convert a string to a URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Rehype plugin to add IDs to headings for anchor links
 */
function rehypeHeadingIds() {
  return (tree: Root) => {
    const usedIds = new Set<string>();
    
    visit(tree, 'element', (node: Element) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        // Extract text content from heading
        const text = hastToString(node);
        let id = slugify(text);
        
        // Handle duplicate IDs by appending a number
        if (usedIds.has(id)) {
          let counter = 1;
          while (usedIds.has(`${id}-${counter}`)) {
            counter++;
          }
          id = `${id}-${counter}`;
        }
        
        usedIds.add(id);
        
        // Add the ID to the heading
        if (!node.properties) node.properties = {};
        node.properties.id = id;
      }
    });
  };
}

interface MarkdownRendererProps {
  content: string;
}

/**
 * Extract YouTube video ID from embed URL
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Rehype plugin to replace YouTube iframes with placeholder divs
 */
function rehypeYouTubeFacade() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'iframe' && node.properties?.src) {
        const src = String(node.properties.src);
        const videoId = extractYouTubeId(src);
        
        if (videoId) {
          const title = String(node.properties.title || node.properties['data-title'] || 'YouTube video');
          
          // Replace iframe with placeholder div
          node.tagName = 'div';
          node.properties = {
            class: 'youtube-facade-placeholder',
            'data-video-id': videoId,
            'data-title': title,
          };
          node.children = [];
        }
      }
    });
  };
}

/**
 * Rehype plugin to apply custom styling classes
 */
function rehypeApplyStyles() {
  return (tree: Root) => {
    // First pass: find the first image to mark it as eager (for LCP optimization)
    let firstImageFound = false;
    
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && !firstImageFound) {
        firstImageFound = true;
        // Mark first image for eager loading
        if (!node.properties) node.properties = {};
        node.properties['data-lcp-image'] = 'true';
      }
    });
    
    // Second pass: apply styles
    visit(tree, 'element', (node: Element) => {
      const existingClass = node.properties?.className 
        ? (Array.isArray(node.properties.className) 
            ? node.properties.className.join(' ') 
            : String(node.properties.className))
        : '';
      
      switch (node.tagName) {
        case 'h1':
          node.properties = {
            ...node.properties,
            className: `${existingClass} text-4xl font-bold tracking-tight text-gray-900 mb-4 mt-8`.trim(),
          };
          break;
        case 'h2':
          node.properties = {
            ...node.properties,
            className: `${existingClass} text-3xl font-bold tracking-tight text-gray-900 mb-3 mt-8`.trim(),
          };
          break;
        case 'h3':
          node.properties = {
            ...node.properties,
            className: `${existingClass} text-2xl font-bold tracking-tight text-gray-900 mb-3 mt-6`.trim(),
          };
          break;
        case 'p':
          // Check if paragraph contains block elements (div, iframe, etc.)
          const hasBlockElement = node.children.some((child) => {
            if (child.type === 'element') {
              const tag = (child as Element).tagName;
              return tag === 'div' || tag === 'iframe' || tag === 'span';
            }
            return false;
          });
          
          if (!hasBlockElement) {
            node.properties = {
              ...node.properties,
              className: `${existingClass} text-gray-600 leading-relaxed mb-4`.trim(),
            };
          } else {
            // Remove p wrapper for block elements - render children directly
            // This is handled by not wrapping in p tags during processing
          }
          break;
        case 'ul':
          node.properties = {
            ...node.properties,
            className: `${existingClass} list-disc list-inside space-y-2 mb-4 text-gray-600`.trim(),
          };
          break;
        case 'ol':
          node.properties = {
            ...node.properties,
            className: `${existingClass} list-decimal list-inside space-y-2 mb-4 text-gray-600`.trim(),
          };
          break;
        case 'blockquote':
          node.properties = {
            ...node.properties,
            className: `${existingClass} border-l-4 border-primary pl-4 italic my-4 text-gray-700`.trim(),
          };
          break;
        case 'strong':
          node.properties = {
            ...node.properties,
            className: `${existingClass} font-bold text-gray-900`.trim(),
          };
          break;
        case 'a':
          const href = node.properties?.href ? String(node.properties.href) : '';
          if (href.startsWith('tel:')) {
            node.properties = {
              ...node.properties,
              className: `${existingClass} call-now-button`.trim(),
              style: 'display: inline-block; text-align: center; margin: 2rem 0; width: 100%;',
            };
          } else {
            node.properties = {
              ...node.properties,
              className: existingClass || 'text-primary hover:underline',
            };
          }
          break;
        case 'img':
          // Add styling to images
          const imgSrc = node.properties?.src ? String(node.properties.src) : '';
          const imgAlt = node.properties?.alt ? String(node.properties.alt) : '';
          const imgWidth = node.properties?.width;
          const imgHeight = node.properties?.height;
          const isLcpImage = node.properties?.['data-lcp-image'] === 'true';
          
          node.properties = {
            ...node.properties,
            src: imgSrc,
            alt: imgAlt,
            className: `${existingClass} rounded-lg max-w-full h-auto my-6`.trim(),
            // First image should be eager (not lazy) for LCP optimization
            // Subsequent images can be lazy loaded
            loading: isLcpImage ? 'eager' : 'lazy',
            fetchpriority: isLcpImage ? 'high' : undefined,
          };
          
          // Remove the data attribute as it's no longer needed
          if (node.properties['data-lcp-image']) {
            delete node.properties['data-lcp-image'];
          }
          
          // If no dimensions, add aspect ratio styling via wrapper
          if (!imgWidth || !imgHeight) {
            // We'll handle this via CSS - images without dimensions will use default styling
          }
          break;
      }
    });
  };
}

/**
 * Process markdown content to HTML at build time
 */
export async function processMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeYouTubeFacade)
    .use(rehypeHeadingIds)
    .use(rehypeApplyStyles)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return String(file);
}

export function MarkdownRenderer({ html }: { html: string }) {
  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
