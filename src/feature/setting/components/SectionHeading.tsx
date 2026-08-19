import type { ReactNode } from "react";

export default function SectionHeading({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <h1 className="text-[15px] font-bold tracking-[-0.02em] text-[#172033]">{title}</h1>
        {badge}
      </div>
      <p className="mt-1 text-[11px] text-[#718096]">{description}</p>
    </div>
  );
}
