export default function AttendanceCard({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <section aria-label={label} className="rounded-xl border border-[#DCE9DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
      {children}
    </section>
  );
}
