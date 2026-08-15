import { ALL_ACADEMY_ROWS, API_LABELS, SELECTED_ACADEMY_ROW } from "../constants";
import { DashboardScope } from "../type";

interface AcademyComparisonProps {
    academyCode?: string;
    scope: DashboardScope;
}

export default function AcademyComparison({ academyCode, scope }: AcademyComparisonProps) {
    const rows = scope === "ALL"
        ? ALL_ACADEMY_ROWS
        : [{ ...SELECTED_ACADEMY_ROW, academyCode: academyCode ?? SELECTED_ACADEMY_ROW.academyCode }];

    return (
        <section className="mt-3 overflow-hidden rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
            <h2 className="text-[12px] font-semibold text-[#0F172A]">학원별 API 호출 비교</h2>
            <p className="mt-1 text-[10px] text-[#94A3B8] md:text-[12px]">열 헤더 클릭으로 정렬</p>

            <div className="mt-4 overflow-x-auto">
                <div className="min-w-[650px]">
                    <div className="grid grid-cols-12 border-b border-[#E8F0EB] pb-2 text-center text-[10px] text-[#94A3B8] md:text-[12px]">
                        <span className="text-left">학원 코드</span>
                        {API_LABELS.map((label) => <span key={label}>{label}</span>)}
                    </div>
                    {rows.map((row) => (
                        <div className="grid grid-cols-12 items-center border-b border-[#F0F3F1] py-2 text-center text-[10px] text-[#64748B] last:border-b-0 md:text-[12px]" key={row.academyCode}>
                            <span className="justify-self-start rounded-[4px] bg-[#EAF4ED] px-1.5 py-1 text-[10px] font-medium text-[#2C8D50] md:text-[12px]">{row.academyCode}</span>
                            {row.values.map((value, index) => <span key={`${row.academyCode}-${API_LABELS[index]}`}>{value.toLocaleString()}</span>)}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
