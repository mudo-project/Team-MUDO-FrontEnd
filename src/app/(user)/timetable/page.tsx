import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

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
                className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#526071]"
                type="button"
              >
                시간표 관리
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative">
                <span className="sr-only">요일 선택</span>
                <select
                  className="h-9 min-w-24 appearance-none rounded-lg border border-[#DCE9DF] bg-white px-3 pr-8 text-[12px] font-medium text-[#526071] outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>요일 선택</option>
                  {days.map(({ name }) => <option key={name} value={name}>{name}요일</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-[#718096]" />
              </label>
              <label className="relative">
                <span className="sr-only">층 선택</span>
                <select
                  className="h-9 min-w-24 appearance-none rounded-lg border border-[#DCE9DF] bg-white px-3 pr-8 text-[12px] font-medium text-[#526071] outline-none"
                  defaultValue="전체"
                >
                  <option value="전체">전체 층</option>
                  <option value="6층">6층</option>
                  <option value="5층">5층</option>
                  <option value="4층">4층</option>
                  <option value="3층">3층</option>
                  <option value="다모아">다모아</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-[#718096]" />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex h-9 items-center gap-2 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] text-[#718096]">
                <Search className="size-3.5" />
                <span className="sr-only">강사 검색</span>
                <input className="w-28 outline-none placeholder:text-[#94A3B8]" placeholder="강사 검색" />
              </label>
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
                  <div className="relative h-[808px] border-r border-[#DCE9DF] bg-[#FCFCFC]">
                    {times.map((time, index) => 
                      <span 
                        className="absolute left-0 w-full -translate-y-1/2 pr-2 text-right text-[10px] text-[#A1ACBA]"
                        key={time}
                        style={{ top: `${index * 52 + 26}px` }}
                      >
                        {time}
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
                        className="grid h-[780px] grid-cols-5 grid-rows-[repeat(30,26px)] bg-white"
                        style={{
                          backgroundImage: "repeating-linear-gradient(to right, transparent 0, transparent calc(20% - 1px), #E8EFEB calc(20% - 1px), #E8EFEB 20%), repeating-linear-gradient(to bottom, transparent 0, transparent 51px, #E8EFEB 51px, #E8EFEB 52px)",
                        }}
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
