"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getLectureDetailAction } from "../../actions";
import { LECTURE_CLASS_TYPE_LABEL, LECTURE_DAY_LABEL, LECTURE_FEE_TYPE_LABEL, LECTURE_GRADE_LABEL } from "../../constants";
import { LectureDetailData } from "../../type";
import LectureDeleteButton from "../LectureDeleteButton";
import LectureUpdateButton from "../LectureUpdateButton";

interface ViewLectureModalProps {
    closeModal: () => void;
    lectureId: number;
}

export default function ViewLectureModal({ closeModal, lectureId }: ViewLectureModalProps) {
    const [detail, setDetail] = useState<LectureDetailData>();
    const [error, setError] = useState("");

    const refreshLecture = async () => {
        const response = await getLectureDetailAction(lectureId);
        if (response.success) {
            setDetail(response.data);
            setError("");
            return;
        }

        setError(response.message);
    };

    useEffect(() => {
        let isActive = true;

        const loadDetail = async () => {
            const response = await getLectureDetailAction(lectureId);
            if (!isActive) return;

            if (response.success) setDetail(response.data);
            else setError(response.message);
        };

        void loadDetail();
        return () => { isActive = false; };
    }, [lectureId]);

    return (
        <div className="fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-[#162236]/40 p-6" onClick={closeModal}>
            <article aria-labelledby="lecture-detail-title" aria-modal="true" className="relative z-1000 max-h-[calc(100dvh-48px)] w-[560px] overflow-y-auto rounded-[12px] bg-white shadow-[0_12px_32px_rgba(22,34,54,0.18)]" onClick={(event) => event.stopPropagation()} role="dialog">
                {!detail && !error && <p className="px-6 py-12 text-center text-[13px] text-[#94A3B8]">강의 정보를 불러오는 중입니다.</p>}
                {error && <p className="px-6 py-12 text-center text-[13px] text-[#C0483F]">{error}</p>}
                {detail && (
                    <>
                        <header className="flex items-start px-6 pt-[18px] pb-4">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="rounded-full bg-[#EAF1FA] px-2 py-0.5 text-[11px] font-medium text-[#1E40AF]">{LECTURE_CLASS_TYPE_LABEL[detail.classType]}</span>
                                    {detail.grade && <span className="rounded-full bg-[#F4F5F2] px-2 py-0.5 text-[11px] font-medium text-[#64748B]">{LECTURE_GRADE_LABEL[detail.grade]}</span>}
                                </div>
                                <h2 className="pt-1 text-[18px] leading-[27px] font-bold text-[#0F172A]" id="lecture-detail-title">{detail.name}</h2>
                            </div>
                            <div className="ml-auto flex items-center gap-1.5">
                                <LectureUpdateButton lecture={detail} lectureId={lectureId} onUpdated={refreshLecture} />
                                <LectureDeleteButton closeModal={closeModal} lectureId={lectureId} />
                                <button aria-label="강의 상세 모달 닫기" className="flex size-[18px] items-center justify-center text-[#94A3B8]" onClick={closeModal} type="button"><X className="size-[18px]" strokeWidth={1.5} /></button>
                            </div>
                        </header>

                        <div className="px-6 pt-5 pb-7">
                            <section>
                                <h3 className="text-[11px] font-semibold tracking-[0.55px] text-[#94A3B8]">기본 정보</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-3.5">
                                    {[ ["과목", detail.subjectName], ["학기", detail.termName], ["담당 선생님", detail.teacherName], ["강의실", `${detail.classroomName} (${detail.classroomCode})`], ["수강료 유형", detail.feeType ? LECTURE_FEE_TYPE_LABEL[detail.feeType] : null], ["수강료", detail.feeAmount === null ? null : `${detail.feeAmount.toLocaleString()}원`] ].map(([label, value]) => (
                                        <div key={label}><p className="text-[11px] text-[#94A3B8]">{label}</p><p className="pt-[3px] text-[13px] font-medium text-[#0F172A]">{value || "-"}</p></div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-[22px]">
                                <h3 className="text-[11px] font-semibold tracking-[0.55px] text-[#94A3B8]">시간표</h3>
                                {detail.schedules.map((schedule) => (
                                    <div className="mt-3 flex w-full items-center gap-3 rounded-[8px] bg-[#F7FAF8] px-3.5 py-2.5" key={`${schedule.dayOfWeek}-${schedule.startTime}`}>
                                        <strong className="w-7 text-center text-[13px] text-[#0F172A]">{LECTURE_DAY_LABEL[schedule.dayOfWeek]}</strong>
                                        <p className="text-[13px] text-[#64748B]">{schedule.startTime} ~ {schedule.endTime}</p>
                                    </div>
                                ))}
                            </section>

                            <section className="mt-[22px]">
                                <h3 className="text-[11px] font-semibold tracking-[0.55px] text-[#94A3B8]">수강생 <strong className="font-bold text-[#0F172A]">{detail.students.length}명</strong></h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {detail.students.length === 0 && <p className="text-[12px] text-[#94A3B8]">수강생이 없습니다.</p>}
                                    {detail.students.map((student) => (
                                        <div className="flex h-[52px] items-center gap-2 rounded-[8px] bg-[#F4F5F2] px-3 py-2" key={student.id}>
                                            <span className="flex size-[26px] items-center justify-center rounded-full bg-[#D7E8DB] text-[11px] font-semibold text-[#0F172A]">{student.name.slice(0, 1)}</span>
                                            <div><p className="text-[13px] font-medium text-[#0F172A]">{student.name}</p><p className="text-[11px] text-[#94A3B8]">{LECTURE_GRADE_LABEL[student.grade]}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <p className="mt-[22px] text-[11px] text-[#CBD5E1]">등록일시 {detail.createdAt.slice(0, 10)}</p>
                        </div>
                    </>
                )}
            </article>
        </div>
    );
}
