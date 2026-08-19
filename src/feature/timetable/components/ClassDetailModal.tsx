import { X } from "lucide-react";
import { gradeLabels, weekDayNames } from "@/feature/timetable/constants";
import { getClassEndTime, getClassStartTime } from "@/feature/timetable/timetableFormat";
import type { ClassItem, TimetableTemplate } from "@/feature/timetable/viewModel";

type ClassDetailModalProps = {
  activeTemplate: TimetableTemplate;
  canManage: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  selectedClass: ClassItem;
};

export default function ClassDetailModal({
  activeTemplate,
  canManage,
  onClose,
  onDelete,
  onEdit,
  selectedClass,
}: ClassDetailModalProps) {
  const room = activeTemplate.roomsByDay[selectedClass.day].rooms[selectedClass.room];
  const timeRange = `${weekDayNames[selectedClass.day]}요일 ${getClassStartTime(activeTemplate, selectedClass)} ~ ${getClassEndTime(activeTemplate, selectedClass)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 py-6">
      <section aria-labelledby="class-detail-title" className="flex w-full max-w-[420px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_50px_rgba(23,32,51,0.22)]" role="dialog" aria-modal="true">
        <header className="flex items-start justify-between px-5 pt-4">
          <div>
            <p className="text-[13px] text-[#94A3B8]">수업</p>
            <h2 id="class-detail-title" className="mt-0.5 text-lg font-bold text-[#172033]">{selectedClass.course}</h2>
          </div>
          <button
            aria-label="수업 상세 닫기"
            className="flex size-7 items-center justify-center text-[#94A3B8]"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="px-5 py-3">
          <dl className="space-y-2 rounded-lg bg-[#F3F6F4] px-4 py-3 text-sm">
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 text-[#94A3B8]">강의실</dt>
              <dd className="text-[#172033]">{room}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 text-[#94A3B8]">강사</dt>
              <dd className="text-[#172033]">{selectedClass.teacher}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 text-[#94A3B8]">학년</dt>
              <dd className="text-[#172033]">{selectedClass.grade ? gradeLabels[selectedClass.grade] : "-"}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 text-[#94A3B8]">시간</dt>
              <dd className="text-[#172033]">{timeRange}</dd>
            </div>
          </dl>
        </div>
        {canManage && (
          <footer className="flex justify-end gap-2 px-5 pb-4">
            <button className="h-9 rounded-md border border-[#DCE9DF] px-3 text-sm text-[#526071]" onClick={onEdit} type="button">수정</button>
            <button className="h-9 rounded-md bg-[#C46A62] px-3 text-sm font-semibold text-white" onClick={onDelete} type="button">삭제</button>
          </footer>
        )}
      </section>
    </div>
  );
}
