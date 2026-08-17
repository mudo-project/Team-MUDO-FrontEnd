import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { endTimeOptions, gradeOptions, modalSurfaceClass, startTimeOptions, weekDayNames } from "@/feature/timetable/constants";
import { classRegistrationSchema, type ClassRegistrationFormValues } from "@/lib/classRegistrationSchema";

type ClassRegistrationModalProps = {
  defaultValues: ClassRegistrationFormValues;
  getAvailableRooms: (day: string) => string[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ClassRegistrationFormValues) => void;
};

export default function ClassRegistrationModal({
  defaultValues,
  getAvailableRooms,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ClassRegistrationModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClassRegistrationFormValues>({
    resolver: zodResolver(classRegistrationSchema),
    defaultValues,
  });
  const [selectedDay, setSelectedDay] = useState(defaultValues.day);
  const [selectedColor, setSelectedColor] = useState(defaultValues.color);

  const dayField = register("day");
  const availableRooms = getAvailableRooms(selectedDay);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/40 px-4 py-6">
      <section
        aria-labelledby="class-registration-title"
        className={`${modalSurfaceClass} max-h-[90vh] overflow-y-auto scrollbar-hide`}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-[#E5EEE7] px-5 py-4">
          <h2 id="class-registration-title" className="text-base font-semibold text-[#273548]">수업 등록</h2>
          <button 
            aria-label="수업 등록 닫기" 
            className="flex size-7 items-center justify-center rounded-md text-[#94A3B8]" 
            onClick={onClose} 
            type="button"
          >
            <X className="size-4" />
          </button>
        </header>
        <form 
          className="flex-1 space-y-3 px-5 py-4" 
          id="class-registration-form" 
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1.5 text-[11px] font-medium text-[#718096]">요일
              <select
                aria-label="수업 요일"
                className="h-8 w-full rounded-md border border-[#DCE9DF] bg-white px-2 text-[12px] font-normal text-[#526071] outline-none"
                {...dayField}
                onChange={(event) => {
                  dayField.onChange(event);
                  setSelectedDay(event.target.value);
                  setValue("room", "");
                }}
              >
                {weekDayNames.map((day) => <option key={day} value={day}>{day}요일</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-[11px] font-medium text-[#718096]">강의실
              <select 
                aria-label="강의실" 
                className="h-8 w-full rounded-md border border-[#DCE9DF] bg-white px-2 text-[12px] font-normal text-[#526071] outline-none" {...register("room")}
              >
                <option value="" disabled>강의실 선택</option>
                {availableRooms.map((room) => <option key={room} value={room}>{room}</option>)}
              </select>
              {errors.room && <p className="mt-1 text-[10px] text-[#C65A50]">{errors.room.message}</p>}
            </label>
            <label className="space-y-1.5 text-[11px] font-medium text-[#718096]">시작 시각
              <select 
                aria-label="시작 시각" 
                className="h-8 w-full rounded-md border border-[#DCE9DF] bg-white px-2 text-[12px] font-normal text-[#526071] outline-none" {...register("startTime")}
              >
                {startTimeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-[11px] font-medium text-[#718096]">종료 시각
              <select 
                aria-label="종료 시각" 
                className="h-8 w-full rounded-md border border-[#DCE9DF] bg-white px-2 text-[12px] font-normal text-[#526071] outline-none" {...register("endTime")}
              >
                {endTimeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
              {errors.endTime && <p className="mt-1 text-[10px] text-[#C65A50]">{errors.endTime.message}</p>}
            </label>
          </div>
          <label className="block space-y-1.5 text-[11px] font-medium text-[#718096]">학년
            <select 
              aria-label="학년" 
              className="h-8 w-full rounded-md border border-[#DCE9DF] bg-white px-2 text-[12px] font-normal text-[#526071] outline-none" {...register("grade")}
            >
              {gradeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-[11px] font-medium text-[#718096]">색상
            <input
              aria-label="색상"
              className="h-8 w-10 cursor-pointer rounded-md border border-[#DCE9DF] bg-white p-0.5"
              onChange={(event) => {
                const hex = event.target.value.replace("#", "").toUpperCase();

                setSelectedColor(hex);
                setValue("color", hex, { shouldValidate: true });
              }}
              type="color"
              value={`#${selectedColor}`}
            />
            <span className="text-[12px] font-normal text-[#526071]">#{selectedColor}</span>
            {errors.color && <span className="text-[10px] text-[#C65A50]">{errors.color.message}</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1.5 text-[11px] font-medium text-[#718096]">강사
              <input 
                aria-label="강사" 
                className="h-8 w-full rounded-md border border-[#DCE9DF] px-2 text-[12px] font-normal text-[#526071] outline-none placeholder:text-[#A1ACBA]" 
                placeholder="예: 최T" {...register("teacher")} 
              />
              {errors.teacher && <p className="mt-1 text-[10px] text-[#C65A50]">{errors.teacher.message}</p>}
            </label>
            <label className="space-y-1.5 text-[11px] font-medium text-[#718096]">과목
              <input 
                aria-label="과목" 
                className="h-8 w-full rounded-md border border-[#DCE9DF] px-2 text-[12px] font-normal text-[#526071] outline-none placeholder:text-[#A1ACBA]" 
                placeholder="예: 공통미적" {...register("course")} 
              />
              {errors.course && <p className="mt-1 text-[10px] text-[#C65A50]">{errors.course.message}</p>}
            </label>
          </div>
        </form>
        <footer className="flex justify-end gap-2 border-t border-[#E5EEE7] px-5 py-3">
          <button
            className="h-8 rounded-md border border-[#DCE9DF] bg-white px-3 text-[12px] font-medium text-[#526071]"
            onClick={onClose}
            type="button"
          >
            취소
          </button>
          <button
            className="h-8 rounded-md bg-[#273548] px-3 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            form="class-registration-form"
            type="submit"
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </footer>
      </section>
    </div>
  );
}
