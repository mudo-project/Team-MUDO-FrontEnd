import { X } from "lucide-react";
import { modalSurfaceClass, weekDayNames } from "@/feature/timetable/constants";
import type { ClassItem, TimetableTemplate } from "@/feature/timetable/types";

type ClassDetailModalProps = {
  activeTemplate: TimetableTemplate;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  selectedClass: ClassItem;
};

export default function ClassDetailModal({
  activeTemplate,
  onClose,
  onDelete,
  onEdit,
  selectedClass,
}: ClassDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 py-6">
      <section aria-labelledby="class-detail-title" 
        className={modalSurfaceClass} 
        role="dialog" 
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-[#E5EEE7] px-5 py-4">
          <h2 id="class-detail-title" className="text-base font-semibold text-[#273548]">수업 상세</h2>
          <button 
            aria-label="수업 상세 닫기" 
            className="flex size-7 items-center justify-center text-[#94A3B8]" 
            onClick={onClose} 
            type="button"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="flex-1 space-y-4 px-5 py-5 text-sm text-[#526071]">
          <div>
            <span className="text-[#94A3B8]">수업</span>
            <strong className="mt-1 block text-lg text-[#273548]">{selectedClass.grade} {selectedClass.course}</strong>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <span>강사: {selectedClass.teacher}</span>
            <span>요일: {weekDayNames[selectedClass.day]}요일</span>
            <span>강의실: {activeTemplate.roomsByDay[selectedClass.day].rooms[selectedClass.room]}</span>
            <span>시간: {String(8 + Math.floor((selectedClass.start - 1) * activeTemplate.slotMinutes / 60)).padStart(2, "0")}:00</span>
          </div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-[#E5EEE7] px-5 py-3">
          <button 
            className="h-9 rounded-md border border-[#DCE9DF] px-3 text-sm" 
            onClick={onEdit} 
            type="button"
          >
            수정
          </button>
          <button 
            className="h-9 rounded-md bg-[#C46A62] px-3 text-sm font-semibold text-white" 
            onClick={onDelete} 
            type="button"
          >
            삭제
          </button>
        </footer>
      </section>
    </div>
  );
}
