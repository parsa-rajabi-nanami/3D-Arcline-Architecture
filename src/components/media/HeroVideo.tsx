import { useEffect, useRef, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const FADE_DURATION_MS = 700;
const PUBLIC_ASSET_BASE = import.meta.env.BASE_URL;

type HeroPhase = "loading" | "playing" | "ending" | "ended";
type HeroDevice = "desktop" | "mobile";

export type HeroVideoSources = {
  desktop: {
    webm: string;
    mp4: string;
  };
  mobile: {
    webm: string;
    mp4: string;
  };
};

export type HeroVideoPosters = {
  desktop: {
    start: string;
    end: string;
  };
  mobile: {
    start: string;
    end: string;
  };
};

const defaultSources: HeroVideoSources = {
  desktop: {
    webm: `${PUBLIC_ASSET_BASE}hero/hero-desktop.webm`,
    mp4: `${PUBLIC_ASSET_BASE}hero/hero-desktop.mp4`,
  },
  mobile: {
    webm: `${PUBLIC_ASSET_BASE}hero/hero-mobile.webm`,
    mp4: `${PUBLIC_ASSET_BASE}hero/hero-mobile.mp4`,
  },
};

const defaultPosters: HeroVideoPosters = {
  desktop: {
    start: `${PUBLIC_ASSET_BASE}hero/hero-poster-desktop-start.jpg`,
    end: `${PUBLIC_ASSET_BASE}hero/hero-poster-desktop-end.jpg`,
  },
  mobile: {
    start: `${PUBLIC_ASSET_BASE}hero/hero-poster-mobile-start.jpg`,
    end: `${PUBLIC_ASSET_BASE}hero/hero-poster-mobile-end.jpg`,
  },
};

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function getConnection() {
  if (typeof navigator === "undefined") return undefined;

  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function shouldUsePosterOnly(forceStatic: boolean) {
  if (forceStatic || typeof window === "undefined") return forceStatic;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = getConnection();

  return (
    reducedMotion ||
    connection?.saveData === true ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g"
  );
}

export type HeroVideoProps = {
  sources?: HeroVideoSources;
  posters?: HeroVideoPosters;
  forceStatic?: boolean;
  className?: string;
};

/** A responsive hero video with a start-poster fallback and a static end state. */
export function HeroVideo({
  sources = defaultSources,
  posters = defaultPosters,
  forceStatic = false,
  className = "",
}: HeroVideoProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webmSourceRef = useRef<HTMLSourceElement | null>(null);
  const mp4SourceRef = useRef<HTMLSourceElement | null>(null);
  const hasTriggered = useRef(false);
  const sourcesRef = useRef(sources);
  const forceStaticRef = useRef(forceStatic);
  const [device, setDevice] = useState<HeroDevice>("desktop");
  const [phase, setPhase] = useState<HeroPhase>("loading");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    const webmSource = webmSourceRef.current;
    const mp4Source = mp4SourceRef.current;

    if (!wrapper || !video || !webmSource || !mp4Source || hasTriggered.current) return;

    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    let endTimer: number | undefined;
    let playAttempted = false;
    let videoReleased = false;

    const releaseVideo = () => {
      if (videoReleased) return;

      videoReleased = true;
      video.pause();
      webmSource.removeAttribute("src");
      mp4Source.removeAttribute("src");
      video.load();
    };

    const fallBackToStartPoster = () => {
      if (cancelled) return;

      releaseVideo();
      setPhase("loading");
    };

    const playVideo = () => {
      if (cancelled || playAttempted) return;

      playAttempted = true;

      let playRequest: Promise<void>;

      try {
        playRequest = video.play();
      } catch {
        fallBackToStartPoster();
        return;
      }

      playRequest
        .then(() => {
          if (!cancelled) setPhase("playing");
        })
        .catch(() => {
          // Autoplay can be blocked. The start poster remains visible in this case.
          fallBackToStartPoster();
        });
    };

    const handleMediaReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) playVideo();
    };

    const handleEnded = () => {
      if (cancelled) return;

      setPhase("ending");
      endTimer = window.setTimeout(() => {
        if (cancelled) return;

        releaseVideo();
        setPhase("ended");
      }, FADE_DURATION_MS);
    };

    const handleError = () => {
      // Keep a working, visual fallback if either video format fails to decode.
      fallBackToStartPoster();
    };

    const startVideo = () => {
      if (cancelled || hasTriggered.current) return;

      hasTriggered.current = true;
      observer?.disconnect();

      const selectedDevice: HeroDevice = window.matchMedia(MOBILE_QUERY).matches
        ? "mobile"
        : "desktop";
      const selectedSources = sourcesRef.current[selectedDevice];

      setDevice(selectedDevice);

      if (shouldUsePosterOnly(forceStaticRef.current)) return;

      // Sources are assigned only after the viewport is known, so the other
      // device's video is never requested by this component.
      video.muted = true;
      webmSource.src = selectedSources.webm;
      mp4Source.src = selectedSources.mp4;
      video.load();

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) playVideo();
    };

    video.addEventListener("loadeddata", handleMediaReady);
    video.addEventListener("canplay", handleMediaReady);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    if (shouldUsePosterOnly(forceStaticRef.current)) {
      hasTriggered.current = true;
    } else if (typeof IntersectionObserver === "undefined") {
      startVideo();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) startVideo();
        },
        { threshold: 0.01 },
      );
      observer.observe(wrapper);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (endTimer !== undefined) window.clearTimeout(endTimer);
      video.removeEventListener("loadeddata", handleMediaReady);
      video.removeEventListener("canplay", handleMediaReady);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      releaseVideo();
    };
  }, []);

  const videoVisible = phase === "playing";
  const endPosterVisible = phase === "ending" || phase === "ended";

  return (
    <div ref={wrapperRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <picture
        className={`absolute inset-0 block transition-opacity duration-700 ease-out ${
          phase === "ended" ? "opacity-0" : "opacity-100"
        }`}
      >
        <source media={MOBILE_QUERY} srcSet={posters.mobile.start} />
        <img
          src={posters.desktop.start}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1088}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </picture>

      <picture
        className={`absolute inset-0 block transition-opacity duration-700 ease-out ${
          endPosterVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <source media={MOBILE_QUERY} srcSet={posters.mobile.end} />
        <img
          src={posters.desktop.end}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1088}
          fetchPriority="low"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </picture>

      <video
        ref={videoRef}
        poster={posters[device].start}
        muted
        playsInline
        autoPlay
        disablePictureInPicture
        controls={false}
        tabIndex={-1}
        aria-hidden="true"
        role="presentation"
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
          videoVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <source ref={webmSourceRef} type="video/webm" />
        <source ref={mp4SourceRef} type="video/mp4" />
      </video>
    </div>
  );
}
