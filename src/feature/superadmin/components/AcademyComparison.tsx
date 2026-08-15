import SectionError from "./SectionError";
import { API_LABELS } from "../constants";
import { AcademyApiCallFrequencyData, ApiCallCategory } from "../type";

interface AcademyComparisonProps {
    errorMessage: string;
    rows: AcademyApiCallFrequencyData[];
}

const API_CATEGORIES: ApiCallCategory[] = [
    "INITIAL_DATA_READ",
    "ACCOUNT_ISSUANCE",
    "CHECK_IN",
    "ATTENDANCE_EXPORT",
    "NOTICE_CREATE",
    "WORKSPACE_TASK_CREATE",
    "WORKSPACE_TASK_STATUS_CHANGE",
    "APPROVAL_SUBMISSION",
    "SETTLEMENT_SUBMISSION",
    "CALENDAR_CREATE",
    "MEMO_CREATE",
];

export default function AcademyComparison({ errorMessage, rows }: AcademyComparisonProps) {

    return (
        <section className="mt-3 overflow-hidden rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
            <h2 className="text-[12px] font-semibold text-[#0F172A]">학원별 API 호출 비교</h2>
            <p className="mt-1 text-[10px] text-[#94A3B8] md:text-[12px]">선택한 기간의 주요 업무 API 호출 횟수입니다.</p>

            {errorMessage && <div className="mt-4"><SectionError message={errorMessage} /></div>}

            {!errorMessage && <div className="mt-4 overflow-x-auto">
                <div className="min-w-[650px]">
                    <div className="grid grid-cols-12 border-b border-[#E8F0EB] pb-2 text-center text-[10px] text-[#94A3B8] md:text-[12px]">
                        <span className="text-left">학원 코드</span>
                        {API_LABELS.map((label) => <span key={label}>{label}</span>)}
                    </div>
                    {rows.map((row) => (
                        <div className="grid grid-cols-12 items-center border-b border-[#F0F3F1] py-2 text-center text-[10px] text-[#64748B] last:border-b-0 md:text-[12px]" key={row.academyCode}>
                            <span className="justify-self-start rounded-[4px] bg-[#EAF4ED] px-1.5 py-1 text-[10px] font-medium text-[#2C8D50] md:text-[12px]">{row.academyCode}</span>
                            {API_CATEGORIES.map((category) => (
                                <span key={`${row.academyCode}-${category}`}>
                                    {(row.apiCallMetrics.find((metric) => metric.category === category)?.count ?? 0).toLocaleString()}
                                </span>
                            ))}
                        </div>
                    ))}
                    {rows.length === 0 && (
                        <p className="py-5 text-center text-[12px] text-[#94A3B8]">조회된 학원이 없습니다.</p>
                    )}
                </div>
            </div>}
        </section>
    );
}
