"use client";

import useModal from "@/components/hooks/useModal";
import { LECTURE_CLASS_TYPE_LABEL, LECTURE_DAY_LABEL, LECTURE_GRADE_LABEL } from "../constants";
import { LectureListItemData } from "../type";
import ScheduleItem from "./ScheduleItem";
import ViewLectureModal from "./modal/ViewLectureModal";

const badgeClassName = {
    CLASS: "bg-[#EAF1FA] text-[#1E40AF]",
    SPECIAL: "bg-[#F3E8FF] text-[#7E22CE]",
    CLINIC: "bg-[#FEF3C7] text-[#92400E]",
    STANDING: "bg-[#E8F5E9] text-[#2E7D32]",
    EXAM: "bg-[#FDECEC] text-[#C0483F]",
};

export default function LectureItem({ lecture }: { lecture: LectureListItemData }) {
    const detailModal = useModal();

    return (
        <>
            <button className="grid min-h-[52px] md:min-h-[56px] lg:min-h-[59px] w-full grid-cols-9 md:grid-cols-13 items-center border-b border-[#F7F8F9] px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-2.5 text-left last:border-b-0 hover:bg-[#FAFBFA]" onClick={detailModal.openModal} type="button">
                <span className="col-span-3">
                    <strong className="block text-[12px] md:text-[13px] leading-[19.5px] font-medium text-[#0F172A]">{lecture.name}</strong>
                    <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#64748B]">{lecture.subjectName ?? "-"} · {lecture.termName ?? "-"}</span>
                </span>
                <span className="col-span-2 sm:col-span-1"><span className={`inline-flex h-[20px] md:h-[21px] lg:h-[22px] items-center rounded-full px-1.5 md:px-2 lg:px-2 text-[11px] font-semibold ${badgeClassName[lecture.classType]}`}>{LECTURE_CLASS_TYPE_LABEL[lecture.classType]}</span></span>
                <span className="col-span-1 text-[11px] md:text-[12px] text-[#64748B]">{lecture.grade ? LECTURE_GRADE_LABEL[lecture.grade] : "-"}</span>
                <span className="col-span-2 text-[11px] md:text-[12px] text-[#64748B]">{lecture.teacherName ?? "-"}</span>
                <span className="col-span-1 text-[11px] md:text-[12px] text-[#64748B] md:block hidden">{lecture.classroomName || lecture.classroomCode}</span>
                <span className="col-span-3 md:block hidden">
                    {lecture.schedules.map((schedule) => <ScheduleItem key={`${schedule.dayOfWeek}-${schedule.startTime}`} schedule={`${LECTURE_DAY_LABEL[schedule.dayOfWeek]} ${schedule.startTime}~${schedule.endTime}`} />)}
                </span>
                <span className="col-span-2 text-center text-[12px] md:text-[13px] font-semibold text-[#0F172A] sm:block hidden">{lecture.studentCount}<span className="text-[11px] font-normal text-[#B0B8C1]">명</span></span>
            </button>

            {detailModal.isModal && <ViewLectureModal closeModal={detailModal.closeModal} lectureId={lecture.id} />}
        </>
    );
}
