"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import ScheduleCalendar from "@/feature/schedule/components/ScheduleCalendar";
import ScheduleList from "@/feature/schedule/components/ScheduleList";
import { scheduleEvents } from "@/feature/schedule/dummySchedules";

export default function SchedulePage() {
  const [month, setMonth] = useState(new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-y-auto bg-[#FCFCFC] px-5 py-6 text-[#172033] lg:px-6">
      <div className="mx-auto h-full w-full max-w-[1530px]">
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:h-full xl:grid-cols-[minmax(0,1fr)_384px] xl:overflow-hidden">
          <ScheduleCalendar
            month={month}
            selectedDate={selectedDate}
            onChangeMonth={setMonth}
            onSelectDate={setSelectedDate}
          />

          <ScheduleList
            events={scheduleEvents}
            month={month}
            selectedDate={selectedDate}
            onClearSelectedDate={() => setSelectedDate(undefined)}
          />
        </div>
      </div>

      <button
        aria-label="일정 메모 작성"
        className="fixed bottom-6 right-6 flex size-12 items-center justify-center rounded-full bg-[#12182B] text-white shadow-lg"
        type="button"
      >
        <Pencil className="size-5" strokeWidth={1.8} />
      </button>
    </main>
  );
}
