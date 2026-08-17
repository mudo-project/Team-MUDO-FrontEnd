import { LECTURE_GRADE_LABEL } from "@/feature/lecture/constants";
import { AttendanceStatus, LectureAttendanceEntryData } from "@/feature/rollbook/type";

export interface RollbookDraft {
    status: AttendanceStatus | null;
    note: string;
}

interface RollbookItemProps {
    draft?: RollbookDraft;
    entry: LectureAttendanceEntryData;
    onChange: (change: Partial<RollbookDraft>) => void;
}

const ATTENDANCE_OPTIONS: { label: string; value: AttendanceStatus }[] = [
    { label: "출석", value: "PRESENT" },
    { label: "결석", value: "ABSENT" },
    { label: "지각", value: "LATE" },
    { label: "온라인", value: "ONLINE" },
    { label: "기타", value: "ETC" },
];

export default function RollbookItem({ draft, entry, onChange }: RollbookItemProps) {
    const status = draft ? draft.status ?? "" : entry.status ?? "";
    const note = draft ? draft.note : entry.note ?? "";

    return (
        <div className="grid min-h-16 sm:grid-cols-12 grid-cols-11 items-center gap-3 border-b border-[#F7F8F9] px-6 py-[13px] last:border-b-0">
            <div className="col-span-3">
                <strong className="block text-[13px] leading-[19.5px] font-medium text-[#0F172A]">{entry.studentName}</strong>
                <span className="mt-px block text-[11px] leading-[16.5px] text-[#94A3B8]">{entry.parentPhone}</span>
            </div>
            <p className="sm:block hidden col-span-1 text-[12px] leading-[18px] text-[#64748B]">{LECTURE_GRADE_LABEL[entry.grade]}</p>
            <select
                aria-label={`${entry.studentName} 출결 상태`}
                className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] bg-white px-3 text-[12px] text-[#0F172A] focus:outline-none"
                onChange={(event) => onChange({ status: (event.target.value || null) as AttendanceStatus | null })}
                value={status}
            >
                <option value="">미입력</option>
                {ATTENDANCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <input
                aria-label={`${entry.studentName} 비고`}
                className="col-span-4 h-8 w-full rounded-[7px] border border-[#DCE8E2] px-2.5 text-[12px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                onChange={(event) => onChange({ note: event.target.value })}
                placeholder="비고 입력"
                value={note}
            />
        </div>
    );
}
