"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createLectureSchema, CreateLectureFormValues } from "@/lib/lectureSchema";
import { updateLectureAction, LectureActionResult } from "../../actions";
import { LECTURE_CLASS_TYPE_LABEL, LECTURE_DAY_LABEL, LECTURE_FEE_TYPE_LABEL, LECTURE_GRADE_LABEL } from "../../constants";
import { LectureDetailData } from "../../type";

interface EditLectureModalProps {
    closeModal: () => void;
    lecture: LectureDetailData;
    lectureId: number;
    onUpdated: () => void | Promise<void>;
}

const initialState: LectureActionResult = { success: false, message: "" };
const inputClassName = "h-[39px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none";
const labelClassName = "block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]";

export default function EditLectureModal({
    closeModal, lecture, lectureId, onUpdated,
}: EditLectureModalProps) {
    const router = useRouter();
    const schedule = lecture.schedules[0];
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateLectureFormValues>({
        resolver: zodResolver(createLectureSchema),
        mode: "onChange",
        defaultValues: {
            name: lecture.name,
            classType: lecture.classType,
            dayOfWeek: schedule?.dayOfWeek ?? "MONDAY",
            classroomCode: lecture.classroomCode,
            startTime: schedule?.startTime.slice(0, 5) ?? "",
            endTime: schedule?.endTime.slice(0, 5) ?? "",
            grade: lecture.grade ?? "",
            teacherName: lecture.teacherName ?? "",
            subjectName: lecture.subjectName ?? "",
            termName: lecture.termName ?? "",
            feeType: lecture.feeType ?? "",
            feeAmount: lecture.feeAmount?.toString() ?? "",
        },
    });

    const onSubmit = async (data: CreateLectureFormValues) => {
        const formData = new FormData();
        formData.set("name", data.name);
        formData.set("classType", data.classType);
        formData.set("dayOfWeek", data.dayOfWeek);
        formData.set("classroomCode", data.classroomCode);
        formData.set("startTime", `${data.startTime}:00`);
        formData.set("endTime", `${data.endTime}:00`);
        formData.set("grade", data.grade);
        formData.set("teacherName", data.teacherName);
        formData.set("subjectName", data.subjectName);
        formData.set("termName", data.termName);
        formData.set("feeType", data.feeType);
        formData.set("feeAmount", data.feeAmount);

        const response = await updateLectureAction(lectureId, initialState, formData);
        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        closeModal();
        await onUpdated();
        router.refresh();
    };

    return (
        <div className="fixed top-0 left-0 z-1001 flex h-screen w-screen items-center justify-center bg-black/35 p-5" onClick={closeModal}>
            <form className="z-1002 flex max-h-[calc(100dvh-48px)] w-[580px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit(onSubmit)}>
                <header className="flex h-[56px] shrink-0 items-center px-7">
                    <h2 className="text-[16px] font-bold text-[#1D2B3A]">강의 수정</h2>
                    <button aria-label="강의 수정 모달 닫기" className="ml-auto text-[#94A3B8]" onClick={closeModal} type="button"><X className="size-4" strokeWidth={1.5} /></button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
                    <section>
                        <h3 className="text-[12px] font-semibold tracking-[0.6px] text-[#94A3B8]">기본 정보</h3>
                        <div className="mt-3.5">
                            <label className={labelClassName} htmlFor="edit-lecture-name">강의명 *</label>
                            <input {...register("name")} className={inputClassName} id="edit-lecture-name" type="text" />
                            {errors.name?.message && <p className="mt-1 text-[11px] text-[#C0483F]">{errors.name.message}</p>}
                        </div>
                        <div className="mt-3.5 grid grid-cols-2 gap-3">
                            <div><label className={labelClassName} htmlFor="edit-lecture-type">강의 유형 *</label><select {...register("classType")} className={inputClassName} id="edit-lecture-type">{Object.entries(LECTURE_CLASS_TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                            <div><label className={labelClassName} htmlFor="edit-lecture-grade">학년</label><select {...register("grade")} className={inputClassName} id="edit-lecture-grade"><option value="">선택 안 함</option>{Object.entries(LECTURE_GRADE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                        </div>
                        <div className="mt-3.5 grid grid-cols-2 gap-3">
                            <div><label className={labelClassName} htmlFor="edit-lecture-subject">과목</label><input {...register("subjectName")} className={inputClassName} id="edit-lecture-subject" list="edit-subject-options" /></div>
                            <div><label className={labelClassName} htmlFor="edit-lecture-term">학기</label><input {...register("termName")} className={inputClassName} id="edit-lecture-term" list="edit-term-options" /></div>
                        </div>
                        <div className="mt-3.5 grid grid-cols-2 gap-3">
                            <div><label className={labelClassName} htmlFor="edit-lecture-teacher">담당 선생님</label><input {...register("teacherName")} className={inputClassName} id="edit-lecture-teacher" list="edit-teacher-options" /></div>
                            <div><label className={labelClassName} htmlFor="edit-lecture-room">강의실 코드 *</label><input {...register("classroomCode")} className={inputClassName} id="edit-lecture-room" list="edit-room-options" />{errors.classroomCode?.message && <p className="mt-1 text-[11px] text-[#C0483F]">{errors.classroomCode.message}</p>}</div>
                        </div>
                    </section>

                    <section className="mt-5">
                        <h3 className="text-[12px] font-semibold tracking-[0.6px] text-[#94A3B8]">수강료</h3>
                        <div className="mt-3.5 grid grid-cols-2 gap-3">
                            <div><label className={labelClassName} htmlFor="edit-fee-type">수강료 유형</label><select {...register("feeType")} className={inputClassName} id="edit-fee-type"><option value="">선택 안 함</option>{Object.entries(LECTURE_FEE_TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                            <div><label className={labelClassName} htmlFor="edit-fee-amount">금액 (원)</label><input {...register("feeAmount")} className={inputClassName} id="edit-fee-amount" min="0" type="number" />{errors.feeAmount?.message && <p className="mt-1 text-[11px] text-[#C0483F]">{errors.feeAmount.message}</p>}</div>
                        </div>
                    </section>

                    <section className="mt-5">
                        <h3 className="text-[12px] font-semibold tracking-[0.6px] text-[#94A3B8]">시간표 *</h3>
                        <div className="mt-3.5 grid grid-cols-3 gap-2">
                            <select {...register("dayOfWeek")} aria-label="수업 요일" className={inputClassName}>{Object.entries(LECTURE_DAY_LABEL).map(([value, label]) => <option key={value} value={value}>{label}요일</option>)}</select>
                            <input {...register("startTime")} aria-label="수업 시작 시간" className={inputClassName} type="time" />
                            <input {...register("endTime")} aria-label="수업 종료 시간" className={inputClassName} type="time" />
                        </div>
                        {errors.endTime?.message && <p className="mt-1 text-[11px] text-[#C0483F]">{errors.endTime.message}</p>}
                    </section>
                </div>

                <footer className="flex shrink-0 gap-2 px-7 pb-6 pt-2">
                    <button className="h-11 w-1/3 rounded-[8px] border border-[#DCE8E2] bg-white text-[13px] text-[#64748B]" onClick={closeModal} type="button">취소</button>
                    <button className="h-11 w-full rounded-[8px] bg-[#2A3A4A] text-[13px] font-semibold text-white disabled:opacity-50" disabled={isSubmitting} type="submit">{isSubmitting ? "수정 중" : "수정 완료"}</button>
                </footer>
            </form>
        </div>
    );
}
