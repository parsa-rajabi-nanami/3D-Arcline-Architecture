import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { usePrefersReducedMotion } from "@/hooks/use-scroll-reveal";

import { landingAssets, processSteps } from "../landing-data";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ProcessImage() {
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const frame = frameRef.current;
      const image = imageRef.current;
      if (!frame || !image || !contextSafe) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          frame,
          { autoAlpha: 0, y: 24, scale: 1.045 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: frame,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      media.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          gsap.set(image, {
            scale: 1.08,
            transformOrigin: "center center",
            transformPerspective: 900,
          });

          const xTo = gsap.quickTo(image, "x", { duration: 0.38, ease: "power3.out" });
          const yTo = gsap.quickTo(image, "y", { duration: 0.38, ease: "power3.out" });
          const rotateXTo = gsap.quickTo(image, "rotationX", {
            duration: 0.38,
            ease: "power3.out",
          });
          const rotateYTo = gsap.quickTo(image, "rotationY", {
            duration: 0.38,
            ease: "power3.out",
          });

          const handlePointerMove = contextSafe((event: Event) => {
            const pointerEvent = event as PointerEvent;
            const bounds = frame.getBoundingClientRect();
            const x = (pointerEvent.clientX - bounds.left) / bounds.width - 0.5;
            const y = (pointerEvent.clientY - bounds.top) / bounds.height - 0.5;

            xTo(x * 68);
            yTo(y * 52);
            rotateXTo(y * -14);
            rotateYTo(x * 18);
          });
          const resetPointer = contextSafe(() => {
            xTo(0);
            yTo(0);
            rotateXTo(0);
            rotateYTo(0);
          });

          frame.addEventListener("pointermove", handlePointerMove);
          frame.addEventListener("pointerleave", resetPointer);

          return () => {
            frame.removeEventListener("pointermove", handlePointerMove);
            frame.removeEventListener("pointerleave", resetPointer);
          };
        },
      );

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(frame, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope: frameRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div ref={frameRef} className="relative w-full overflow-hidden">
      <img
        ref={imageRef}
        src={landingAssets.processImage}
        alt="Raw concrete structure under construction with scaffolding"
        width={1408}
        height={1008}
        loading="lazy"
        decoding="async"
        className="w-full transform-gpu object-cover panel-shadow will-change-transform"
      />
    </div>
  );
}

export function ProcessSection() {
  return (
    <section id="process" className="bg-background px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="03">Construction</SectionLabel>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-8 font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02]">
                Built by the people who drew it.
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-8 max-w-lg text-sm leading-loose text-muted-foreground md:text-base">
                Design-build removes the gap where quality usually leaks away. Our site teams work
                to our own drawings, on fixed programmes, with weekly reporting you can read without
                a translator.
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7" delay={200} as="figure">
            <ProcessImage />
          </Reveal>
        </div>

        <ol className="mt-20 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.n} delay={index * 140} className="bg-background p-8 md:p-10">
              <span className="label-caps text-accent">{step.n}</span>
              <h3 className="mt-6 font-display text-2xl md:text-3xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-loose text-muted-foreground">{step.copy}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
