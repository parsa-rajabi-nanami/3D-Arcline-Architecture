import type { ReactNode } from "react";

type SectionLabelProps = {
  index: string;
  children: ReactNode;
};

export function SectionLabel({ index, children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="label-caps text-accent">{index}</span>
      <span className="h-px w-10 bg-border" aria-hidden="true" />
      <span className="label-caps">{children}</span>
    </div>
  );
}
