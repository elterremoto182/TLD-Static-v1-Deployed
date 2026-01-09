'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
  thumbnailUrl?: string;
}

/**
 * Lightweight YouTube embed with facade pattern for performance.
 * Only loads the iframe when the user clicks to play.
 */
export function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
  className,
  thumbnailUrl,
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Use YouTube's high-quality thumbnail as default
  const thumbnail = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handlePlay = () => {
    setIsLoaded(true);
  };

  if (isLoaded) {
    return (
      <div className={cn('youtube-facade', className)}>
        <div className="youtube-facade-iframe-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="youtube-facade-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('youtube-facade', className)}>
      <button
        type="button"
        className="youtube-facade-button"
        aria-label={`Play ${title}`}
        onClick={handlePlay}
      >
        <img
          src={thumbnail}
          alt={title}
          className="youtube-facade-thumb"
          loading="lazy"
          decoding="async"
        />
        <div className="youtube-facade-overlay" />
        <div className="youtube-facade-play">
          <div className="youtube-facade-play-btn">
            <svg
              className="youtube-facade-play-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

