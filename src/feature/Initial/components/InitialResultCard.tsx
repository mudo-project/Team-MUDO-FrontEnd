export default function InitialResultCard({ label, value }: { label: string; value: number }) {
    return (
        <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-5 py-5">
            <p className="text-[12px] text-[#64748B]">{label}</p>
            <strong className="mt-3 block text-[26px] text-[#0F172A]">{value}<span className="ml-1 text-[12px] font-normal text-[#64748B]">건</span></strong>
        </article>
    );
}
