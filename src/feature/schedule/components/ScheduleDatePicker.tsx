"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const YEAR_RANGE = 10;

type ScheduleDatePickerProps = {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
};

export default function ScheduleDatePicker({ year, month, onChange }: ScheduleDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const years = Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, index) => year - YEAR_RANGE + index);

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        className="flex items-center gap-1 text-[21px] font-bold tracking-[-0.03em]"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {year}년 {month}월
        <ChevronDown className="size-4 text-[#94A3B8]" strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-64 rounded-lg border border-[#DCE9DF] bg-white p-3 shadow-md">
          <label className="flex items-center justify-between gap-2 text-[12px] font-medium text-[#64748B]">
            연도
            <select
              className="h-9 rounded-md border border-[#DCE9DF] px-2 text-[13px] text-[#172033]"
              value={year}
              onChange={(event) => onChange(Number(event.target.value), month)}
            >
              {years.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}년
                </option>
              ))}
            </select>
          </label>

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {MONTHS.map((monthOption) => (
              <button
                aria-pressed={monthOption === month}
                className={`rounded-md py-1.5 text-[12px] font-medium ${
                  monthOption === month ? "bg-[#4D9560] text-white" : "text-[#344054] hover:bg-[#F1F5F9]"
                }`}
                key={monthOption}
                type="button"
                onClick={() => {
                  onChange(year, monthOption);
                  setIsOpen(false);
                }}
              >
                {monthOption}월
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
