export function SiteFooter() {
  return (
    <footer className="bg-charcoal px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <span className="font-display text-lg tracking-[0.28em] text-background">ARCLINE</span>
        <p className="text-xs text-stone-warm/60">
          Architecture · Construction · Renovation · Design-Build
        </p>
        <p className="text-xs text-stone-warm/45">© 2026 ARCLINE Studio</p>
      </div>
    </footer>
  );
}
