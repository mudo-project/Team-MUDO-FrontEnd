"use client";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import AddStudentLectureModal from "./AddStudentLectureModal";
import UpdateStudentModal from "./UpdateStudentModal";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { getStudentDetailAction } from "../../actions";
import { StudentDetailData } from "../../type";
import { STUDENT_GRADE_LABEL } from "../../constants";
import StudentDeleteButton from "../StudentDeleteButton";
import StudentUpdateButton from "../StudentUpdateButton";


export default function ViewStudentModal({ closeModal, studentId }: { closeModal: () => void; studentId: number }) {
    const addLectureModal = useModal();
    const endLectureModal = useModal();
    const [studentState, setStudentState] = useState<{
        student?: StudentDetailData;
        error: string;
        isLoading: boolean;
    }>({
        student: undefined,
        error: "",
        isLoading: true,
    });

    const { student, error, isLoading } = studentState;

    const refreshStudent = async () => {
        const response = await getStudentDetailAction(studentId);

        if (response.success) {
            setStudentState({ student: response.data, error: "", isLoading: false });
            return;
        }

        setStudentState((current) => ({
            ...current,
            error: response.message,
            isLoading: false,
        }));
    };


    useEffect(() => {
        let isActive = true;

        const loadStudent = async () => {
            setStudentState({ student: undefined, error: "", isLoading: true });

            const response = await getStudentDetailAction(studentId);
            if (!isActive) return;

            if (response.success) {
                setStudentState({ student: response.data, error: "", isLoading: false });
            } else {
                setStudentState({ student: undefined, error: response.message, isLoading: false });
            }
        };

        loadStudent();

        return () => {
            isActive = false;
        };
    }, [studentId]);

    if (isLoading) {
        return (
            <div></div>
        )
    }

    if (error) {
        return (
            <div>{error || '네트워크 오류가 발생했습니다.'} 잠시후 다시 시도해주세요.</div>
        )
    }

    return (
        <div className="fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black/35" onClick={closeModal}>
            <section className="relative z-1000 w-[500px] overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()}>
                <header className="flex items-start border-b border-[#DCE8E2] px-6 pt-5 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[#D7E8DB] text-[14px] font-semibold tracking-[-0.28px] text-[#0F172A]">
                            {student?.name.slice(0, 2)}
                        </span>
                        <div>
                            <h2 className="text-[17px] leading-[25.5px] font-bold text-[#1D2B3A]">
                                {student?.name}
                            </h2>
                            <p className="pt-0.5 text-[12px] leading-[18px] text-[#64748B]">
                                {student?.school ?? "학교 미등록"} · {STUDENT_GRADE_LABEL[student?.grade || 'ELEMENTARY_1']}
                            </p>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        <StudentUpdateButton refreshStudent={refreshStudent} student={student} studentId={studentId} />
                        <StudentDeleteButton studentId={studentId} closeModal={closeModal} />
                        <button aria-label="학생 상세 모달 닫기" className="px-1.5 py-0.5 text-[20px] leading-5 text-[#94A3B8]" onClick={closeModal} type="button">
                            ×
                        </button>
                    </div>
                </header>

                <section className="border-b border-[#F0F3F1] px-6 py-5">
                    <h3 className="text-[11px] leading-[16.5px] font-semibold tracking-[0.55px] text-[#94A3B8]">
                        기본 정보
                    </h3>
                    <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2.5">
                        <div>
                            <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">전화번호</p>
                            <p className="mt-[3px] text-[13px] leading-[19.5px] font-medium text-[#1D2B3A]">{student?.phone ?? "-"}</p>
                        </div>
                        <div>
                            <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">학부모 연락처</p>
                            <p className="mt-[3px] text-[13px] leading-[19.5px] font-medium text-[#1D2B3A]">{student?.parentPhone ?? "-"}</p>
                        </div>
                        <div>
                            <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">학교</p>
                            <p className="mt-[3px] text-[13px] leading-[19.5px] font-medium text-[#1D2B3A]">{student?.school ?? "-"}</p>
                        </div>
                        <div>
                            <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">학년</p>
                            <p className="mt-[3px] text-[13px] leading-[19.5px] font-medium text-[#1D2B3A]">{STUDENT_GRADE_LABEL[student?.grade || 'ELEMENTARY_1']}</p>
                        </div>
                        <div>
                            <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">특이사항</p>
                            <p className="mt-[3px] text-[13px] leading-[19.5px] font-medium text-[#1D2B3A]">{student?.note ?? "-"}</p>
                        </div>
                    </div>
                </section>

                <section className="px-6 pt-5 pb-6 min-h-40">
                    <h3 className="text-[11px] leading-[16.5px] font-semibold tracking-[0.55px] text-[#94A3B8]">
                        수강 강의
                    </h3>
                    {student?.enrollments.length === 0 ? (
                        <p className="mt-3 rounded-[10px] border border-[#E8F0EB] bg-[#F7FAF8] px-3.5 py-3 text-center text-xs text-[#94A3B8]">수강 중인 강의가 없습니다.</p>
                    ) : (
                        student?.enrollments.map((enrollment) => (
                            <div className="mt-3 flex items-center justify-between rounded-[10px] border border-[#E8F0EB] bg-[#F7FAF8] px-3.5 py-3" key={enrollment.enrollmentId}>
                                <div>
                                    <p className="text-[13px] leading-[19.5px] font-semibold text-[#1D2B3A]">{enrollment.lectureName}</p>
                                    <p className="pt-0.5 text-[11px] leading-[16.5px] text-[#64748B]">{enrollment.teacherName ?? "담당자 미등록"} · {enrollment.enrolledAt}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="rounded-full bg-[#D1EAE4] px-2 py-[3px] text-[10px] leading-[15px] font-semibold text-[#3D7A6A]">수강중</span>
                                    <button className="rounded-[6px] border border-[#DCE8E2] bg-white px-2 py-1 text-[11px] leading-[16.5px] text-[#64748B]" onClick={endLectureModal.openModal} type="button">수강 종료</button>
                                </div>
                            </div>
                        ))
                    )}
                    <button className="mt-2 flex h-[43px] w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#DCE8E2] text-[13px] leading-[19.5px] font-medium text-[#3D7A6A]" onClick={addLectureModal.openModal} type="button">
                        <span className="text-[16px] leading-none">+</span>
                        수강 등록
                    </button>
                </section>
            </section>


            {addLectureModal.isModal && (
                <AddStudentLectureModal closeModal={addLectureModal.closeModal} />
            )}
            {endLectureModal.isModal && (
                <TwoButtonModal
                    activeModal={endLectureModal.activeModal}
                    closeModal={endLectureModal.closeModal}
                    content="해당 강의 수강을 종료하시겠습니까?"
                    title="수강 종료"
                />
            )}
        </div>
    );
}
