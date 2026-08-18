'use client'

import { ko } from "date-fns/locale";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import AttendanceDayCell from "./AttendanceDayCell";

type AttendanceDayPickerProps = {
    month: Date;
    daysByDate: Record<string, AttendanceMonthlyDayData>;
    pendingCorrectionDates: Set<string>;
    onChangeMonth: (month: Date) => void;
    onSelectDay: (dateStr: string) => void;
};

export default function AttendanceDayPicker({
    month,
    daysByDate,
    pendingCorrectionDates,
    onChangeMonth,
    onSelectDay,
}: AttendanceDayPickerProps) {
    return (
        <DayPicker
            components={{
                DayButton: (props: DayButtonProps) => (
                    <AttendanceDayCell
                        {...props}
                        daysByDate={daysByDate}
                        pendingCorrectionDates={pendingCorrectionDates}
                        onSelectDay={onSelectDay}
                    />
                ),
            }}
            locale={ko}
            mode="single"
            month={month}
            selected={undefined}
            showOutsideDays
            weekStartsOn={0}
            onSelect={() => {}}
            classNames={{
                root: "w-full",
                months: "w-full",
                month: "w-full",
                month_caption: "hidden",
                nav: "hidden",
                month_grid: "w-full border-collapse",
                weekdays: "grid grid-cols-7 border-b border-[#DCE9DF] text-center",
                weekday: "py-2.5 text-[10px] font-medium text-[#64748B]",
                week: "grid grid-cols-7",
                day: "relative min-h-[82px] border-b border-r border-[#E5EEE7] p-0 align-top [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0 sm:min-h-[100px]",
                outside: "text-[#718096]",
            }}
            onMonthChange={onChangeMonth}
        />
    );
}
