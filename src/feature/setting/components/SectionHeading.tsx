export default function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-[15px] font-bold tracking-[-0.02em] text-[#172033]">{title}</h1>
      <p className="mt-1 text-[11px] text-[#718096]">{description}</p>
    </div>
  );
}
