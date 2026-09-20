import { useRef, useEffect, useState, useCallback, forwardRef } from 'react';

export interface CinematicVideoProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  playbackRate?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface CinematicVideoControls {
  play: () => Promise<void>;
  pause: () => void;
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
  setPlaybackRate: (rate: number) => void;
}

export function useCinematicVideo(
  src: string,
  options: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    preload?: 'none' | 'metadata' | 'auto';
  } = {}
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = src;
    video.muted = options.muted ?? true;
    video.playsInline = options.playsInline ?? true;
    video.preload = options.preload ?? 'metadata';
    video.loop = options.loop ?? false;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
    };

    const handleCanPlay = () => {
      if (options.autoplay && !prefersReducedMotion) {
        video.play().catch(() => {});
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleError = () => setError(new Error(video.error?.message || 'Video failed to load'));

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
    };
  }, [src, options.autoplay, options.muted, options.loop, options.playsInline, options.preload, prefersReducedMotion]);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (video) {
      try {
        await video.play();
      } catch (err) {
        console.warn('Video play failed:', err);
      }
    }
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video) video.pause();
  }, []);

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = Math.max(0, Math.min(time, video.duration));
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (video) video.playbackRate = rate;
  }, []);

  return {
    videoRef,
    isLoaded,
    isPlaying,
    duration,
    currentTime,
    error,
    prefersReducedMotion,
    controls: {
      play,
      pause,
      seekTo,
      getCurrentTime: () => currentTime,
      getDuration: () => duration,
      isPlaying: () => isPlaying,
      setPlaybackRate,
    },
  } as const;
}

const CinematicVideoComponent = forwardRef<HTMLVideoElement, CinematicVideoProps>(
  (
    {
      src,
      poster,
      autoplay = false,
      muted = true,
      playsInline = true,
      loop = false,
      preload = 'auto',
      playbackRate,
      className = '',
      style,
      onLoad,
      onError,
      onEnded,
      onPlay,
      onPause,
      onTimeUpdate,
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);

      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => {
        mediaQuery.removeEventListener('change', handler);
        window.removeEventListener('resize', checkMobile);
      };
    }, []);

    useEffect(() => {
      const node = internalRef.current;
      if (!forwardedRef) return;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else {
        forwardedRef.current = node;
      }
    });

    useEffect(() => {
      const video = internalRef.current;
      if (!video) return;

      // Enforce native DOM properties for strict mobile Safari/Android autoplay
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('muted', '');
      if (autoplay) {
        video.setAttribute('autoplay', '');
      }

      if (playbackRate !== undefined && playbackRate > 0) {
        video.playbackRate = playbackRate;
      }

      const attemptPlay = () => {
        if (!video || isReducedMotion) return;
        if (playbackRate !== undefined && playbackRate > 0) {
          video.playbackRate = playbackRate;
        }
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // Autoplay deferred by browser policy; fallback interaction listeners will resume
            console.debug('Autoplay deferred:', err);
          });
        }
      };

      if (autoplay && !isReducedMotion) {
        attemptPlay();
      }

      // Interaction fallback: first tap/scroll/touch immediately starts playback on mobile
      const interactionEvents = ['touchstart', 'pointerdown', 'touchend', 'scroll', 'click'];
      const onFirstInteraction = () => {
        attemptPlay();
        interactionEvents.forEach((evt) => window.removeEventListener(evt, onFirstInteraction));
      };
      interactionEvents.forEach((evt) => {
        window.addEventListener(evt, onFirstInteraction, { once: true, passive: true });
      });

      return () => {
        interactionEvents.forEach((evt) => window.removeEventListener(evt, onFirstInteraction));
      };
    }, [autoplay, playbackRate, isReducedMotion]);

    if (isReducedMotion && poster) {
      return (
        <div
          className={`cinematic-video-reduced-motion ${className}`}
          style={{
            ...style,
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          role="img"
          aria-label="Cinematic Durga Mata sequence (reduced motion fallback)"
        />
      );
    }

    // Adaptive preload: 'metadata' on mobile to avoid 6.25MB connection choke
    const effectivePreload = isMobile ? 'metadata' : preload;

    // Frame readiness gate: Only notify parent when actual video frames are rendering
    const handleFrameReady = (videoEl: HTMLVideoElement) => {
      if (!videoEl.paused || videoEl.currentTime > 0) {
        onLoad?.();
      }
    };

    return (
      <video
        ref={internalRef}
        src={src}
        className={`cinematic-video ${className}`}
        style={style}
        muted={muted}
        playsInline={playsInline}
        loop={loop}
        preload={effectivePreload}
        poster={poster}
        autoPlay={autoplay}
        onCanPlayThrough={(e) => {
          if (!e.currentTarget.paused) {
            handleFrameReady(e.currentTarget);
          }
        }}
        onPlaying={(e) => {
          handleFrameReady(e.currentTarget);
          onPlay?.();
        }}
        onPause={onPause}
        onTimeUpdate={(e) => {
          const vid = e.currentTarget;
          if (vid.currentTime > 0) {
            handleFrameReady(vid);
          }
          onTimeUpdate?.(vid.currentTime, vid.duration);
        }}
        onError={() => onError?.(new Error('Video failed to load'))}
        onEnded={onEnded}
        onPlay={onPlay}
        aria-hidden="true"
        {...({ 'webkit-playsinline': 'true' } as Record<string, string>)}
      >
        <track kind="captions" label="English" srcLang="en" default />
      </video>
    );
  }
);

CinematicVideoComponent.displayName = 'CinematicVideo';

export const CinematicVideo = CinematicVideoComponent;

export type { CinematicVideoProps as CinematicVideoPropsType };