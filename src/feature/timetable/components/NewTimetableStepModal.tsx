import { X } from "lucide-react";
import { modalSurfaceClass } from "@/feature/timetable/constants";
import type { FloorConfig } from "@/feature/timetable/viewModel";
import type { NewTimetableBasicInfoFormValues } from "@/lib/newTimetableBasicInfoSchema";
import NewTimetableBasicInfoStep from "./NewTimetableBasicInfoStep";
import NewTimetableRoomSetupStep from "./NewTimetableRoomSetupStep";
import NewTimetableTemplateChoiceStep from "./NewTimetableTemplateChoiceStep";

type NewTimetableStepModalProps = {
  floors: FloorConfig[];
  form: NewTimetableBasicInfoFormValues;
  isBasicInfoComplete: boolean;
  newRoomNames: Record<number, string>;
  onAddFloor: () => void;
  onAddRoom: (floorIndex: number) => void;
  onBasicInfoValidityChange: (isValid: boolean) => void;
  onChangeForm: (patch: Partial<NewTimetableBasicInfoFormValues>) => void;
  onChangeNewRoomName: (floorIndex: number, value: string) => void;
  onChangeSlot: (slot: 10 | 30 | 60) => void;
  onClose: () => void;
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRemoveRoom: (floorIndex: number, room: string) => void;
  onSelectTemplateOption: (option: "empty" | "previous") => void;
  isSubmitting?: boolean;
  selectedTemplateOption: "empty" | "previous" | null;
  slot: 10 | 30 | 60;
  step: 1 | 2 | 3;
};

const stepLabels = ["기본 정보", "템플릿 선택", "강의실 설정"];

export default function NewTimetableStepModal({
  floors,
  form,
  isBasicInfoComplete,
  newRoomNames,
  onAddFloor,
  onAddRoom,
  onBasicInfoValidityChange,
  onChangeForm,
  onChangeNewRoomName,
  onChangeSlot,
  onClose,
  onComplete,
  onNext,
  onPrev,
  onRemoveRoom,
  onSelectTemplateOption,
  isSubmitting = false,
  selectedTemplateOption,
  slot,
  step,
}: NewTimetableStepModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 py-6">
      <section 
        aria-labelledby="new-timetable-title"
        className={`${modalSurfaceClass} max-h-[calc(100dvh-3rem)] overflow-y-auto scrollbar-hide`}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-[#E5EEE7] px-5 py-4">
          <h2 id="new-timetable-title" className="sr-only">새 시간표 만들기</h2>
          <ol className="flex items-center gap-3 text-[14px] font-medium">
            {stepLabels.map((label, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;

              return <li 
                        className={`flex items-center gap-2 ${isActive ? "text-[#273548]" : "text-[#94A3B8]"}`}
                        key={label}
                      >
                        <span className={`flex size-6 items-center justify-center rounded-full text-[12px] font-semibold 
                          ${
                            isActive
                            ?
                            "bg-[#273548] text-white"
                            :
                            "bg-[#EEF2F6] text-[#94A3B8]"
                            }
                          `}
                        >
                          {stepNumber}
                        </span>
                        {label}
                        {stepNumber < 3 && <span className="ml-1 h-px w-8 bg-[#DCE9DF]" />}
                      </li>;
            })}
          </ol>
          <button 
            aria-label="새 시간표 만들기 닫기"
            className="flex size-7 items-center justify-center rounded-md text-[#94A3B8]"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </header>
        {step === 1 &&
          <NewTimetableBasicInfoStep
            form={form}
            onChangeForm={onChangeForm}
            onChangeSlot={onChangeSlot}
            onValidityChange={onBasicInfoValidityChange}
            slot={slot}
          />
        }
        {step === 2 && 
          <NewTimetableTemplateChoiceStep 
            onSelect={onSelectTemplateOption} 
            selectedOption={selectedTemplateOption}
          />
        }
        {step === 3 && 
          <NewTimetableRoomSetupStep 
            floors={floors} 
            newRoomNames={newRoomNames} 
            onAddFloor={onAddFloor} 
            onAddRoom={onAddRoom} 
            onChangeNewRoomName={onChangeNewRoomName} 
            onRemoveRoom={onRemoveRoom} 
          />
        }
        <footer className="flex justify-end gap-2 border-t border-[#E5EEE7] px-6 py-4">
          {step > 1 && 
            <button 
              className="h-10 rounded-lg border border-[#DCE9DF] px-4 text-sm text-[#526071]" 
              onClick={onPrev} 
              type="button"
            >
              이전
            </button>}
          <button
            className="h-10 rounded-lg border border-[#DCE9DF] px-4 text-sm text-[#526071]"
            onClick={onClose}
            type="button"
          >
            취소
          </button>
          {step < 3
            ?
            <button
              className="h-10 rounded-lg bg-[#273548] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#EEF2F6] disabled:text-[#94A3B8]"
              disabled={step === 1 ? !isBasicInfoComplete : !selectedTemplateOption}
              onClick={onNext}
              type="button"
            >
              다음
            </button>
            :
            <button
              className="h-10 rounded-lg bg-[#273548] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={onComplete}
              type="button"
            >
              {isSubmitting ? "저장 중..." : "완료"}
            </button>}
        </footer>
      </section>
    </div>
  );
}
