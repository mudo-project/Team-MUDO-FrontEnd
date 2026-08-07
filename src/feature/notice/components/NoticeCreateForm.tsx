"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import useModal from "@/components/hooks/useModal";
import { NoticeCreateFormValues, noticeCreateSchema } from "@/lib/noticeCreateSchema";
import NoticeFileUpload from "./NoticeFileUpload";

export default function NoticeCreateForm() {
    const modal = useModal();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NoticeCreateFormValues>({
        resolver: zodResolver(noticeCreateSchema),
        defaultValues: { title: "", content: "", pinned: false },
    });

    const closeAndReset = () => {
        reset();
        modal.closeModal();
    };

    const onSubmit = () => {
        closeAndReset();
    };

    return (
        <>
            <button
                className="flex h-8 items-center gap-1.5 rounded-md bg-[#12182B] px-3.5 text-[11px] font-semibold text-white hover:cursor-pointer"
                onClick={modal.openModal}
                type="button"
            >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                공지 작성
            </button>

            {modal.isModal && (
                <div
                    className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35"
                    onClick={closeAndReset}
                >
                    <form
                        className="fixed top-1/2 left-1/2 z-1000 max-h-[85vh] w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[14px] bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]"
                        onClick={(event) => event.stopPropagation()}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex h-[27px] w-full items-center">
                            <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">
                                공지 작성
                            </h2>
                            <button
                                aria-label="공지 작성 모달 닫기"
                                className="ml-auto flex size-[22px] items-center justify-center text-[#C0C8D0] hover:cursor-pointer"
                                onClick={closeAndReset}
                                type="button"
                            >
                                <X className="size-3.5" strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="mt-4 w-full">
                            <label className="block pb-1.5 text-[13px] font-medium text-[#0F172A]" htmlFor="notice-title">
                                제목 <span className="text-[#C0483F]">*</span>
                            </label>
                            <input
                                className="h-[42px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                                id="notice-title"
                                placeholder="공지 제목을 입력하세요"
                                {...register("title")}
                            />
                            {errors.title && (
                                <p className="mt-1 text-[11px] text-[#C0483F]">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="mt-4 w-full">
                            <label className="block pb-1.5 text-[13px] font-medium text-[#0F172A]" htmlFor="notice-content">
                                내용 <span className="text-[#C0483F]">*</span>
                            </label>
                            <textarea
                                className="block h-[140px] w-full resize-none rounded-[8px] border border-[#D7E8DB] px-3 py-2 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                                id="notice-content"
                                placeholder="공지 내용을 입력하세요"
                                {...register("content")}
                            />
                            {errors.content && (
                                <p className="mt-1 text-[11px] text-[#C0483F]">{errors.content.message}</p>
                            )}
                        </div>

                        <NoticeFileUpload />

                        <div className="mt-4 flex items-start gap-2 hover:cursor-pointer">
                            <input className="mt-0.5 size-4 hover:cursor-pointer" id="notice-pinned" type="checkbox" {...register("pinned")} />
                            <label className="text-[13px] text-[#0F172A] hover:cursor-pointer" htmlFor="notice-pinned">
                                상단 고정
                                <span className="block text-[11px] text-[#94A3B8]">
                                    목록 최상단에 배경 강조로 표시됩니다
                                </span>
                            </label>
                        </div>

                        <p className="mt-4 text-[12px] text-[#94A3B8]">
                            작성자와 작성일시는 자동으로 기록됩니다
                        </p>

                        <div className="mt-5 flex h-[41px] w-full gap-2">
                            <button
                                className="h-full flex-1 rounded-[8px] border border-[#D7E8DB] bg-white text-[13px] text-[#6B7280] hover:cursor-pointer"
                                onClick={closeAndReset}
                                type="button"
                            >
                                취소
                            </button>
                            <button
                                className="h-full flex-1 rounded-[8px] bg-[#0F172A] text-[13px] font-semibold text-white hover:cursor-pointer"
                                type="submit"
                            >
                                등록
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
