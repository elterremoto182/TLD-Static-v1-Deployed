'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceVideoEmbedProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

/**
 * Extracts YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * ServiceVideoEmbed - A performance-optimized YouTube embed component
 * Uses a facade pattern to defer loading the iframe until user clicks
 * 
 * Features:
 * - Lazy loads iframe on user interaction
 * - Uses high-quality thumbnail
 * - Responsive design
 * - Smooth animations
 */
export function ServiceVideoEmbed({ 
  videoUrl, 
  title = 'Service Video',
  className 
}: ServiceVideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) {
    console.warn('ServiceVideoEmbed: Invalid YouTube URL provided:', videoUrl);
    return null;
  }

  // Use maxresdefault for best quality, with fallback options
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handlePlay = () => {
    setIsLoaded(true);
  };

  return (
    <section className={cn("py-16 bg-gradient-to-b from-gray-50 to-white", className)}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            See Our Work in Action
          </h2>
          <p className="text-gray-600 text-lg">
            Watch how our professional team delivers results
          </p>
        </div>
        
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900 group">
          {!isLoaded ? (
            // Facade - shows thumbnail until user clicks
            <button
              onClick={handlePlay}
              className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-accent/50 focus:ring-offset-2 rounded-2xl"
              aria-label={`Play ${title}`}
            >
              {/* Thumbnail */}
              <img
                src={thumbnailUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback to hqdefault if maxres not available
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulse ring animation */}
                  <div className="absolute inset-0 bg-accent/30 rounded-full animate-ping" />
                  
                  {/* Main play button */}
                  <div className="relative w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/90">
                    <Play className="w-9 h-9 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              {/* Watch Video label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ▶ Watch Video
                </span>
              </div>
            </button>
          ) : (
            // Actual iframe - loaded after user clicks
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        
        {/* Trust indicator */}
        <p className="text-center text-gray-500 text-sm mt-4">
          See the quality and professionalism we bring to every job
        </p>
      </div>
    </section>
  );
}

export default ServiceVideoEmbed;

