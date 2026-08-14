import { gradeLabels } from "@/feature/timetable/constants";
import type { ClassItem } from "@/feature/timetable/viewModel";

type WeeklyTimetableGridDay = {
  date: string;
  dayOfWeek: number;
  name: string;
  rooms: string[];
};

type WeeklyTimetableGridProps = {
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

const classTone = {
  blue: "border-l-[#90A9C6] bg-[#EEF4FA] text-[#405268]",
  green: "border-l-[#6F9278] bg-[#F0F5F0] text-[#4D6654]",
  stone: "border-l-[#B7A18C] bg-[#F7F4F0] text-[#685D53]",
  sky: "border-l-[#77A4B0] bg-[#EEF6F7] text-[#49646B]",
};

export default function WeeklyTimetableGrid({
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
  return (
    <section
      aria-label="주간 시간표"
      className="min-w-0 max-w-full overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
    >
      <div data-testid="weekly-timetable-scroll" className="max-w-full overflow-x-auto overscroll-contain">
        <div className="max-h-[calc(100dvh-14rem)] min-w-[2240px] overflow-y-auto scrollbar-hide" role="table" aria-label="2026년 8월 첫째 주 시간표">
          <div 
            className="grid border-b border-[#DCE9DF]" 
            role="row" 
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="bg-[#F8FAF9]" />
            {days.map(({ name, date }, index) =>
              <div
                className="border-l border-[#DCE9DF] px-3 py-2 text-center text-[13px]"
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
            <div className="relative border-r border-[#DCE9DF] bg-[#FCFCFC]" style={{ height: `${slotCount * rowHeight + 28}px` }}>
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
              <div className="border-l border-[#DCE9DF]" key={name}>
                <div 
                  className="grid border-b border-[#DCE9DF] bg-[#F3F6F4] text-center text-[10px] font-medium text-[#718096]" 
                  style={{ gridTemplateColumns: `repeat(${Math.max(visibleRooms.length, 1)}, minmax(72px, 1fr))` }}
                >
                  {visibleRooms.map((room) => <span className="border-r border-[#DCE9DF] py-1.5 last:border-r-0" key={room}>{room}</span>)}
                </div>
                <div
                  data-testid="weekly-timetable-grid"
                  className="grid bg-white"
                  style={{
                    height: `${slotCount * rowHeight}px`,
                    gridTemplateColumns: `repeat(${Math.max(visibleRooms.length, 1)}, minmax(72px, 1fr))`,
                    gridTemplateRows: `repeat(${slotCount}, ${rowHeight}px)`,
                    backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(${100 / Math.max(visibleRooms.length, 1)}% - 1px), #E8EFEB calc(${100 / Math.max(visibleRooms.length, 1)}% - 1px), #E8EFEB ${100 / Math.max(visibleRooms.length, 1)}%), repeating-linear-gradient(to bottom, transparent 0, transparent ${rowHeight - 1}px, #E8EFEB ${rowHeight - 1}px, #E8EFEB ${rowHeight}px)`,
                  }}
                >
                  {classes.filter((item) => item.day === dayOfWeek && isClassVisible(item)).map((item) => {
                    const roomIndex = visibleRooms.indexOf(rooms[item.room]);

                    return roomIndex >= 0 &&
                    <button
                      aria-label={`${item.course} 수업 상세`}
                      className={`z-10 m-1 border-l-[3px] p-1 text-left text-[10px] font-semibold ${classTone[item.tone]}`}
                      key={item.slotId} onClick={() => onSelectClass(item)}
                      style={{ gridColumn: roomIndex + 1, gridRow: `${item.start} / span ${item.duration}` }} 
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
