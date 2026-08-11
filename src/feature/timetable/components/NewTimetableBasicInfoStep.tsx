import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { newTimetableBasicInfoSchema, type NewTimetableBasicInfoFormValues } from "@/lib/newTimetableBasicInfoSchema";

type NewTimetableBasicInfoStepProps = {
  form: NewTimetableBasicInfoFormValues;
  onChangeForm: (patch: Partial<NewTimetableBasicInfoFormValues>) => void;
  onChangeSlot: (slot: 10 | 30 | 60) => void;
  onValidityChange: (isValid: boolean) => void;
  slot: 10 | 30 | 60;
};

export default function NewTimetableBasicInfoStep({
  form,
  onChangeForm,
  onChangeSlot,
  onValidityChange,
  slot,
}: NewTimetableBasicInfoStepProps) {
  const {
    register,
    formState: { errors, isValid },
  } = useForm<NewTimetableBasicInfoFormValues>({
    resolver: zodResolver(newTimetableBasicInfoSchema),
    mode: "onChange",
    defaultValues: form,
  });

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const nameField = register("name");
  const startDateField = register("startDate");
  const endDateField = register("endDate");

  return (
    <div className="px-6 py-6">
      <div className="space-y-4">
        <label className="block space-y-2 text-[13px] font-medium text-[#526071]">
          시간표 이름
          <span className="text-[#C46A62]">*</span>
          <input
            aria-label="시간표 이름"
            className="h-11 w-full rounded-lg border border-[#DCE9DF] px-3 text-sm font-normal text-[#273548] outline-none placeholder:text-[#A1ACBA]"
            placeholder="예: 2026 여름특강"
            {...nameField}
            onChange={(event) => {
              nameField.onChange(event);
              onChangeForm({ name: event.target.value });
            }}
          />
          {errors.name && <p className="mt-1 text-[11px] text-[#C46A62]">{errors.name.message}</p>}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2 text-[13px] font-medium text-[#526071]">시작일
            <input
              aria-label="시작일"
              className="h-11 w-full rounded-lg border border-[#DCE9DF] px-3 text-sm font-normal text-[#273548] outline-none"
              type="date"
              {...startDateField}
              onChange={(event) => {
                startDateField.onChange(event);
                onChangeForm({ startDate: event.target.value });
              }}
            />
          </label>
          <label className="block space-y-2 text-[13px] font-medium text-[#526071]">종료일
            <input
              aria-label="종료일"
              className="h-11 w-full rounded-lg border border-[#DCE9DF] px-3 text-sm font-normal text-[#273548] outline-none"
              type="date"
              {...endDateField}
              onChange={(event) => {
                endDateField.onChange(event);
                onChangeForm({ endDate: event.target.value });
              }}
            />
            {errors.endDate && <p className="mt-1 text-[11px] text-[#C46A62]">{errors.endDate.message}</p>}
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-2 text-[13px] font-medium text-[#526071]">
            운영 시작 시각
            <select
              className="h-11 w-full rounded-lg border border-[#DCE9DF] bg-white px-3 text-sm font-normal text-[#273548] outline-none"
              defaultValue="08:30"
            >
              <option>08:30</option>
              <option>09:00</option>
              <option>09:30</option>
            </select>
          </label>
          <label className="block space-y-2 text-[13px] font-medium text-[#526071]">
            운영 종료 시각
            <select
              className="h-11 w-full rounded-lg border border-[#DCE9DF] bg-white px-3 text-sm font-normal text-[#273548] outline-none"
              defaultValue="22:00"
            >
              <option>21:00</option>
              <option>21:30</option>
              <option>22:00</option>
            </select>
          </label>
        </div>
        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-[#526071]">운영 요일</legend>
          <div className="flex gap-2">{["일", "월", "화", "수", "목", "금", "토"].map((day) =>
            <button
              className="flex size-9 items-center justify-center rounded-full bg-[#273548] text-[12px] font-semibold text-white"
              key={day}
              type="button"
            >
              {day}
            </button>
            )}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-[#526071]">슬롯 단위</legend>
          <div className="flex items-center gap-4 text-sm text-[#526071]">{([30, 10, 60] as const).map((slotOption) =>
            <label key={slotOption}>
              <input
                checked={slot === slotOption}
                name="slot"
                onChange={() => onChangeSlot(slotOption)}
                type="radio"
                value={slotOption}
              />
                {slotOption === 60 ? "1시간" : `${slotOption}분`}
              </label>
            )}
            </div>
          </fieldset>
      </div>
    </div>
  );
}
