'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight client component that hydrates YouTube facade placeholders.
 * Only loads minimal JS needed for click-to-play functionality.
 */
export function YouTubeHydrator({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all YouTube facade placeholders
    const placeholders = containerRef.current.querySelectorAll('.youtube-facade-placeholder');
    
    placeholders.forEach((placeholder) => {
      const videoId = placeholder.getAttribute('data-video-id');
      const title = placeholder.getAttribute('data-title') || 'YouTube video';
      const customThumb = placeholder.getAttribute('data-custom-thumb');
      
      if (!videoId) return;

      // Use custom thumbnail if provided, otherwise use YouTube's default
      const thumbnailUrl = customThumb || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      // Create the facade element
      const facadeWrapper = document.createElement('div');
      facadeWrapper.className = 'youtube-facade';
      facadeWrapper.innerHTML = `<button type="button" class="youtube-facade-button" aria-label="Play ${title}" data-video-id="${videoId}"><img src="${thumbnailUrl}" alt="${title}" class="youtube-facade-thumb" loading="lazy" /><div class="youtube-facade-overlay"></div><div class="youtube-facade-play"><div class="youtube-facade-play-btn"><svg class="youtube-facade-play-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div></button>`;

      // Add click handler
      const button = facadeWrapper.querySelector('button');
      button?.addEventListener('click', () => {
        // Replace with iframe
        facadeWrapper.innerHTML = `<div class="youtube-facade-iframe-wrapper"><iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="${title}" class="youtube-facade-iframe" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        setLoadedVideos((prev) => new Set(prev).add(videoId));
      });

      // Replace placeholder with facade
      placeholder.replaceWith(facadeWrapper);
    });
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

