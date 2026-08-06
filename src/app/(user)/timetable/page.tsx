import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  List,
  Plus,
  Search,
} from "lucide-react";

// 임시로 사용할 타입입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
type ClassItem = {
  day: number;
  room: number;
  start: number;
  duration: number;
  course: string;
  teacher: string;
  tone: "blue" | "green" | "stone" | "sky";
};


// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const days = [
  { name: "일", date: "08.03", rooms: ["601", "602", "603", "604", "605"] },
  { name: "월", date: "08.04", rooms: ["601", "602", "603", "604", "605"] },
  { name: "화", date: "08.05", rooms: ["501", "502", "401", "301", "다모아"] },
  { name: "수", date: "08.06", rooms: ["601", "602", "603", "604", "605"] },
  { name: "목", date: "08.07", rooms: ["501", "502", "401", "301", "다모아"] },
  { name: "금", date: "08.08", rooms: ["601", "602", "603", "604", "605"] },
  { name: "토", date: "08.09", rooms: ["501", "502", "401", "301", "다모아"] },
] as const;


// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const classItems: ClassItem[] = [
  { day: 0, room: 1, start: 3, duration: 4, course: "고3", teacher: "최T", tone: "blue" },
  { day: 0, room: 2, start: 3, duration: 4, course: "고3", teacher: "오T", tone: "green" },
  { day: 1, room: 3, start: 5, duration: 5, course: "고3", teacher: "오T", tone: "green" },
  { day: 1, room: 4, start: 4, duration: 6, course: "원T", teacher: "김T", tone: "stone" },
  { day: 2, room: 0, start: 5, duration: 3, course: "고1", teacher: "윤T", tone: "blue" },
  { day: 2, room: 3, start: 11, duration: 4, course: "고2", teacher: "박T", tone: "stone" },
  { day: 3, room: 1, start: 8, duration: 4, course: "고1", teacher: "김T", tone: "sky" },
  { day: 4, room: 2, start: 4, duration: 5, course: "고2", teacher: "오T", tone: "green" },
  { day: 5, room: 0, start: 6, duration: 4, course: "고3", teacher: "최T", tone: "blue" },
  { day: 5, room: 4, start: 12, duration: 5, course: "고1", teacher: "김T", tone: "sky" },
  { day: 6, room: 1, start: 5, duration: 6, course: "중3", teacher: "박T", tone: "stone" },
  { day: 6, room: 3, start: 3, duration: 4, course: "고2", teacher: "윤T", tone: "blue" },
];


// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const classTone = {
  blue: "border-l-[#90A9C6] bg-[#EEF4FA] text-[#405268]",
  green: "border-l-[#6F9278] bg-[#F0F5F0] text-[#4D6654]",
  stone: "border-l-[#B7A18C] bg-[#F7F4F0] text-[#685D53]",
  sky: "border-l-[#77A4B0] bg-[#EEF6F7] text-[#49646B]",
};

export default function TimetablePage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] min-w-0 w-full overflow-hidden bg-[#FCFCFC] text-[#172033]">
      <div className="h-full overflow-y-auto px-5 py-5 lg:px-6">
        <div className="mx-auto min-w-0 w-full max-w-[1760px]">
          <h1 className="sr-only">시간표</h1>
          <div className="flex flex-col gap-4 border-b border-[#E5EEE7] pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button 
                className="inline-flex h-10 min-w-[206px] items-center justify-between rounded-lg border border-[#DCE9DF] bg-white px-4 text-left" 
                type="button"
              >
                <span>
                  <strong className="block text-sm">2026 여름특강</strong>
                  <span className="block text-[11px] text-[#94A3B8]">2026-07-20 ~ 2026-08-16</span>
                </span>
                <ChevronDown className="size-4 text-[#718096]" />
              </button>
              <div className="inline-flex overflow-hidden rounded-lg border border-[#DCE9DF] bg-white text-[13px] font-medium">
                <button className="bg-[#172033] px-5 py-2.5 text-white" type="button">강의실</button>
                <button className="border-l border-[#DCE9DF] px-5 py-2.5 text-[#718096]" type="button">강사</button>
                <button className="border-l border-[#DCE9DF] px-5 py-2.5 text-[#718096]" type="button">학년</button>
              </div>
              <div className="flex items-center gap-1 text-[13px] font-semibold text-[#526071]">
                <button 
                  aria-label="이전 주"
                  className="flex size-8 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white"
                  type="button"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="px-1">08.03 ~ 08.09</span>
                <button 
                  aria-label="다음 주"
                  className="flex size-8 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white"
                  type="button"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#273548] px-4 text-[13px] font-semibold text-white"
                type="button"
              >
                <Plus className="size-4" />
                수업 등록
              </button>
              <button 
                className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#526071]"
                type="button"
              >
                내보내기
              </button>
              <button 
                aria-label="더보기"
                className="flex size-10 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#526071]"
                type="button"
              >
                <Ellipsis className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {days.map(({ name }, index) => 
                <button 
                  className={`size-8 rounded-full text-[12px] font-semibold 
                  ${index === 0
                    ?
                    "bg-[#273548] text-white"
                    :
                    "bg-[#273548] text-white"
                    }
                  `}
                  key={name}
                  type="button"
                >
                  {name}
                </button>
              )}
              <span className="mx-1 h-8 border-l border-[#DCE9DF]" />
              {["전체", "6층", "5층", "4층", "3층", "다모아"].map((item, index) => 
                <button 
                  className={`h-8 rounded-full border px-3 text-[12px] 
                    ${index === 0 
                      ?
                      "border-[#273548] bg-white font-semibold text-[#273548]"
                      :
                      "border-[#DCE9DF] bg-white text-[#94A3B8]"
                      }
                    `}
                    key={item}
                    type="button"
                  >
                    {item}
                  </button>
                )}
              <span className="mx-1 h-8 border-l border-[#DCE9DF]" />
              {["전체", "수업", "특강", "클리닉", "상시", "시험"].map((item, index) => 
                <button className={`h-8 rounded-full border px-3 text-[12px] 
                  ${index === 0 
                    ?
                    "border-[#273548] bg-white font-semibold text-[#273548]"
                    :
                    "border-[#DCE9DF] bg-white text-[#94A3B8]"
                    }
                  `}
                  key={item} 
                  type="button"
                >
                  {item}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="flex h-9 items-center gap-2 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]">
                <Search className="size-3.5" />
                <span className="sr-only">강사 검색</span>
                <input className="w-28 outline-none placeholder:text-[#94A3B8]" placeholder="강사 검색" />
              </label>
              <button 
                aria-label="목록 보기"
                className="flex size-9 items-center justify-center rounded-lg border border-[#DCE9DF] bg-white text-[#718096]"
                type="button"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>

          <section 
            aria-label="주간 시간표"
            className="min-w-0 max-w-full overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
          >
            <div data-testid="weekly-timetable-scroll" className="max-h-[calc(100dvh-16rem)] max-w-full overflow-auto overscroll-contain">
              <div className="min-w-[2240px]" role="table" aria-label="2026년 8월 첫째 주 시간표">
                <div className="grid grid-cols-[68px_repeat(7,minmax(0,1fr))] border-b border-[#DCE9DF]" role="row">
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
                <div className="grid grid-cols-[68px_repeat(7,minmax(0,1fr))]" role="row">
                  <div className="relative h-[704px] border-r border-[#DCE9DF] bg-[#FCFCFC]">
                    {times.map((time, index) => 
                      <span 
                        className="absolute left-0 w-full -translate-y-1/2 pr-2 text-right text-[10px] text-[#A1ACBA]"
                        key={time}
                        style={{ top: `${index * 52 + 26}px` }}
                      >
                        {time}
                        {time === "12:00" && <small className="ml-0.5 text-[8px]">점심</small>}
                      </span>
                    )}
                  </div>
                  {days.map(({ name, rooms }, dayIndex) => (
                    <div className="border-l border-[#DCE9DF]" key={name}>
                      <div className="grid grid-cols-5 border-b border-[#DCE9DF] bg-[#F3F6F4] text-center text-[10px] font-medium text-[#718096]">
                        {rooms.map((room) => <span className="border-r border-[#DCE9DF] py-1.5 last:border-r-0" key={room}>{room}</span>)}
                      </div>
                      <div
                        data-testid="weekly-timetable-grid"
                        className="grid h-[676px] grid-cols-5 grid-rows-[repeat(26,26px)] bg-white"
                        style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 51px, #E8EFEB 51px, #E8EFEB 52px)" }}
                      >
                        {classItems.filter((item) => item.day === dayIndex).map((item) => 
                          <article 
                            className={`z-10 m-1 border-l-[3px] p-1 text-[10px] font-semibold ${classTone[item.tone]}`}
                            key={`${item.course}-${item.room}-${item.start}`} style={{ gridColumn: item.room + 1, gridRow: `${item.start} / span ${item.duration}` }}
                          >
                            <strong className="block">{item.course}</strong><span className="mt-0.5 block font-medium">{item.teacher}</span>
                          </article>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
