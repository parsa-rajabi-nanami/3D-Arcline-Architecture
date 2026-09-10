import { useEffect, useRef, type RefObject } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { usePrefersReducedMotion } from "@/hooks/use-scroll-reveal";

import { transitionPoints } from "../landing-data";
import { SectionLabel } from "./SectionLabel";

const FRAME_COUNT = 45;
const FRAME_WIDTH = 624;
const FRAME_HEIGHT = 832;
const PRELOAD_RADIUS = 4;
const CACHE_RADIUS = 10;
const MAX_CONCURRENT_LOADS = 4;
const FRAME_PATH = `${import.meta.env.BASE_URL}palace-movie/ezgif-frame-`;
const FRAME_SOURCES = Array.from({ length: FRAME_COUNT }, (_, index) => {
  const frameNumber = String(index + 1).padStart(3, "0");
  return `${FRAME_PATH}${frameNumber}.jpg`;
});

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function useScrollDrivenImageSequence(
  trackRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  posterRef: RefObject<HTMLImageElement | null>,
  reducedMotion: boolean,
) {
  useEffect(() => {
    const sequenceTrack = trackRef.current;
    const sequenceCanvas = canvasRef.current;
    const posterElement = posterRef.current;
    if (!sequenceTrack || !sequenceCanvas) return;

    const trackElement = sequenceTrack as HTMLElement;
    const canvasElement = sequenceCanvas as HTMLCanvasElement;
    const sequenceContext = canvasElement.getContext("2d");
    if (!sequenceContext) return;
    const drawingContext: CanvasRenderingContext2D = sequenceContext;
    const loadedFrames = new Map<number, HTMLImageElement>();
    const loadingFrames = new Map<number, HTMLImageElement>();
    const queuedFrames = new Set<number>();
    let targetFrame = 0;
    let targetFrameIndex = 0;
    let previousTargetFrameIndex = 0;
    let currentFrame = 0;
    let lastValidFrame = 0;
    let renderedFrame = -1;
    let renderRaf = 0;
    let progressRaf = 0;
    let lastRenderTime = performance.now();
    let active = true;
    let initialized = false;

    function drawFrame(image: HTMLImageElement) {
      if (!image.naturalWidth || !canvasElement.width || !canvasElement.height) return false;

      const scale = Math.min(
        canvasElement.width / image.naturalWidth,
        canvasElement.height / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;

      drawingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
      drawingContext.drawImage(
        image,
        (canvasElement.width - width) / 2,
        (canvasElement.height - height) / 2,
        width,
        height,
      );
      return true;
    }

    function drawCurrentFrame(force = false) {
      const desiredFrame = clamp(Math.round(currentFrame), 0, FRAME_COUNT - 1);
      const exactImage = loadedFrames.get(desiredFrame);
      const fallbackImage = loadedFrames.get(lastValidFrame) ?? loadedFrames.get(0);
      const image = exactImage ?? fallbackImage;
      const frameToRender = exactImage ? desiredFrame : lastValidFrame;

      if (!image || (!force && frameToRender === renderedFrame)) return;
      if (!drawFrame(image)) return;

      renderedFrame = frameToRender;
      if (exactImage) lastValidFrame = desiredFrame;
    }

    function trimCache() {
      for (const frameIndex of loadedFrames.keys()) {
        if (
          Math.abs(frameIndex - targetFrameIndex) > CACHE_RADIUS &&
          frameIndex !== lastValidFrame &&
          frameIndex !== 0
        ) {
          loadedFrames.delete(frameIndex);
        }
      }
    }

    function pumpLoadingQueue() {
      while (loadingFrames.size < MAX_CONCURRENT_LOADS && queuedFrames.size > 0) {
        const direction = Math.sign(targetFrameIndex - previousTargetFrameIndex) || 1;
        const nextFrame = [...queuedFrames].sort(
          (first, second) =>
            Math.abs(first - targetFrameIndex) - Math.abs(second - targetFrameIndex) ||
            direction * (first - second),
        )[0];

        if (nextFrame === undefined) return;

        queuedFrames.delete(nextFrame);
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = nextFrame === targetFrameIndex ? "high" : "low";
        loadingFrames.set(nextFrame, image);
        image.onload = () => {
          loadingFrames.delete(nextFrame);
          if (!active) return;

          loadedFrames.set(nextFrame, image);
          trimCache();
          drawCurrentFrame();
          pumpLoadingQueue();
        };
        image.onerror = () => {
          loadingFrames.delete(nextFrame);
          pumpLoadingQueue();
        };
        image.src = FRAME_SOURCES[nextFrame] ?? "";
      }
    }

    function queueFrame(frameIndex: number) {
      const safeIndex = clamp(Math.round(frameIndex), 0, FRAME_COUNT - 1);
      if (
        loadedFrames.has(safeIndex) ||
        loadingFrames.has(safeIndex) ||
        queuedFrames.has(safeIndex)
      ) {
        return;
      }
      queuedFrames.add(safeIndex);
    }

    function queueFramesAroundTarget() {
      if (reducedMotion) {
        queueFrame(0);
        pumpLoadingQueue();
        return;
      }

      for (const frameIndex of queuedFrames) {
        if (Math.abs(frameIndex - targetFrameIndex) > PRELOAD_RADIUS + 3) {
          queuedFrames.delete(frameIndex);
        }
      }

      queueFrame(targetFrameIndex);
      for (let offset = 1; offset <= PRELOAD_RADIUS; offset += 1) {
        queueFrame(targetFrameIndex - offset);
        queueFrame(targetFrameIndex + offset);
      }
      pumpLoadingQueue();
      previousTargetFrameIndex = targetFrameIndex;
    }

    function resizeCanvas() {
      const bounds = canvasElement.getBoundingClientRect();
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * devicePixelRatio));
      const height = Math.max(1, Math.round(bounds.height * devicePixelRatio));

      if (canvasElement.width === width && canvasElement.height === height) return;

      canvasElement.width = width;
      canvasElement.height = height;
      drawingContext.imageSmoothingEnabled = true;
      drawingContext.imageSmoothingQuality = "high";
      drawCurrentFrame(true);
    }

    function updateProgress() {
      progressRaf = 0;

      if (reducedMotion) {
        targetFrame = 0;
        targetFrameIndex = 0;
      } else {
        const bounds = trackElement.getBoundingClientRect();
        const scrollTop = window.scrollY || window.pageYOffset;
        const trackTop = bounds.top + scrollTop;
        const scrollDistance = Math.max(bounds.height - window.innerHeight, 1);
        const progress = clamp((scrollTop - trackTop) / scrollDistance, 0, 1);

        targetFrame = progress * (FRAME_COUNT - 1);
        targetFrameIndex = Math.round(targetFrame);
      }

      queueFramesAroundTarget();
      scheduleRender();
    }

    function scheduleProgressUpdate() {
      if (progressRaf) return;
      progressRaf = requestAnimationFrame(updateProgress);
    }

    function render(now: number) {
      renderRaf = 0;
      const elapsed = Math.min(Math.max(now - lastRenderTime, 0), 64);
      lastRenderTime = now;

      if (reducedMotion) {
        currentFrame = 0;
      } else {
        const smoothing = 20;
        const amount = 1 - Math.exp((-smoothing * elapsed) / 1000);
        currentFrame += (targetFrame - currentFrame) * amount;
        if (Math.abs(targetFrame - currentFrame) < 0.01) currentFrame = targetFrame;
      }

      drawCurrentFrame();

      if (Math.abs(targetFrame - currentFrame) >= 0.01) {
        renderRaf = requestAnimationFrame(render);
      }
    }

    function scheduleRender() {
      if (renderRaf) return;
      renderRaf = requestAnimationFrame(render);
    }

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resizeCanvas);
    const handlePosterLoad = () => {
      if (!posterElement?.naturalWidth) return;
      loadedFrames.set(0, posterElement);
      if (initialized) {
        drawCurrentFrame(true);
        scheduleRender();
      }
    };

    const initialize = () => {
      if (initialized || !active) return;
      initialized = true;
      resizeObserver?.observe(canvasElement);
      window.addEventListener("resize", resizeCanvas, { passive: true });
      if (!reducedMotion) {
        window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
      }

      if (posterElement) {
        if (posterElement.complete && posterElement.naturalWidth) {
          handlePosterLoad();
        } else {
          posterElement.addEventListener("load", handlePosterLoad);
        }
      }

      resizeCanvas();
      updateProgress();
    };

    let visibilityObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "undefined") {
      initialize();
    } else {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            visibilityObserver?.disconnect();
            initialize();
          }
        },
        { rootMargin: "320px 0px" },
      );
      visibilityObserver.observe(trackElement);
    }

    return () => {
      active = false;
      visibilityObserver?.disconnect();
      resizeObserver?.disconnect();
      if (initialized) {
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("scroll", scheduleProgressUpdate);
      }
      posterElement?.removeEventListener("load", handlePosterLoad);

      if (renderRaf) cancelAnimationFrame(renderRaf);
      if (progressRaf) cancelAnimationFrame(progressRaf);

      for (const image of loadingFrames.values()) {
        image.onload = null;
        image.onerror = null;
        image.src = "";
      }
      loadingFrames.clear();
      queuedFrames.clear();
    };
  }, [canvasRef, posterRef, reducedMotion, trackRef]);
}

export function DrawingScene() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useScrollDrivenImageSequence(trackRef, canvasRef, posterRef, reducedMotion);

  return (
    <section className="relative overflow-x-clip bg-ink px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-start gap-14 lg:min-h-[180vh] lg:grid-cols-2 lg:gap-24">
        <div className="order-1 flex flex-col justify-center lg:order-1 lg:min-h-[180vh]">
          <Reveal className="w-full">
            <SectionLabel index="02">The transition</SectionLabel>
          </Reveal>
          <Reveal className="w-full" delay={120}>
            <h2 className="mt-8 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.03] text-background">
              A drawing becoming a building, in one continuous move.
            </h2>
          </Reveal>
          <Reveal className="w-full" delay={220}>
            <p className="mt-8 max-w-lg text-sm leading-loose text-stone-warm/80 md:text-base">
              This is the moment our clients hire us for: the point where a sketch stops being an
              idea and starts holding weight. Structure, stone and light resolve exactly as they
              were drawn.
            </p>
          </Reveal>
          <Reveal className="w-full" delay={300}>
            <ul className="mt-10 space-y-4 border-t border-stone-warm/20 pt-8">
              {transitionPoints.map((point) => (
                <li key={point} className="flex items-baseline gap-4 text-sm text-stone-warm/85">
                  <span
                    className="h-px w-6 shrink-0 translate-y-[-0.3rem] bg-accent"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div ref={trackRef} className="relative order-2 min-h-[160svh] lg:order-2 lg:min-h-[180vh]">
          <div className="sticky top-24 flex h-[calc(100svh-6rem)] items-center justify-center lg:h-[calc(100vh-6rem)]">
            <div className="relative mx-auto aspect-[624/832] max-h-full w-full max-w-[420px] overflow-hidden bg-charcoal-soft panel-shadow">
              <img
                ref={posterRef}
                src={FRAME_SOURCES[0]}
                alt=""
                aria-hidden="true"
                width={FRAME_WIDTH}
                height={FRAME_HEIGHT}
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain"
              />
              <canvas
                ref={canvasRef}
                width={FRAME_WIDTH}
                height={FRAME_HEIGHT}
                role="img"
                aria-label="Scroll-controlled sequence showing a house being built from drawing to finished structure"
                className="relative z-10 block h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
