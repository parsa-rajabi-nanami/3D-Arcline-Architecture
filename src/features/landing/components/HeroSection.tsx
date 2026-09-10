import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { HeroVideo } from "@/components/media/HeroVideo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-hero-media]", {
          yPercent: 12,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to("[data-hero-grid]", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to("[data-hero-content]", {
          yPercent: -6,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "70% top",
            scrub: 0.8,
          },
        });
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-media], [data-hero-grid], [data-hero-content]", {
          clearProps: "all",
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-[100svh] min-h-[100svh] items-end overflow-hidden bg-ink"
    >
      <div data-hero-media className="absolute inset-0 will-change-transform">
        <HeroVideo />
      </div>
      <div className="hero-veil absolute inset-0" aria-hidden="true" />
      <div
        data-hero-grid
        className="pointer-events-none absolute inset-0 opacity-25 will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute left-[18%] top-0 h-full w-px bg-stone-warm/50" />
        <div className="absolute left-[52%] top-0 h-full w-px bg-stone-warm/40" />
        <div className="absolute left-[81%] top-0 h-full w-px bg-stone-warm/30" />
        <div className="absolute inset-x-0 top-[38%] h-px bg-stone-warm/30" />
      </div>

      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-12 md:pb-28"
      >
        <Reveal>
          <p className="label-caps text-stone-warm/80">
            Architecture · Construction · Design-Build
          </p>
        </Reveal>
        <Reveal delay={140}>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.95] text-background">
            From the first drawn line to the finished structure.
          </h1>
        </Reveal>
        <Reveal delay={280}>
          <div className="mt-10 flex flex-col gap-6 border-t border-stone-warm/25 pt-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-stone-warm/85 md:text-base">
              ARCLINE designs and builds private residences, cultural spaces and considered
              renovations — one studio holding drawing, detail and delivery.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="bg-background px-7 py-4 text-[0.6875rem] uppercase tracking-[0.24em] text-foreground transition-colors duration-300 hover:bg-stone-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm"
              >
                Request a consultation
              </a>
              <a
                href="#projects"
                className="link-underline text-[0.6875rem] uppercase tracking-[0.24em] text-stone-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm"
              >
                View selected work
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
