import type { ReactNode } from "react";

type SettingCardProps = {
  children: ReactNode;
  className?: string;
};

export default function SettingCard({
  children,
  className = "",
}: SettingCardProps) {
  return (
    <section
      className={`rounded-xl border border-[#DCE9DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] lg:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
