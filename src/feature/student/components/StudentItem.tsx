"use client";

import useModal from "@/components/hooks/useModal";
import { STUDENT_GRADE_LABEL } from "../constants";
import { StudentListItemData } from "../type";
import ViewStudentModal from "./modal/ViewStudentModal";

interface StudentItemProps {
    student: StudentListItemData;
    index: number;
}

export default function StudentItem({ student, index }: StudentItemProps) {
    const viewStudentModal = useModal();

    return (
        <>
            <button
                className="w-full text-start grid h-[52px] sm:h-[56px] md:h-[63px] grid-cols-9 sm:grid-cols-10 md:grid-cols-15  items-center border-b border-[#F0F3F1] px-2.5 sm:px-3 md:px-[18px] text-[11px] md:text-xs text-[#64748B]"
                data-testid={`student-list-row-${student.studentId}`}
                onClick={viewStudentModal.openModal}
                type="button"
            >
                <p className="col-span-1 text-[#CBD5E1]">{index + 1}</p>
                <div className="col-span-5 md:col-span-6 flex items-center gap-1.5 md:gap-[9px]">
                    <div className="flex size-6 md:size-7 shrink-0 items-center justify-center rounded-full bg-[#D7E8DB] text-[10px] font-semibold text-[#0F172A]">
                        {student.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[12px] md:text-[13px] font-semibold leading-[18px] md:leading-[19.5px] text-[#1D2B3A]">{student.name}</p>
                        <p className="truncate text-[10px] md:text-[11px] leading-[15px] md:leading-[16.5px] text-[#94A3B8]">{student.school ?? "-"}</p>
                    </div>
                </div>
                <p className="col-span-1">{STUDENT_GRADE_LABEL[student.grade]}</p>
                <p className="col-span-2 hidden md:block whitespace-nowrap">{student.phone ?? "-"}</p>
                <p className="col-span-2 hidden md:block whitespace-nowrap">{student.parentPhone ?? "-"}</p>
                <p className="col-span-1 hidden sm:block font-semibold text-[#3D7A6A]">{student.activeEnrollmentCount}개</p>
                <p className="col-span-2 truncate text-[10px] md:text-[11px]">{student.school ?? "-"}</p>
            </button>

            {viewStudentModal.isModal && (
                <ViewStudentModal closeModal={viewStudentModal.closeModal} studentId={student.studentId} />
            )}
        </>
    );
}
