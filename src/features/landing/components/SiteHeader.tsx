import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { navLinks } from "../landing-data";

gsap.registerPlugin(useGSAP);

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useGSAP(
    () => {
      const nav = mobileNavRef.current;
      if (!nav) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (menuOpen) {
          gsap.fromTo(
            nav,
            { autoAlpha: 0, y: -12, height: 0 },
            {
              autoAlpha: 1,
              y: 0,
              height: "auto",
              duration: 0.5,
              ease: "power3.out",
              overwrite: true,
            },
          );
        } else {
          gsap.to(nav, {
            autoAlpha: 0,
            y: -12,
            height: 0,
            duration: 0.35,
            ease: "power2.inOut",
            overwrite: true,
          });
        }
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(nav, { autoAlpha: menuOpen ? 1 : 0, y: 0, height: menuOpen ? "auto" : 0 });
      });

      return () => media.revert();
    },
    { scope: headerRef, dependencies: [menuOpen], revertOnUpdate: true },
  );

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-12">
        <a
          href="#top"
          onClick={closeMenu}
          className="font-display text-xl tracking-[0.28em] text-primary-foreground mix-blend-difference focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm"
        >
          ARCLINE
        </a>
        <nav aria-label="Primary navigation" className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline text-xs uppercase tracking-[0.24em] text-primary-foreground mix-blend-difference focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          onClick={closeMenu}
          className="hidden border border-current px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.24em] text-primary-foreground mix-blend-difference transition-opacity duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm md:inline-flex"
        >
          Start a project
        </a>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center border border-primary-foreground/60 text-primary-foreground mix-blend-difference transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm md:hidden"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav
        ref={mobileNavRef}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`mx-4 overflow-hidden border border-stone-warm/30 bg-ink/95 md:hidden ${menuOpen ? "pointer-events-auto h-auto opacity-100" : "pointer-events-none h-0 opacity-0"}`}
      >
        <div className="flex flex-col p-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="border-b border-stone-warm/15 py-4 text-xs uppercase tracking-[0.24em] text-stone-warm transition-colors last:border-b-0 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-warm"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
