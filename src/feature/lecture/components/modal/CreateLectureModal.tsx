"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createLectureAction, LectureActionResult } from "../../actions";
import { LECTURE_CLASS_TYPE_LABEL, LECTURE_FEE_TYPE_LABEL, LECTURE_GRADE_LABEL } from "../../constants";
import { CreateLectureData, LectureTermData } from "../../type";
import { createLectureSchema, CreateLectureFormValues } from "@/lib/lectureSchema";
import LectureScheduleFields from "../LectureScheduleFields";

interface CreateLectureModalProps {
    classrooms: string[];
    closeModal: () => void;
    subjects: string[];
    teachers: string[];
    terms: LectureTermData[];
}

const initialState: LectureActionResult<CreateLectureData> = { success: false, message: "" };
const inputClassName = "h-[39px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#0F172A] outline-none";
const labelClassName = "block pb-[5px] text-[12px] leading-[18px] font-medium text-[#64748B]";

export default function CreateLectureModal({ classrooms, closeModal, subjects, teachers, terms }: CreateLectureModalProps) {
    const router = useRouter();
    const [formElement, setFormElement] = useState<HTMLFormElement | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateLectureFormValues>({
        resolver: zodResolver(createLectureSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            classType: "CLASS",
            classroomCode: "",
            grade: "HIGH_1",
            teacherName: "",
            subjectName: "",
            termName: "",
            feeType: "PER_MONTH",
            feeAmount: "",
        },
    });

    const onSubmit = async () => {
        if (!formElement) return;

        const formData = new FormData(formElement);

        const response = await createLectureAction(initialState, formData);
        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        closeModal();
        router.push('/lecture');
    };

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45" onClick={closeModal}>
            <form className="fixed top-1/2 left-1/2 z-1000 flex  max-h-[450px] md:max-h-[550px] w-[90%] sm:w-4/5 md:w-[580px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)]" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit(onSubmit)} ref={setFormElement}>
                <header className="flex shrink-0 items-center px-7 pt-[22px] pb-[18px]">
                    <h2 className="text-[15px] sm:text-base md:text-[17px] font-bold text-[#0F172A]">강의 등록</h2>
                    <button aria-label="강의 등록 모달 닫기" className="ml-auto text-[#94A3B8]" onClick={closeModal} type="button"><X className="size-[18px]" strokeWidth={1.5} /></button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
                    <section>
                        <h3 className="text-[12px] font-semibold tracking-[0.6px] text-[#94A3B8]">기본 정보</h3>
                        <div className="pt-3.5">
                            <label className={labelClassName} htmlFor="lecture-name">강의명 *</label>
                            <input {...register("name")} className={inputClassName} id="lecture-name" placeholder="예: 고1 수학 정규반" type="text" />
                            {errors.name?.message && <p className="mt-1 text-[11px] text-[#C0483F]">{errors.name.message}</p>}
                        </div>
                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full"><label className={labelClassName} htmlFor="lecture-type">강의 유형 *</label><select {...register("classType")} className={inputClassName} id="lecture-type">{Object.entries(LECTURE_CLASS_TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                            <div className="w-full"><label className={labelClassName} htmlFor="lecture-grade">학년</label><select {...register("grade")} className={inputClassName} id="lecture-grade"><option value="">선택 안 함</option>{Object.entries(LECTURE_GRADE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                        </div>
                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full"><label className={labelClassName} htmlFor="lecture-subject">과목</label><input {...register("subjectName")} className={inputClassName} id="lecture-subject" list="lecture-subject-options" /><datalist id="lecture-subject-options">{subjects.map((subject) => <option key={subject} value={subject} />)}</datalist></div>
                            <div className="w-full"><label className={labelClassName} htmlFor="lecture-term">학기</label><input {...register("termName")} className={inputClassName} id="lecture-term" list="lecture-term-options" /><datalist id="lecture-term-options">{terms.map((term) => <option key={term.termId} value={term.termName} />)}</datalist></div>
                        </div>
                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full"><label className={labelClassName} htmlFor="lecture-teacher">담당 선생님</label><input {...register("teacherName")} className={inputClassName} id="lecture-teacher" list="lecture-teacher-options" /><datalist id="lecture-teacher-options">{teachers.map((teacher) => <option key={teacher} value={teacher} />)}</datalist></div>
                            <div className="w-full"><label className={labelClassName} htmlFor="lecture-room">강의실 코드 *</label><input {...register("classroomCode")} className={inputClassName} id="lecture-room" list="lecture-room-options" /><datalist id="lecture-room-options">{classrooms.map((classroom) => <option key={classroom} value={classroom} />)}</datalist>{errors.classroomCode?.message && <p className="mt-1 text-[11px] text-[#C0483F]">{errors.classroomCode.message}</p>}</div>
                        </div>
                    </section>

                    <section className="mt-[18px]">
                        <h3 className="text-[12px] font-semibold tracking-[0.6px] text-[#94A3B8]">수강료</h3>
                        <div className="mt-3.5 flex gap-3">
                            <div className="w-full"><label className={labelClassName} htmlFor="fee-type">수강료 유형</label><select {...register("feeType")} className={inputClassName} id="fee-type"><option value="">선택 안 함</option>{Object.entries(LECTURE_FEE_TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                            <div className="w-full"><label className={labelClassName} htmlFor="fee-amount">금액 (원)</label><input {...register("feeAmount")} className={inputClassName} id="fee-amount" min="0" placeholder="300000" type="number" />{errors.feeAmount?.message && <p className="mt-1 text-[11px] text-[#C0483F]">{errors.feeAmount.message}</p>}</div>
                        </div>
                    </section>

                    <section className="mt-[18px]">
                        <h3 className="text-[12px] font-semibold tracking-[0.6px] text-[#94A3B8]">시간표 *</h3>
                        <LectureScheduleFields />
                    </section>
                </div>

                <footer className="flex shrink-0 gap-2 px-7 pb-6">
                    <button className="h-11 w-full rounded-[8px] border border-[#DCE8E2] bg-white text-[13px] text-[#64748B]" onClick={closeModal} type="button">취소</button>
                    <button className="h-11 w-full rounded-[8px] bg-[#2A3A4A] text-[13px] font-semibold text-white disabled:opacity-50" disabled={isSubmitting} type="submit">{isSubmitting ? "등록 중" : "강의 등록"}</button>
                </footer>
            </form>
        </div>
    );
}
