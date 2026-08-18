"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";

type ScheduleDateRangePickerProps = {
  range: DateRange | undefined;
  defaultMonth?: Date;
  onChange: (range: DateRange | undefined) => void;
};

export default function ScheduleDateRangePicker({ range, defaultMonth, onChange }: ScheduleDateRangePickerProps) {
  return (
    <DayPicker
      classNames={{
        root: "w-full text-[13px]",
        month_caption: "flex items-center justify-center h-9 font-semibold text-[#172033]",
        nav: "flex items-center justify-between",
        button_previous: "flex size-7 items-center justify-center rounded-md text-[#718096] hover:bg-[#F1F5F9]",
        button_next: "flex size-7 items-center justify-center rounded-md text-[#718096] hover:bg-[#F1F5F9]",
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7",
        weekday: "py-1 text-center text-[11px] font-medium text-[#718096]",
        week: "grid grid-cols-7",
        day: "p-0.5 text-center align-middle",
        day_button: "flex size-8 items-center justify-center rounded-full text-[12px] text-[#172033] hover:bg-[#F1F5F9]",
        range_start: "bg-[#4D9560] text-white rounded-full",
        range_end: "bg-[#4D9560] text-white rounded-full",
        range_middle: "bg-[#E5EEE7] rounded-none",
        selected: "bg-[#4D9560] text-white rounded-full",
      }}
      defaultMonth={defaultMonth}
      locale={ko}
      mode="range"
      resetOnSelect
      selected={range}
      weekStartsOn={1}
      onSelect={onChange}
    />
  );
}
