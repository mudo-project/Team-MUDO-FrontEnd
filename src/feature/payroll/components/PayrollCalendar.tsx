import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface PayrollCalendarProps {
    label: string;
}

export default function PayrollCalendar({ label }: PayrollCalendarProps) {
    return (
        <div className="flex items-center gap-1">
            <button
                aria-label="이전 달"
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]"
                type="button"
            >
                <ChevronLeft className="size-4" />
            </button>
            <button
                aria-haspopup="dialog"
                className="flex h-9 min-w-[128px] items-center justify-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] font-semibold"
                type="button"
            >
                {label}
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
