type NewTimetableTemplateChoiceStepProps = {
  onSelect: (option: "empty" | "previous") => void;
  selectedOption: "empty" | "previous" | null;
};

export default function NewTimetableTemplateChoiceStep({
  onSelect,
  selectedOption,
}: NewTimetableTemplateChoiceStepProps) {
  return (
    <div className="space-y-3 px-6 py-8">
      <p className="text-sm text-[#718096]">새 시간표를 시작할 방식을 선택하세요.</p>
      <button 
        aria-label="빈 시간표로 시작"
        className={`w-full rounded-xl border p-4 text-left
          ${
            selectedOption === "empty" 
            ?
            "border-[#273548] bg-[#F3F6F4]"
            :
            "border-[#DCE9DF]"
            }
          `} 
        onClick={() => onSelect("empty")} 
        type="button"
      >
        <strong className="block text-base text-[#273548]">빈 시간표로 시작</strong>
        <span className="mt-1 block text-[13px] text-[#718096]">1층부터 5층까지 각 층의 01호를 생성합니다.</span>
      </button>
      <button 
        aria-label="이전 템플릿 불러오기"
        className={`w-full rounded-xl border p-4 text-left 
          ${
            selectedOption === "previous"
            ?
            "border-[#273548] bg-[#F3F6F4]"
            :
            "border-[#DCE9DF]"
            }
          `}
        onClick={() => onSelect("previous")} 
        type="button"
      >
        <strong className="block text-base text-[#273548]">이전 템플릿 불러오기</strong>
        <span className="mt-1 block text-[13px] text-[#718096]">기존 시간표의 강의실 구성을 복사합니다.</span>
      </button>
    </div>
  );
}
