'use client'

import useModal from "@/components/hooks/useModal";
import ScheduleItem from "./ScheduleItem";
import ViewLectureModal from "./modal/ViewLectureModal";

const badgeClassName = {
    정규반: "bg-[#EAF1FA] text-[#1E40AF]",
    특강: "bg-[#F3E8FF] text-[#7E22CE]",
    클리닉: "bg-[#FEF3C7] text-[#92400E]",
};

interface LectureItemData {
    title: string;
    subject: string;
    semester: string;
    type: string;
    grade: string;
    teacher: string;
    classroom: string;
    schedules: readonly string[];
    fee: string;
    feeType: string;
    studentCount: number;
}

export default function LectureItem({ lecture }: { lecture: LectureItemData }) {
    const detailModal = useModal();

    return (
        <>
            <button
                className={`grid grid-cols-15 items-center px-5 min-h-[59px] w-full border-b border-[#F7F8F9] py-2.5 text-left last:border-b-0 hover:bg-[#FAFBFA]`}
                key={lecture.title}
                onClick={detailModal.openModal}
                type="button"
            >
            <span className="col-span-3">
                <strong className="block text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                    {lecture.title}
                </strong>
                <span className="mt-0.5 block text-[11px] leading-[16.5px] text-[#64748B]">
                    {lecture.subject} · {lecture.semester}
                </span>
            </span>

            <span className="col-span-1">
                <span className={`inline-flex h-[22px] items-center rounded-full px-2 text-[11px] leading-[16.5px] font-semibold ${badgeClassName['정규반']}`}>
                    {lecture.type}
                </span>
            </span>
            <span className="col-span-1 text-[12px] text-[#64748B]">{lecture.grade}</span>
            <span className="col-span-2 text-[12px] text-[#64748B]">{lecture.teacher}</span>
            <span className="col-span-1 text-[12px] text-[#64748B]">{lecture.classroom}</span>
            <span className="col-span-3">
                {lecture.schedules.map((schedule: string, i: number) => (
                    <ScheduleItem schedule={schedule} key={i} />
                ))}
            </span>
            <span className="col-span-2 text-right">
                <span className="block text-[12px] leading-[18px] text-[#0F172A]">{lecture.fee}</span>
                <span className="block text-[10px] leading-[15px] text-[#B0B8C1]">{lecture.feeType}</span>
            </span>
            <span className="col-span-2 text-center text-[13px] leading-[19.5px] font-semibold text-[#0F172A]">
                {lecture.studentCount}<span className="text-[11px] font-normal text-[#B0B8C1]">명</span>
            </span>
            </button>

            {detailModal.isModal && <ViewLectureModal closeModal={detailModal.closeModal} />}
        </>
    )
}
