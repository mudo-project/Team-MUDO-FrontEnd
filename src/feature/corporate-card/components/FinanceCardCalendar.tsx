'use client'

import { addMonths, format, subMonths } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FinanceCardCalendarProps {
    month: Date;
    onChangeMonth: (month: Date) => void;
    onSelectDate: (date: Date | undefined) => void;
}

export default function FinanceCardCalendar({ month, onChangeMonth, onSelectDate }: FinanceCardCalendarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const label = format(month, "yyyy년 M월");
    const years = Array.from({ length: 21 }, (_, index) => month.getFullYear() - 10 + index);
    const months = Array.from({ length: 12 }, (_, index) => index);

    const handleSelectMonth = (monthIndex: number) => {
        onChangeMonth(new Date(month.getFullYear(), monthIndex, 1));
        onSelectDate(undefined);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-1">
            <button
                aria-label="이전 달"
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]"
                onClick={() => onChangeMonth(subMonths(month, 1))}
                type="button"
            >
                <ChevronLeft className="size-4" />
            </button>
            <div className="relative">
                <button
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    className="flex h-9 min-w-[128px] items-center justify-center gap-1.5 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] font-semibold"
                    onClick={() => setIsOpen((open) => !open)}
                    type="button"
                >
                    {label}
                    <ChevronDown className="size-3.5 text-[#94A3B8]" />
                </button>
                {isOpen && (
                    <div
                        aria-label="날짜 선택"
                        className="absolute left-0 top-11 z-30 w-[312px] rounded-lg border border-[#DCE9DF] bg-white p-3 shadow-lg"
                        role="dialog"
                    >
                        <label className="mb-3 flex items-center justify-between gap-2 text-[12px] font-semibold text-[#64748B]">
                            연도
                            <select
                                className="h-9 rounded-md border border-[#DCE9DF] bg-white px-2 text-[15px] font-semibold text-[#172033] outline-none"
                                onChange={(event) => onChangeMonth(new Date(Number(event.target.value), month.getMonth(), 1))}
                                value={month.getFullYear()}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}년
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="grid grid-cols-4 gap-x-2 gap-y-1.5">
                            {months.map((monthIndex) => {
                                const isSelected = month.getMonth() === monthIndex;

                                return (
                                    <button
                                        className={`h-9 rounded-md text-[13px] font-semibold transition ${isSelected
                                            ? "bg-[#679967] text-white"
                                            : "text-[#394257] hover:bg-[#F3F8F3]"
                                            }`}
                                        key={monthIndex}
                                        onClick={() => handleSelectMonth(monthIndex)}
                                        type="button"
                                    >
                                        {monthIndex + 1}월
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <button
                aria-label="다음 달"
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]"
                onClick={() => onChangeMonth(addMonths(month, 1))}
                type="button"
            >
                <ChevronRight className="size-4" />
            </button>
        </div>
    );
}
