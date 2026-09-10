import { Reveal } from "@/components/motion/Reveal";

export function CtaSection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink px-6 py-28 md:px-12 md:py-40">
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-full w-px bg-stone-warm/40" />
        <div className="absolute left-2/3 top-0 h-full w-px bg-stone-warm/30" />
      </div>
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="label-caps text-accent">Start a project</p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-8 max-w-4xl font-display text-[clamp(2.25rem,6vw,5rem)] leading-[0.98] text-background">
            Tell us about the site. We will tell you what it can become.
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-14 flex flex-col gap-8 border-t border-stone-warm/25 pt-10 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-sm leading-loose text-stone-warm/80">
              Consultations begin with a site visit and an honest view on budget, programme and
              planning. New commissions for 2026 are open.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="mailto:studio@arcline.example"
                className="bg-background px-8 py-4 text-[0.6875rem] uppercase tracking-[0.24em] text-foreground transition-colors duration-300 hover:bg-stone-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm"
              >
                Email the studio
              </a>
              <a
                href="tel:+441234567890"
                className="link-underline text-[0.6875rem] uppercase tracking-[0.24em] text-stone-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm"
              >
                +44 1234 567 890
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
