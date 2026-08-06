'use client'

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import WorkCalendarModal from "./modals/WorkCalendarModal";
import useModal from "@/components/hooks/useModal";

export default function WorkspaceDailyHeader() {
    const calendarModal = useModal();
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date())

    const openCalendar = () => {
        calendarModal.openModal();
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
        <header className="border-b border-[#E9ECF1] px-2 pt-3 pb-3 sm:px-3 md:px-4 lg:px-6 lg:pt-3.5 lg:pb-[15px]">
            <div className="flex h-6 items-center gap-0.5 sm:gap-1 md:h-7 lg:gap-1.5">
                <button className="px-0.5 py-0.5 sm:px-1 lg:px-1.5" onClick={prevDate}><ChevronLeft className="h-[14px] w-[14px] sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" /></button>
                <div className="relative">
                    <button onClick={openCalendar} className="px-0.5 py-0.5 text-[12px] leading-5 font-bold sm:px-1 sm:text-[14px] md:text-[15px] md:leading-6 lg:text-[16px]">
                        {calendarDate && (format(calendarDate, 'yyyy년 MM월 dd일 (E)', { locale: ko }))}
                    </button>
                    <WorkCalendarModal isModal={calendarModal.isModal} closeModal={calendarModal.closeModal} calendarDate={calendarDate} setCalendarDate={setCalendarDate} />
                </div>
                <button className="px-0.5 py-0.5 sm:px-1 lg:px-1.5" onClick={nextDate}><ChevronRight className="h-[14px] w-[14px] sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" /></button>
            </div>
            <p className="h-[18px] pl-0.5 pt-0.5 text-[10px] leading-[16px] text-[#B5BDC8] sm:text-[11px] lg:h-5 lg:text-[12px] lg:leading-[18px]">업무 7건</p>
        </header>
    )
}
