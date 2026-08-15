import { Progress } from "@/components/ui/progress";
import { ACADEMY_API_METRICS, ALL_API_METRICS, PROGRESS_CLASS_NAME } from "../constants";
import { DashboardScope } from "../type";

export default function ApiCallDistribution({ scope }: { scope: DashboardScope }) {
    const metrics = scope === "ALL" ? ALL_API_METRICS : ACADEMY_API_METRICS;
    const total = scope === "ALL" ? "25,040" : "21,614";
    const maximum = Math.max(...metrics.map(([, count]) => count));

    return (
        <section className="mt-3 rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
            <div className="flex items-start">
                <div>
                    <h2 className="text-[12px] font-semibold text-[#0F172A]">전체 API 호출 분포</h2>
                    <p className="mt-1 text-[10px] text-[#94A3B8] md:text-[12px]">scope와 무관하게 전체 학원 기준으로 집계됩니다.</p>
                </div>
                <span className="ml-auto text-[10px] text-[#64748B] md:text-[12px]">총 {total}건</span>
            </div>

            <div className="mt-3 space-y-[7px]">
                {metrics.map(([label, count]) => (
                    <div className="grid grid-cols-12 items-center gap-2" key={label}>
                        <span className="col-span-1 text-[10px] text-[#64748B] md:text-[12px]">{label}</span>
                        <Progress className={`${PROGRESS_CLASS_NAME} col-span-10`} value={(count / maximum) * 100} />
                        <span className="col-span-1 text-right text-[10px] font-medium text-[#0F172A] md:text-[12px]">{count.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
