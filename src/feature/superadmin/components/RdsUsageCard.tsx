import { Progress } from "@/components/ui/progress";
import { PROGRESS_CLASS_NAME } from "../constants";

export default function RdsUsageCard({ value }: { value: number }) {
    return (
        <article className="rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
            <p className="text-[11px] leading-[16.5px] font-medium tracking-[0.44px] text-[#64748B] md:text-[12px]">RDS 연결 사용률</p>
            <p className="mt-2.5 text-[26px] leading-[29px] font-bold text-[#0F172A]">
                {value.toFixed(1)}<span className="text-[14px] font-normal text-[#64748B]">%</span>
            </p>
            <div className="mt-2 flex items-center gap-2">
                <Progress className={`${PROGRESS_CLASS_NAME} w-full`} value={value} />
                <span className="text-[10px] font-medium text-[#2C8D50] md:text-[12px]">{value.toFixed(1)}%</span>
            </div>
        </article>
    );
}
