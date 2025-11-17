'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import OptimizedImage from '@/components/OptimizedImage';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4 mt-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-3 mt-6">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-600">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-700">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          img: ({ src, alt, width, height, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src?: string; alt?: string; width?: number | string; height?: number | string }) => {
            // Handle both relative and absolute paths
            const imageSrc = src || '';
            
            // Use OptimizedImage for better performance and optimization
            // If width/height are provided, use them; otherwise use fill with flexible container
            if (width && height) {
              const widthNum = typeof width === 'string' ? parseInt(width) : width;
              const heightNum = typeof height === 'string' ? parseInt(height) : height;
              return (
                <div className="my-6 w-full flex justify-center">
                  <OptimizedImage
                    src={imageSrc}
                    alt={alt || ''}
                    width={widthNum}
                    height={heightNum}
                    className="rounded-lg max-w-full h-auto"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    loading="lazy"
                  />
                </div>
              );
            }
            
            // For images without explicit dimensions, use fill with a flexible container
            return (
              <div className="my-6 w-full relative" style={{ aspectRatio: '16/9', minHeight: '300px' }}>
                <OptimizedImage
                  src={imageSrc}
                  alt={alt || ''}
                  fill
                  className="rounded-lg object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  loading="lazy"
                />
              </div>
            );
          },
          iframe: ({ src, title, height, width, ...props }: React.IframeHTMLAttributes<HTMLIFrameElement> & { src?: string; title?: string }) => {
            // If height is specified, use it; otherwise use responsive aspect ratio
            const containerStyle = height 
              ? { height: typeof height === 'string' ? height : `${height}px` }
              : { aspectRatio: '16/9' };
            
            return (
              <div className="my-6 w-full" style={containerStyle}>
                <iframe
                  src={src}
                  title={title || 'Embedded content'}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  height={height}
                  width={width}
                  {...props}
                />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
