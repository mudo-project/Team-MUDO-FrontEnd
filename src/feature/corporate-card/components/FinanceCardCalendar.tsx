import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function FinanceCardCalendar() {
    return (
        <div className="flex items-center gap-1.5">
            <button
                aria-label="이전 달"
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]"
                type="button"
            >
                <ChevronLeft className="size-4" />
            </button>
            <button
                className="flex h-9 items-center gap-1 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-semibold"
                type="button"
            >
                2026년 8월
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
            </button>
            <button
                aria-label="다음 달"
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]"
                type="button"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    );
}
