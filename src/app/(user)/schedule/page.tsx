import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";

// 임시로 사용할 타입입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
type EventItem = {
  date: number;
  title: string;
  detail: string;
  color: string;
  background: string;
};

// 임시로 사용할 타입입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
type CalendarDay = {
  day: number;
  muted?: boolean;
  saturday?: boolean;
  selected?: boolean;
  sunday?: boolean;
};

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const calendarDays: CalendarDay[] = [
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 31, muted: true },
  { day: 1, saturday: true },
  { day: 2, sunday: true },
  { day: 3 },
  { day: 4, selected: true },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8, saturday: true },
  { day: 9, sunday: true },
  { day: 10 },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14 },
  { day: 15, saturday: true },
  { day: 16, sunday: true },
  { day: 17 },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22, saturday: true },
  { day: 23, sunday: true },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29, saturday: true },
  { day: 30, sunday: true },
  { day: 31 },
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
  { day: 5, muted: true },
  { day: 6, muted: true },
];

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const events: EventItem[] = [
  { date: 3, title: "2학기 수업 준비 회의", detail: "8월 3일 (월) · 오전 10:00 - 오전 11:30", color: "#4D9560", background: "#EAF3EC" },
  { date: 3, title: "원생 출석 점검", detail: "8월 3일 (월) · 오전 9:00 - 오전 9:30", color: "#D7A83D", background: "#FFF7E7" },
  { date: 10, title: "월간 수납 현황 보고", detail: "8월 10일 (월) · 오후 2:00 - 오후 3:00", color: "#74675F", background: "#F1EEEE" },
  { date: 15, title: "광복절", detail: "8월 15일 (토) · 종일", color: "#B45252", background: "#F9EBE8" },
  { date: 17, title: "전체 교직원 회의", detail: "8월 17일 (월) · 오전 9:00 - 오전 10:00", color: "#172033", background: "#E9EBEF" },
  { date: 18, title: "수학A반 모의고사", detail: "8월 18일 (화) · 오후 2:00 - 오후 4:00", color: "#4D9560", background: "#EAF3EC" },
  { date: 18, title: "영어B반 단어시험", detail: "8월 18일 (화) · 오전 10:00 - 오전 11:00", color: "#D7A83D", background: "#FFF7E7" },
  { date: 20, title: "학부모 상담 주간 시작", detail: "8월 20일 (목) · 오후 1:00 - 오후 6:00", color: "#9A67B6", background: "#F3EAF8" },
  { date: 20, title: "직원 워크샵", detail: "8월 20일 (목) · 오전 9:00 - 오후 5:00", color: "#5B8C6B", background: "#EAF3EC" },
  { date: 20, title: "과학D반 실험수업", detail: "8월 20일 (목) · 오후 3:00 - 오후 5:00", color: "#56A8A8", background: "#E7F5F5" },
  { date: 20, title: "국어C반 논술특강", detail: "8월 20일 (목) · 오후 7:00 - 오후 9:00", color: "#D67F35", background: "#FFF1E6" },
  { date: 21, title: "신규 강사 오리엔테이션", detail: "8월 21일 (금) · 오전 9:00 - 오후 12:00", color: "#DB4B98", background: "#FCEAF4" },
  { date: 25, title: "급여 지급일", detail: "8월 25일 (화) · 종일", color: "#5B8C6B", background: "#EAF3EC" },
  { date: 25, title: "개학식", detail: "8월 25일 (화) · 오전 10:00 - 오전 11:00", color: "#172033", background: "#E9EBEF" },
  { date: 31, title: "방학 종료", detail: "8월 31일 (월) · 종일", color: "#B45252", background: "#F9EBE8" },
];

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

export default function SchedulePage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-y-auto bg-[#FCFCFC] px-5 py-6 text-[#172033] lg:px-6">
      <div className="mx-auto h-full w-full max-w-[1530px]">
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:h-full xl:grid-cols-[minmax(0,1fr)_384px] xl:overflow-hidden">
          <section className="flex min-w-0 flex-col xl:min-h-0" aria-labelledby="schedule-month-title">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button 
                  aria-label="이전 달" 
                  className="flex size-9 items-center justify-center rounded-md text-[#718096]" 
                  type="button"
                >
                  <ChevronLeft className="size-5" strokeWidth={1.8} />
                </button>
                <h1 id="schedule-month-title" className="text-[21px] font-bold tracking-[-0.03em]">2026년 8월</h1>
                <ChevronRight className="size-4 text-[#94A3B8]" strokeWidth={1.8} />
                <button 
                  className="ml-1 h-9 rounded-lg border border-[#DCE9DF] bg-white px-3 text-[12px] font-medium text-[#64748B]"
                  type="button"
                >
                  오늘
                </button>
              </div>
              <button 
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white" 
                type="button"
              >
                <Plus className="size-4" strokeWidth={2.2} />
                일정 추가
              </button>
            </div>

            <section 
              className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
              aria-label="2026년 8월 월간 캘린더"
            >
              <div className="grid grid-cols-7 border-b border-[#DCE9DF] text-center text-[11px] font-semibold text-[#718096]">
                {weekDays.map((weekDay, index) => (
                  <span className={`py-3 ${index === 5 ? "text-[#4D9560]" : ""} ${index === 6 ? "text-[#B45252]" : ""}`} key={weekDay}>{weekDay}</span>
                ))}
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
                {calendarDays.map((calendarDay, index) => {
                  const dayEvents = calendarDay.muted ? [] : events.filter((event) => event.date === calendarDay.day);
                  const visibleEvents = dayEvents.slice(0, 3);
                  return (
                    <div 
                      className="min-h-0 border-b border-r border-[#E5EEE7] p-2 last:border-r-0 [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0" 
                      key={`${calendarDay.day}-${index}`}
                    >
                      <span 
                        className={`flex size-7 items-center justify-center rounded-full text-[12px] font-semibold 
                        ${calendarDay.muted
                          ?
                          "text-[#A1ACBA]"
                          :
                          ""
                        }
                        ${calendarDay.saturday 
                          ?
                          "text-[#4D9560]"
                          :
                          ""
                        } 
                        ${calendarDay.sunday 
                          ?
                          "text-[#B45252]"
                          :
                          ""
                        } 
                        ${calendarDay.selected
                          ?
                          "bg-[#4D9560] text-white"
                          :
                          ""
                        }
                      `}>
                        {calendarDay.day}
                      </span>
                      <div className="mt-2 space-y-1">
                        {visibleEvents.map((event) => (
                          <p 
                            className="truncate rounded px-1.5 py-1 text-[10px] font-medium text-[#344054]" 
                            key={event.title} 
                            style={{ backgroundColor: event.background, borderLeft: `3px solid ${event.color}` }}
                          >
                            {event.title}
                          </p>
                        ))}
                        {dayEvents.length > 3 && <span className="pl-1 text-[10px] text-[#718096]">+{dayEvents.length - 3}개</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </section>

          <section 
            className="flex min-w-0 flex-col rounded-xl border border-[#DCE9DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] xl:min-h-0" 
            aria-label="8월 일정"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold">8월 일정</h2>
              <span className="text-[11px] text-[#718096]">총 15건</span>
            </div>
            <ol className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {events.map((event) => (
                <li className="rounded-lg border-b border-[#E5EEE7] py-2.5 pl-3 last:border-b-0" key={event.title} style={{ borderLeft: `3px solid ${event.color}` }}>
                  <strong className="block break-words text-[13px] font-semibold">{event.title}</strong>
                  <time className="mt-1 block text-[11px] text-[#718096]">{event.detail}</time>
                </li>
              ))}
            </ol>
          </section>
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
