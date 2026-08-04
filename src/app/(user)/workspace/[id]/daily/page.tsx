'use client'

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";


const columns = [
    {
        title: "대기",
        count: 2,
        dotColor: "bg-[#BCC3CF]",
        badgeClass: "bg-[#F3F5F8] text-[#AAB2C0]",
        badgeDot: "bg-[#CBD2DC]",
        cards: [
            { title: "9월 시간표 초안 작성adfafdadsfadsfadfadfadfadfasfdsafdsadfadfafdfadfadfadfadfadfadfadsfsafdaf", owner: "김지", date: "~08.10" },
            { title: "교사 회의 자료 준비 (8/4)", owner: "정다", date: "~08.04" },
        ],
    },
    {
        title: "진행중",
        count: 3,
        dotColor: "bg-[#E0B72B]",
        badgeClass: "bg-[#FFF8D9] text-[#C69D13]",
        badgeDot: "bg-[#E1B72A]",
        cards: [
            { title: "8월 원생 청구서 발송", owner: "정다", date: "~08.07", comments: "1/2" },
            { title: "성적 데이터 7월분 엑셀 정리", owner: "윤해", date: "~08.05", comments: "1/2" },
            { title: "여름방학 특강 수강생 명단 취합", owner: "김지", date: "~08.03", comments: "1/2" },
        ],
    },
    {
        title: "완료",
        count: 1,
        dotColor: "bg-[#9CA9BD]",
        badgeClass: "bg-[#EEF1F5] text-[#7F8CA0]",
        badgeDot: "bg-[#9CA9BD]",
        cards: [{ title: "강의실 환경 점검 체크리스트 작성", owner: "정다", date: "~08.03" }],
    },
];

export default function Page() {
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date())

    const openCalendar = () => {

    }

    const prevDate = () => {
        if (calendarDate) {
            const newDate = new Date(calendarDate);
            setCalendarDate(new Date(newDate.setDate(newDate.getDate() - 1)))
        }
    }

    const nextDate = () => {
        if (calendarDate) {
            const newDate = new Date(calendarDate);
            setCalendarDate(new Date(newDate.setDate(newDate.getDate() + 1)))
        }
    }



    return (
        <main className="min-h-screen bg-[#FCFDFE] text-[#202A3C]">
            <header className="border-b border-[#E9ECF1] px-5 pt-4 pb-3">
                <div className="flex gap-4">
                    <button onClick={prevDate}><ChevronLeft /></button>
                    <button onClick={openCalendar} className="font-semibold">{calendarDate && (format(calendarDate, 'yyyy년 MM월 dd일 (E)', { locale: ko }))}</button>
                    <button onClick={nextDate}><ChevronRight /></button>
                </div>
                {/* <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={setCalendarDate}
                    locale={ko}
                /> */}
                <p className="mt-2 text-[13px] text-[#B5BDC8]">업무 7건</p>
            </header>

            <section className="px-5 py-5">
                <div className="grid grid-cols-3 gap-4">
                    {columns.map((column) => (
                        <section className="w-full" key={column.title}>
                            <div className="mb-3 flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${column.dotColor}`} />
                                <h2 className="text-[13px] font-semibold">{column.title}</h2>
                                <span className="rounded-full bg-[#F0F2F5] px-2 py-0.5 text-[11px] text-[#A5ADBA]">
                                    {column.count}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {column.cards.map((card) => (
                                    <article
                                        className="min-h-26.5 w-full rounded-[9px] border border-[#DEE2E8] bg-white px-4 py-3"
                                        key={card.title}
                                    >
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] leading-none ${column.badgeClass}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${column.badgeDot}`} />
                                            {column.title}
                                        </span>
                                        <h3 className="mt-3 text-[14px] font-semibold wrap-break-word">{card.title}</h3>
                                        <div className="mt-3 flex items-center text-[11px] text-[#AEB6C3]">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF1F4] text-[7px] font-semibold text-[#515B6C]">
                                                {card.owner}
                                            </span>
                                            <span className="ml-2">{card.date}</span>
                                            <span className="ml-auto">◌ card?.comments</span>
                                        </div>
                                    </article>
                                ))}

                                <button className="flex h-9 w-full items-center rounded-[8px] border border-dashed border-[#E1E5EA] px-4 text-[13px] text-[#C2C8D1]">
                                    <span className="mr-2 text-lg font-light">＋</span> 업무 추가
                                </button>
                            </div>
                        </section>
                    ))}
                </div>

                <section className="mt-5 border-t border-dashed border-[#E5E8ED] pt-5">
                    <div className="flex items-center gap-2 text-[13px]">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#C5CBD4] text-[9px] text-[#AAB2BD]">·</span>
                        <h2 className="font-semibold text-[#7E8795]">지연</h2>
                        <span className="rounded-full bg-[#F0F2F5] px-2 py-0.5 text-[11px] text-[#A5ADBA]">1</span>
                        <p className="text-[12px] text-[#C1C7D0]">기한이 지난 업무입니다. 상태를 업데이트하거나 완료 처리해주세요.</p>
                    </div>

                    <article className="mt-3 h-[107px] w-[247px] rounded-[9px] border border-[#DEE2E8] bg-white px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF0F3] px-2 py-1 text-[11px] leading-none text-[#D45D76]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#DF6C82]" /> 지연
                        </span>
                        <h3 className="mt-3 text-[14px] font-semibold tracking-[-0.015em]">방학 중 교실 냉방 스케줄 조정</h3>
                        <div className="mt-3 flex items-center text-[11px] text-[#AEB6C3]">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF1F4] text-[7px] font-semibold text-[#515B6C]">윤해</span>
                            <span className="ml-2">~08.05</span>
                        </div>
                    </article>
                </section>
            </section>
        </main>
    );
}
