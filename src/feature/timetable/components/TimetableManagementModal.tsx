import { Plus, X } from "lucide-react";
import { modalSurfaceClass } from "@/feature/timetable/constants";
import type { ClassItem, TemplateStatus, TimetableTemplate } from "@/feature/timetable/types";

type TimetableManagementModalProps = {
  getStatus: (template: TimetableTemplate) => TemplateStatus;
  onClose: () => void;
  onCreate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onEditTemplate: (template: TimetableTemplate) => void;
  onToggleOption: (templateId: string) => void;
  openOptionId: string | null;
  registeredClasses: Record<string, ClassItem[]>;
  templates: TimetableTemplate[];
};

export default function TimetableManagementModal({
  getStatus,
  onClose,
  onCreate,
  onDeleteTemplate,
  onEditTemplate,
  onToggleOption,
  openOptionId,
  registeredClasses,
  templates,
}: TimetableManagementModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 py-6">
      <section 
        aria-labelledby="timetable-management-title" 
        className={modalSurfaceClass} 
        role="dialog" 
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-[#E5EEE7] px-5 py-4">
          <h2 id="timetable-management-title" className="text-lg font-semibold text-[#273548]">시간표 관리</h2>
          <button 
            aria-label="시간표 관리 닫기" 
            className="flex size-7 items-center justify-center rounded-md text-[#94A3B8]" 
            onClick={onClose} 
            type="button"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="flex-1">
          {templates.map((template) => (
            <article className="flex items-center justify-between border-b border-[#E5EEE7] px-5 py-3.5" key={template.id}>
              <div>
                <strong className="block text-base text-[#273548]">{template.title}</strong>
                <span className="mt-1 block text-[13px] text-[#94A3B8]">
                  {template.startDate.toLocaleDateString("sv-SE")} ~ {template.endDate.toLocaleDateString("sv-SE")} · {template.classes.length + (registeredClasses[template.id] ?? []).length}개 수업
                </span>
              </div>
              <div className="relative flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatus(template).tone}`}>{getStatus(template).label}</span>
                <button 
                  aria-label={`${template.title} 옵션`}
                  aria-expanded={openOptionId === template.id}
                  className="flex size-7 items-center justify-center rounded-md text-lg leading-none text-[#94A3B8]" 
                  onClick={() => onToggleOption(template.id)} 
                  type="button"
                >
                  …
                </button>
                {openOptionId === template.id && 
                  <div className="absolute right-0 top-full z-10 mt-1 w-20 overflow-hidden rounded-lg border border-[#DCE9DF] bg-white py-1 shadow-[0_8px_18px_rgba(28,42,34,0.14)]">
                    <button 
                      className="w-full px-3 py-1.5 text-left text-[12px] text-[#526071] hover:bg-[#F3F6F4]" 
                      onClick={() => onEditTemplate(template)} 
                      type="button"
                    >
                      수정
                    </button>
                    <button 
                      className="w-full px-3 py-1.5 text-left text-[12px] text-[#C46A62] hover:bg-[#FFF5F3]" 
                      onClick={() => onDeleteTemplate(template.id)} type="button"
                    >
                      삭제
                      </button>
                    </div>
                  }
                </div>
            </article>
          ))}
        </div>
        <footer className="p-4">
          <button 
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#273548] text-[14px] font-semibold text-white" 
            onClick={onCreate} 
            type="button"
          >
            <Plus className="size-4" /> 새 시간표
          </button>
        </footer>
      </section>
    </div>
  );
}
