import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createElement,
  useRef,
  type ClassAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "figure" | "header";
};

export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            delay: delay / 1000,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(element, { clearProps: "all" });
      });

      return () => media.revert();
    },
    { scope: ref },
  );

  const props: HTMLAttributes<HTMLElement> & ClassAttributes<HTMLElement> = {
    ref,
    className: `reveal ${className}`.trim(),
  };

  return createElement(as, props, children);
}
