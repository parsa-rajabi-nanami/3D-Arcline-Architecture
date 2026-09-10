import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";

type ArtCollageProps = Readonly<{
  primaryImage: string;
  secondaryImage: string;
  primaryAlt?: string;
  secondaryAlt?: string;
}>;

type PointerStrength = Readonly<{
  x: number;
  y: number;
  rotate: number;
}>;

type InteractiveImageProps = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectClassName: string;
  pointerStrength: PointerStrength;
  motionDisabled: boolean;
}>;

const imageFrame =
  "overflow-hidden rounded-[var(--radius-xl)] bg-card ring-1 ring-inset ring-foreground/10 lift-shadow";

const primaryPointerStrength: PointerStrength = { x: 4, y: 3, rotate: 0.35 };
const secondaryPointerStrength: PointerStrength = { x: 7, y: 5, rotate: 0.55 };

function InteractiveImage({
  src,
  alt,
  width,
  height,
  aspectClassName,
  pointerStrength,
  motionDisabled,
}: InteractiveImageProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointerRotate = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 160, damping: 22, mass: 0.7 });
  const y = useSpring(pointerY, { stiffness: 160, damping: 22, mass: 0.7 });
  const rotate = useSpring(pointerRotate, { stiffness: 150, damping: 24, mass: 0.7 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      motionDisabled ||
      event.pointerType !== "mouse" ||
      (typeof window !== "undefined" &&
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerX.set(normalizedX * pointerStrength.x);
    pointerY.set(normalizedY * pointerStrength.y);
    pointerRotate.set(normalizedX * pointerStrength.rotate);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
    pointerRotate.set(0);
  }

  return (
    <motion.div className="will-change-transform">
      <motion.div
        className="will-change-transform"
        style={{ x, y, rotate }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className={imageFrame}>
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={`${aspectClassName} w-full object-cover`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ArtCollage({
  primaryImage,
  secondaryImage,
  primaryAlt = "",
  secondaryAlt = "",
}: ArtCollageProps) {
  const reduce = useReducedMotion();
  const motionDisabled = reduce === true;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <figure className="relative z-0 w-[86%] max-w-[30rem]">
        <InteractiveImage
          src={primaryImage}
          alt={primaryAlt}
          width={730}
          height={956}
          aspectClassName="aspect-[730/956]"
          pointerStrength={primaryPointerStrength}
          motionDisabled={motionDisabled}
        />
      </figure>

      <figure className="absolute bottom-[3%] right-0 z-10 w-[44%] max-w-[25rem] rotate-[2deg] lg:w-[46%]">
        <InteractiveImage
          src={secondaryImage}
          alt={secondaryAlt}
          width={730}
          height={730}
          aspectClassName="aspect-square"
          pointerStrength={secondaryPointerStrength}
          motionDisabled={motionDisabled}
        />
      </figure>
    </div>
  );
}
