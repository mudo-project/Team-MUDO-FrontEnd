import { ChevronDown, Plus } from "lucide-react";

import type { TemplateStatus, TimetableTemplate } from "../types";

type TimetableTemplateSelectorProps = {
  activeTemplate: TimetableTemplate;
  getStatus: (template: TimetableTemplate) => TemplateStatus;
  isOpen: boolean;
  onCreate: () => void;
  onSelect: (template: TimetableTemplate) => void;
  onToggle: () => void;
  templates: TimetableTemplate[];
};

const formatTemplateDateRange = (template: TimetableTemplate) =>
  `${template.startDate.toLocaleDateString("sv-SE")} ~ ${template.endDate.toLocaleDateString("sv-SE")}`;

export default function TimetableTemplateSelector({
  activeTemplate,
  getStatus,
  isOpen,
  onCreate,
  onSelect,
  onToggle,
  templates,
}: TimetableTemplateSelectorProps) {
  const activeStatus = getStatus(activeTemplate);

  return (
    <div className="relative">
      <button
        aria-controls="timetable-template-menu"
        aria-expanded={isOpen}
        aria-label="시간표 템플릿 선택"
        className="flex h-11 min-w-[204px] items-center justify-between rounded-lg border border-[#DCE9DF] bg-white px-3 text-left"
        onClick={onToggle}
        type="button"
      >
        <span>
          <strong className="block text-sm text-[#273548]">{activeTemplate.title}</strong>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
            {formatTemplateDateRange(activeTemplate)}
            <span className={`rounded-full px-1.5 py-0.5 font-semibold ${activeStatus.tone}`}>
              {activeStatus.label}
            </span>
          </span>
        </span>
        <ChevronDown className="size-4 text-[#94A3B8]" />
      </button>
      {isOpen && (
        <div
          aria-label="시간표 템플릿 목록"
          className="absolute left-0 top-[calc(100%+6px)] z-30 w-[320px] overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_12px_30px_rgba(28,42,34,0.14)]"
          id="timetable-template-menu"
        >
          <div className="max-h-[280px] overflow-y-auto scrollbar-hide">
            {templates.map((template) => {
              const status = getStatus(template);

              return (
                <button
                  className="flex w-full items-center justify-between border-b border-[#E5EEE7] px-4 py-3 text-left hover:bg-[#F8FAF8]"
                  key={template.id}
                  onClick={() => onSelect(template)}
                  type="button"
                >
                  <span>
                    <strong className="block text-sm text-[#273548]">{template.title}</strong>
                    <span className="mt-1 block text-[11px] text-[#94A3B8]">{formatTemplateDateRange(template)}</span>
                  </span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${status.tone}`}>{status.label}</span>
                </button>
              );
            })}
          </div>
          <button
            className="flex h-11 w-full items-center gap-2 px-4 text-sm font-medium text-[#526071] hover:bg-[#F8FAF8]"
            onClick={onCreate}
            type="button"
          >
            <Plus className="size-4" /> 새 시간표 만들기
          </button>
        </div>
      )}
    </div>
  );
}
