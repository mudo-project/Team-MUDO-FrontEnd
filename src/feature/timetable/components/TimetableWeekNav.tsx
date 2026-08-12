import { ChevronLeft, ChevronRight } from "lucide-react";

type TimetableWeekNavProps = {
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  label: string;
  onNext: () => void;
  onPrev: () => void;
};

export default function TimetableWeekNav({
  isNextDisabled,
  isPrevDisabled,
  label,
  onNext,
  onPrev,
}: TimetableWeekNavProps) {
  return (
    <div className="flex items-center gap-1 text-[13px] font-semibold text-[#526071]">
      <button
        aria-label="이전 주"
        className="flex size-8 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={isPrevDisabled}
        onClick={onPrev}
        type="button"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="px-1">{label}</span>
      <button
        aria-label="다음 주"
        className="flex size-8 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={isNextDisabled}
        onClick={onNext}
        type="button"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
