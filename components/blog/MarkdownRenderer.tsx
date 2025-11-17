'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
          img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src?: string; alt?: string }) => {
            // Handle both relative and absolute paths
            const imageSrc = src || '';
            return (
              <img
                src={imageSrc}
                alt={alt || ''}
                className="rounded-lg my-6 w-full h-auto"
                loading="lazy"
                {...props}
              />
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
