"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createStudentSchema, CreateStudentFormValues } from "@/lib/studentSchema";
import { createStudentAction } from "../../actions";

const inputClassName =
    "mt-[5px] h-[40px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] text-[#1D2B3A] outline-none placeholder:text-[#1D2B3A]/50";

export default function CreateStudentModal({ closeModal }: { closeModal: () => void }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateStudentFormValues>({
        resolver: zodResolver(createStudentSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            grade: "MIDDLE_1",
            school: "",
            phone: "",
            parentPhone: "",
            note: "",
        },
    });

    const onSubmit = async (data: CreateStudentFormValues) => {
        try {
            const response = await createStudentAction({
                name: data.name,
                grade: data.grade,
                school: data.school || undefined,
                phone: data.phone || undefined,
                parentPhone: data.parentPhone || undefined,
                note: data.note || undefined,
            });

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            closeModal();
            router.refresh();
        } catch {
            toast.error("네트워크 연결이 원활하지 않습니다.");
        }
    };

    return (
        <div className="fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black/35 p-5" onClick={closeModal}>
            <form
                className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(22,34,54,0.18)] md:w-3/5 lg:w-[560px]"
                onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit(onSubmit)}>
                <header className="shrink-0 px-7 pt-7 pb-3">
                    <h2 className="text-[16px] leading-6 font-bold text-[#1D2B3A]">
                        원생 등록
                    </h2>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
                    <div className="flex w-full flex-col gap-[13px]">
                        <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                            이름 <span aria-hidden="true">*</span>
                            <input
                                {...register("name")}
                                className={inputClassName}
                                maxLength={50}
                                placeholder="홍길동"
                                type="text"
                            />
                            {errors.name?.message && <span className="mt-1 block text-[11px] text-red-500">{errors.name.message}</span>}
                        </label>

                        <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학교
                            <input
                                {...register("school")}
                                className={inputClassName}
                                maxLength={100}
                                placeholder="서울중학교"
                                type="text"
                            />
                            {errors.school?.message && <span className="mt-1 block text-[11px] text-red-500">{errors.school.message}</span>}
                        </label>

                        <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학생 연락처
                            <input
                                {...register("phone")}
                                className={inputClassName}
                                maxLength={30}
                                placeholder="010-0000-0000"
                                type="tel"
                            />
                            {errors.phone?.message && <span className="mt-1 block text-[11px] text-red-500">{errors.phone.message}</span>}
                        </label>

                        <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학부모 연락처
                            <input
                                {...register("parentPhone")}
                                className={inputClassName}
                                maxLength={30}
                                placeholder="010-0000-0000"
                                type="tel"
                            />
                            {errors.parentPhone?.message && <span className="mt-1 block text-[11px] text-red-500">{errors.parentPhone.message}</span>}
                        </label>

                        <label className="relative text-[12px] leading-[18px] font-medium text-[#64748B]">
                            학년 <span aria-hidden="true">*</span>
                            <select
                                {...register("grade")}
                                className="mt-[5px] h-[38px] w-full appearance-none rounded-[8px] border border-[#DCE8E2] bg-white px-4 text-[13px] text-[#1D2B3A] outline-none"
                            >
                                <option value="ELEMENTARY_1">초1</option>
                                <option value="ELEMENTARY_2">초2</option>
                                <option value="ELEMENTARY_3">초3</option>
                                <option value="ELEMENTARY_4">초4</option>
                                <option value="ELEMENTARY_5">초5</option>
                                <option value="ELEMENTARY_6">초6</option>
                                <option value="MIDDLE_1">중1</option>
                                <option value="MIDDLE_2">중2</option>
                                <option value="MIDDLE_3">중3</option>
                                <option value="HIGH_1">고1</option>
                                <option value="HIGH_2">고2</option>
                                <option value="HIGH_3">고3</option>
                                <option value="RETAKE">재수</option>
                            </select>
                            <ChevronDown
                                aria-hidden="true"
                                className="pointer-events-none absolute right-3 bottom-[13px] size-3 text-[#64748B]"
                                strokeWidth={1.5}
                            />
                        </label>

                        <label className="text-[12px] leading-[18px] font-medium text-[#64748B]">
                            특이사항
                            <textarea
                                {...register("note")}
                                className="mt-[5px] h-[78px] w-full resize-none rounded-[8px] border border-[#DCE8E2] bg-white px-3 py-2 text-[13px] text-[#1D2B3A] outline-none"
                                maxLength={500}
                            />
                            {errors.note?.message && <span className="mt-1 block text-[11px] text-red-500">{errors.note.message}</span>}
                        </label>
                    </div>
                </div>

                <footer className="flex shrink-0 justify-end gap-2 px-7 pb-6 pt-2">
                    <button
                        className="h-[40px] w-full rounded-[8px] border border-[#DCE8E2] bg-white px-[18px] text-[13px] leading-[19.5px] text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-[40px] w-full rounded-[8px] bg-[#2A3A4A] px-5 text-[13px] leading-[19.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isSubmitting}
                        type="submit"
                    >
                        {isSubmitting ? "등록 중" : "등록"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
