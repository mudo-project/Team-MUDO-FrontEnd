import { useRef } from "react";
import type { RefObject } from "react";
import { gradeLabels } from "@/feature/timetable/constants";
import type { ClassItem } from "@/feature/timetable/viewModel";

type WeeklyTimetableGridDay = {
  date: string;
  dayOfWeek: number;
  name: string;
  rooms: string[];
};

type WeeklyTimetableGridProps = {
  captureRef?: RefObject<HTMLDivElement | null>;
  classes: ClassItem[];
  days: WeeklyTimetableGridDay[];
  gridColumns: string;
  isClassVisible: (item: ClassItem) => boolean;
  onSelectClass: (item: ClassItem) => void;
  rowHeight: number;
  slotCount: number;
  times: string[];
  visibleRooms: string[];
};

export default function WeeklyTimetableGrid({
  captureRef,
  classes,
  days,
  gridColumns,
  isClassVisible,
  onSelectClass,
  rowHeight,
  slotCount,
  times,
  visibleRooms,
}: WeeklyTimetableGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-label="주간 시간표"
      className="min-w-0 max-w-full overflow-hidden rounded-xl border border-[#A9BDB2] bg-white"
    >
      <div
        data-testid="weekly-timetable-scroll"
        className="max-w-full overflow-x-auto overscroll-contain"
        onWheel={(event) => {
          if (!event.shiftKey || !scrollRef.current) return;

          event.preventDefault();
          scrollRef.current.scrollLeft += event.deltaY || event.deltaX;
        }}
        ref={scrollRef}
      >
        <div className="w-max min-w-[2240px] max-h-[calc(100dvh-14rem)] overflow-y-auto scrollbar-hide" ref={captureRef} role="table" aria-label="2026년 8월 첫째 주 시간표">
          <div 
            className="grid border-b border-[#A9BDB2]" 
            role="row" 
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="bg-[#F8FAF9]" />
            {days.map(({ name, date }, index) =>
              <div
                className="border-l border-[#A9BDB2] px-3 py-2 text-center text-[13px]"
                role="columnheader"
                key={name}
              >
                <strong className={index === 0 ? "text-[#C46A62]" : "text-[#172033]"}>{name}</strong>
                <span className="ml-1 text-[10px] text-[#94A3B8]">{date}</span>
              </div>
            )}
          </div>
          <div 
            className="grid" 
            role="row" 
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="relative border-r border-[#A9BDB2] bg-[#FCFCFC]" style={{ height: `${slotCount * rowHeight + 28}px` }}>
              {times.map((time, index) =>
                <span
                  className="absolute left-0 w-full -translate-y-1/2 pr-2 text-right text-[10px] text-[#A1ACBA]"
                  key={time}
                  style={{ top: `${index * rowHeight + 28}px` }}
                >
                  {time}
                </span>
              )}
            </div>
            {days.map(({ name, rooms, dayOfWeek }) => (
              <div className="border-l border-[#A9BDB2]" key={name}>
                <div 
                  className="grid border-b border-[#A9BDB2] bg-[#F3F6F4] text-center text-[10px] font-medium text-[#718096]" 
                  style={{ gridTemplateColumns: `repeat(${Math.max(visibleRooms.length, 1)}, minmax(72px, 1fr))` }}
                >
                  {visibleRooms.map((room) => <span className="border-r border-[#A9BDB2] py-1.5 last:border-r-0" key={room}>{room}</span>)}
                </div>
                <div
                  data-testid="weekly-timetable-grid"
                  className="grid bg-white"
                  style={{
                    height: `${slotCount * rowHeight}px`,
                    gridTemplateColumns: `repeat(${Math.max(visibleRooms.length, 1)}, minmax(72px, 1fr))`,
                    gridTemplateRows: `repeat(${slotCount}, ${rowHeight}px)`,
                    backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${100 / Math.max(visibleRooms.length, 1)}% - 1px), #CBD8D0 calc(${100 / Math.max(visibleRooms.length, 1)}% - 1px), #CBD8D0 ${100 / Math.max(visibleRooms.length, 1)}%), repeating-linear-gradient(to bottom, transparent 0, transparent ${rowHeight - 1}px, #CBD8D0 ${rowHeight - 1}px, #CBD8D0 ${rowHeight}px)`,
                  }}
                >
                  {classes.filter((item) => item.day === dayOfWeek && isClassVisible(item)).map((item) => {
                    const roomIndex = visibleRooms.indexOf(rooms[item.room]);

                    return roomIndex >= 0 &&
                    <button
                      aria-label={`${item.course} 수업 상세`}
                      className="z-10 m-1 border-l-[3px] p-1 text-left text-[10px] font-semibold text-[#172033]"
                      key={item.slotId} onClick={() => onSelectClass(item)}
                      style={{
                        backgroundColor: `#${item.color}1A`,
                        borderLeftColor: `#${item.color}`,
                        gridColumn: roomIndex + 1,
                        gridRow: `${item.start} / span ${item.duration}`,
                      }}
                      type="button"
                    >
                      <strong className="block">{item.grade ? `${gradeLabels[item.grade]} ${item.course}` : item.course}</strong>
                      <span className="mt-0.5 block font-medium">{item.teacher}</span>
                    </button>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
