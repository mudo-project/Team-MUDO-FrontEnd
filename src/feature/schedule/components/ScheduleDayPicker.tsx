'use client'

import { ko } from "date-fns/locale";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import ScheduleDayCell from "./ScheduleDayCell";
import type { ScheduleEvent } from "../scheduleTypes";

type ScheduleDayPickerProps = {
    month: Date;
    events: ScheduleEvent[];
    selectedDate: Date | undefined;
    onChangeMonth: (month: Date) => void;
    onSelectDate: (date: Date | undefined) => void;
};

export default function ScheduleDayPicker({
    month,
    events,
    selectedDate,
    onChangeMonth,
    onSelectDate,
}: ScheduleDayPickerProps) {
    return (
        <DayPicker
            components={{
                DayButton: (props: DayButtonProps) => <ScheduleDayCell {...props} events={events} />,
            }}
            locale={ko}
            mode="single"
            month={month}
            selected={selectedDate}
            showOutsideDays
            weekStartsOn={1}
            classNames={{
                root: "w-full",
                months: "w-full",
                month: "w-full",
                month_caption: "hidden",
                nav: "hidden",
                month_grid: "w-full border-collapse",
                weekdays: "grid grid-cols-7 border-b border-[#DCE9DF] bg-white",
                weekday: "py-3 text-center text-[11px] font-semibold text-[#718096]",
                week: "grid grid-cols-7 [&:last-child>td]:border-b-0",
                day: "min-h-[128px] border-b border-r border-[#E5EEE7] p-0 align-top last:border-r-0",
                outside: "text-[#A1ACBA]",
            }}
            onMonthChange={onChangeMonth}
            onSelect={onSelectDate}
        />
    );
}
