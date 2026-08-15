"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { LECTURE_DAY_LABEL } from "../constants";
import { LectureScheduleData } from "../type";

interface LectureScheduleFieldsProps {
    initialSchedules?: LectureScheduleData[];
}

interface LectureScheduleField {
    dayOfWeek: string;
    endTime: string;
    id: number;
    startTime: string;
}

const inputClassName = "h-[39px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none";

const getInitialSchedules = (initialSchedules: LectureScheduleData[]): LectureScheduleField[] => {
    if (initialSchedules.length === 0) {
        return [{ dayOfWeek: "MONDAY", endTime: "", id: 0, startTime: "" }];
    }

    return initialSchedules.map((schedule, index) => ({
        dayOfWeek: schedule.dayOfWeek,
        endTime: schedule.endTime.slice(0, 5),
        id: index,
        startTime: schedule.startTime.slice(0, 5),
    }));
};

export default function LectureScheduleFields({ initialSchedules = [] }: LectureScheduleFieldsProps) {
    const nextId = useRef(initialSchedules.length || 1);
    const [schedules, setSchedules] = useState<LectureScheduleField[]>(() => getInitialSchedules(initialSchedules));

    const addSchedule = () => {
        setSchedules((current) => [
            ...current,
            { dayOfWeek: "MONDAY", endTime: "", id: nextId.current++, startTime: "" },
        ]);
    };

    const changeSchedule = (
        id: number,
        name: "dayOfWeek" | "startTime" | "endTime",
        value: string,
    ) => {
        setSchedules((current) => current.map((schedule) => (
            schedule.id === id ? { ...schedule, [name]: value } : schedule
        )));
    };

    const removeSchedule = (id: number) => {
        setSchedules((current) => current.filter((schedule) => schedule.id !== id));
    };

    return (
        <div className="mt-3.5">
            {schedules.map((schedule) => (
                <div className="mb-2 flex items-center gap-2 last:mb-0" key={schedule.id}>
                    <select
                        aria-label="수업 요일"
                        className={inputClassName}
                        name="dayOfWeek"
                        onChange={(event) => changeSchedule(schedule.id, "dayOfWeek", event.target.value)}
                        value={schedule.dayOfWeek}
                    >
                        {Object.entries(LECTURE_DAY_LABEL).map(([value, label]) => <option key={value} value={value}>{label}요일</option>)}
                    </select>
                    <input
                        aria-label="수업 시작 시간"
                        className={inputClassName}
                        name="startTime"
                        onChange={(event) => changeSchedule(schedule.id, "startTime", event.target.value)}
                        required
                        type="time"
                        value={schedule.startTime}
                    />
                    <input
                        aria-label="수업 종료 시간"
                        className={inputClassName}
                        name="endTime"
                        onChange={(event) => changeSchedule(schedule.id, "endTime", event.target.value)}
                        required
                        type="time"
                        value={schedule.endTime}
                    />
                    <button
                        aria-label="시간표 삭제"
                        className="flex size-9 shrink-0 items-center justify-center rounded-[7px] border border-[#F1D0CE] bg-[#FEF2F2] text-[#C0483F] disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={schedules.length === 1}
                        onClick={() => removeSchedule(schedule.id)}
                        type="button"
                    >
                        <Trash2 className="size-[13px]" strokeWidth={1.5} />
                    </button>
                </div>
            ))}

            <button className="mt-2 flex h-9 items-center gap-1.5 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[12px] text-[#64748B]" onClick={addSchedule} type="button">
                <Plus className="size-3.5" strokeWidth={1.5} />
                시간표 추가
            </button>
        </div>
    );
}
