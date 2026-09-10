import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";

import { projects } from "../landing-data";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Project = (typeof projects)[number];

const fanSlots = [
  { width: "md:w-[38%]", layout: "md:-mr-8 md:z-10", rotate: -6, x: 48, y: 24 },
  { width: "md:w-[42%]", layout: "md:z-20", rotate: 0, x: 0, y: -8 },
  { width: "md:w-[38%]", layout: "md:-ml-8 md:z-10", rotate: 6, x: -48, y: 24 },
] as const;

function ProjectFan() {
  const fanRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const fan = fanRef.current;
      if (!fan || !contextSafe) return;

      const cards = Array.from(fan.querySelectorAll<HTMLElement>("[data-project-card]"));
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.fromTo(
          cards,
          {
            autoAlpha: 0,
            x: (index) => fanSlots[index]?.x ?? 0,
            y: (index) => (fanSlots[index]?.y ?? 0) + 20,
            rotate: (index) => fanSlots[index]?.rotate ?? 0,
          },
          {
            autoAlpha: 1,
            x: 0,
            y: (index) => fanSlots[index]?.y ?? 0,
            rotate: (index) => fanSlots[index]?.rotate ?? 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: fan,
              start: "top 82%",
              once: true,
            },
          },
        );

        const cleanups = cards.map((card, index) => {
          const slot = fanSlots[index] ?? fanSlots[1];
          let pointerBounds: DOMRect | null = null;
          gsap.set(card, {
            transformOrigin: "center center",
            transformPerspective: 900,
          });

          const xTo = gsap.quickTo(card, "x", { duration: 0.38, ease: "power3.out" });
          const yTo = gsap.quickTo(card, "y", { duration: 0.38, ease: "power3.out" });
          const rotateXTo = gsap.quickTo(card, "rotationX", {
            duration: 0.38,
            ease: "power3.out",
          });
          const rotateYTo = gsap.quickTo(card, "rotationY", {
            duration: 0.38,
            ease: "power3.out",
          });

          const handlePointerEnter = contextSafe(() => {
            pointerBounds = card.getBoundingClientRect();
          });
          const handlePointerMove = contextSafe((event: Event) => {
            const pointerEvent = event as PointerEvent;
            const bounds = pointerBounds ?? card.getBoundingClientRect();
            const x = (pointerEvent.clientX - bounds.left) / bounds.width - 0.5;
            const y = (pointerEvent.clientY - bounds.top) / bounds.height - 0.5;

            xTo(x * 18);
            yTo(slot.y + y * 14);
            rotateXTo(y * -7);
            rotateYTo(x * 8);
          });
          const resetPointer = contextSafe(() => {
            pointerBounds = null;
            xTo(0);
            yTo(slot.y);
            rotateXTo(0);
            rotateYTo(0);
          });

          card.addEventListener("pointerenter", handlePointerEnter);
          card.addEventListener("pointermove", handlePointerMove);
          card.addEventListener("pointerleave", resetPointer);

          return () => {
            card.removeEventListener("pointerenter", handlePointerEnter);
            card.removeEventListener("pointermove", handlePointerMove);
            card.removeEventListener("pointerleave", resetPointer);
          };
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      });

      media.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: fan,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope: fanRef },
  );

  return (
    <div
      ref={fanRef}
      className="relative flex w-full flex-col items-center gap-5 md:min-h-[28rem] md:flex-row md:items-center md:justify-center md:gap-0"
    >
      {projects.map((project, index) => {
        const slot = fanSlots[index] ?? fanSlots[1];

        return (
          <figure
            key={project.name}
            data-project-card
            className={`group relative w-[min(78vw,18rem)] shrink-0 overflow-hidden rounded-[1.25rem] border border-foreground/10 bg-card shadow-[0_24px_60px_-28px_oklch(0.16_0.005_60_/_0.55)] outline outline-1 outline-black/5 will-change-transform transition-[border-color,box-shadow] duration-300 hover:z-30 hover:border-accent/60 hover:shadow-[0_30px_70px_-26px_oklch(0.16_0.005_60_/_0.65)] md:max-w-[18rem] ${slot.width} ${slot.layout}`}
          >
            <img
              src={project.image}
              alt={project.alt}
              width={project.width}
              height={project.height}
              loading="lazy"
              decoding="async"
              className="aspect-[730/973] w-full object-cover transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-[1.04]"
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-white/25"
              aria-hidden="true"
            />
          </figure>
        );
      })}
    </div>
  );
}

function ProjectDetails({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 120} className="border-t border-border pt-6">
      <span className="label-caps">{project.year}</span>
      <h3 className="mt-4 font-display text-3xl md:text-4xl">{project.name}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{project.place}</p>
      <p className="mt-6 text-sm leading-loose text-muted-foreground">{project.scope}</p>
      <a
        href="#contact"
        className="link-underline mt-6 inline-block text-[0.6875rem] uppercase tracking-[0.24em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Discuss a similar project
      </a>
    </Reveal>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="stone-surface px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <SectionLabel index="04">Featured projects</SectionLabel>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-8 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02]">
            Three houses of the same discipline, told in stone, light and line.
          </h2>
        </Reveal>
        <div className="mt-16 md:mt-20">
          <ProjectFan />
        </div>
        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <ProjectDetails key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
