import { Balancer } from "react-wrap-balancer";

import { Reveal } from "@/components/motion/Reveal";
import { ArtCollage } from "@/components/ui/hero-04-utils/art-collage";
import { cn } from "@/lib/utils";

import { landingAssets, studioStats } from "../landing-data";
import { SectionLabel } from "./SectionLabel";

const variantStyles = {
  standard: {
    section: "py-20 sm:py-28",
    title: "text-3xl sm:text-4xl md:text-5xl",
    description: "max-w-md text-sm sm:text-base",
    header: "gap-5",
    grid: "gap-12 lg:gap-16",
  },
} as const;

export function DesignSection() {
  const vs = variantStyles.standard;

  const backgroundElement = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 aspect-[2/3] overflow-hidden opacity-20 blur-3xl sm:opacity-25 md:aspect-square lg:aspect-video"
    >
      <img
        src={landingAssets.designSectionOne}
        alt=""
        width={730}
        height={956}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </div>
  );

  const titleElement = (
    <h2
      className={cn(
        "text-foreground font-display font-normal tracking-tight text-balance",
        vs.title,
      )}
    >
      <Balancer>Drawing is how we think, not how we sell.</Balancer>
    </h2>
  );

  const descriptionElement = (
    <p className={cn("text-muted-foreground leading-loose", vs.description)}>
      <Balancer>
        Every ARCLINE project begins in graphite. We test proportion, threshold and shadow by hand
        until the plan feels inevitable — then translate it into documents precise enough to build
        from without compromise.
      </Balancer>
    </p>
  );

  const statsElement = (
    <dl className="grid w-full grid-cols-2 gap-8 border-t border-border pt-8">
      {studioStats.map(([value, label]) => (
        <div key={label}>
          <dt className="font-display text-3xl md:text-4xl">{value}</dt>
          <dd className="label-caps mt-2">{label}</dd>
        </div>
      ))}
    </dl>
  );

  const mediaElement = (
    <ArtCollage
      primaryImage={landingAssets.designSectionOne}
      secondaryImage={landingAssets.designSectionTwo}
      primaryAlt="Watercolour architectural study of a brick and concrete residence"
      secondaryAlt="Architectural study of a modern glass house surrounded by planting"
    />
  );

  return (
    <section
      id="design"
      className="bg-background relative isolate w-full overflow-hidden stone-surface"
    >
      {backgroundElement}

      <div
        className={cn(
          "relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center px-6",
          vs.section,
          vs.grid,
        )}
      >
        <Reveal className={cn("flex flex-col items-start", vs.header)}>
          <SectionLabel index="01">Design</SectionLabel>
          {titleElement}
          {descriptionElement}
          {statsElement}
        </Reveal>

        <Reveal delay={180} className="w-full">
          {mediaElement}
        </Reveal>
      </div>
    </section>
  );
}
