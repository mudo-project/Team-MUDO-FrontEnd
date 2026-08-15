import { Progress } from "@/components/ui/progress";
import { PROGRESS_CLASS_NAME } from "../constants";
import { ApiCallCategory, ApiCallMetricData } from "../type";

const API_CALL_LABELS: Record<ApiCallCategory, string> = {
    INITIAL_DATA_READ: "초기 데이터 조회",
    ACCOUNT_ISSUANCE: "계정 발급",
    CHECK_IN: "출근 체크",
    ATTENDANCE_EXPORT: "출결 내보내기",
    NOTICE_CREATE: "공지 생성",
    WORKSPACE_TASK_CREATE: "업무 생성",
    WORKSPACE_TASK_STATUS_CHANGE: "업무 상태 변경",
    APPROVAL_SUBMISSION: "결재 상신",
    SETTLEMENT_SUBMISSION: "정산 제출",
    CALENDAR_CREATE: "일정 생성",
    MEMO_CREATE: "메모 생성",
};

export default function ApiCallDistribution({ metrics }: { metrics: ApiCallMetricData[] }) {
    const total = metrics.reduce((sum, metric) => sum + metric.count, 0);
    const maximum = Math.max(...metrics.map((metric) => metric.count), 1);

    return (
        <section className="mt-3 rounded-[12px] border border-[#D7E8DB] bg-white px-[22px] py-5">
            <div className="flex items-start">
                <div>
                    <h2 className="text-[12px] font-semibold text-[#0F172A]">전체 API 호출 분포</h2>
                    <p className="mt-1 text-[10px] text-[#94A3B8] md:text-[12px]">scope와 무관하게 전체 학원 기준으로 집계됩니다.</p>
                </div>
                <span className="ml-auto text-[10px] text-[#64748B] md:text-[12px]">총 {total.toLocaleString()}건</span>
            </div>

            <div className="mt-3 space-y-[7px]">
                {metrics.map((metric) => (
                    <div className="grid grid-cols-12 items-center gap-2" key={metric.category}>
                        <span className="col-span-1 text-[10px] text-[#64748B] md:text-[12px]">{API_CALL_LABELS[metric.category]}</span>
                        <Progress className={`${PROGRESS_CLASS_NAME} col-span-10`} value={(metric.count / maximum) * 100} />
                        <span className="col-span-1 text-right text-[10px] font-medium text-[#0F172A] md:text-[12px]">{metric.count.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
