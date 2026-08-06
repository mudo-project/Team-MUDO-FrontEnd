'use client'

import { Calendar } from "@/components/ui/calendar";
import { ko } from "date-fns/locale";
import { Dispatch, SetStateAction, useEffect } from "react";

export default function WorkCalendarModal({ isModal, closeModal, calendarDate, setCalendarDate }: { isModal: boolean, closeModal: () => void; calendarDate: Date | undefined, setCalendarDate: Dispatch<SetStateAction<Date | undefined>> }) {

    useEffect(() => {
        if (isModal) {
            closeModal();
        }
    }, [calendarDate])

    if (!isModal) {
        return;
    }

    return (
        <>
            <div className="shadow-[0_8px_32px_0_rgba(22,34,54,0.13)] absolute border border-[#D8E5DF] bg-white rounded-[12px] p-1 z-1000 left-[-25px]">
                <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={setCalendarDate}
                    locale={ko}
                />
            </div>
            <div
                className="fixed top-0 left-0 z-999 h-screen w-screen"
                onClick={closeModal}
            >
            </div>
        </>
    )
}