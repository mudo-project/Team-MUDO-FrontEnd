interface MetricCardProps {
    label: string;
    unit: string;
    value: string;
}

export default function MetricCard({ label, unit, value }: MetricCardProps) {
    return (
        <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
            <p className="text-[11px] leading-[16.5px] font-medium tracking-[0.44px] text-[#64748B] md:text-[12px]">{label}</p>
            <p className="mt-2.5 text-[26px] leading-[29px] font-bold text-[#0F172A]">
                {value} <span className="text-[14px] font-normal text-[#64748B]">{unit}</span>
            </p>
        </article>
    );
}
