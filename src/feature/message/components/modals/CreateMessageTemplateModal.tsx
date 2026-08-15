"use client";

import { createMessageTemplateAction } from "@/feature/message/actions";
import { ChevronDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function CreateMessageTemplateModal({ closeModal }: { closeModal: () => void }) {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createMessageTemplateAction, {
        success: false,
        message: "",
        data: undefined,
    });

    useEffect(() => {
        if (!state.success) return;

        toast.success(state.message);
        closeModal();
        router.refresh();
    }, [closeModal, router, state]);

    return (
        <div className="fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-[#0F172A]/55" onClick={closeModal}>
            <form action={formAction} className="z-1000 w-[640px] overflow-hidden rounded-[20px] bg-white shadow-[0_32px_40px_rgba(0,0,0,0.20)]" onClick={(event) => event.stopPropagation()}>
                <header className="flex items-center border-b border-[#F1F5F9] px-7 pt-6 pb-5">
                    <div>
                        <h2 className="text-[17px] leading-[25.5px] font-bold text-[#0F172A]">
                            템플릿 등록
                        </h2>
                        <p className="pt-0.5 text-[12px] leading-[18px] text-[#94A3B8]">
                            학생의 출결 상태에 맞는 문자 내용을 등록할 수 있습니다.
                        </p>
                    </div>
                    <button
                        aria-label="템플릿 등록 모달 닫기"
                        className="ml-auto flex size-8 items-center justify-center rounded-[9px] bg-[#F8FAFC] text-[#94A3B8]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="px-7 py-6">
                    <div className="flex gap-3">
                        <label className="w-full text-[12px] leading-[18px] font-medium text-[#64748B]">
                            템플릿 이름 <span aria-hidden="true">*</span>
                            <input
                                className="mt-1.5 h-10 w-full rounded-[9px] border border-[#E2E8F0] bg-white px-3 text-[13px] text-[#0F172A] outline-none placeholder:text-[#0F172A]/50"
                                name="name"
                                placeholder="예: 결석 안내"
                                type="text"
                            />
                        </label>

                        <label className="relative w-[160px] shrink-0 text-[12px] leading-[18px] font-medium text-[#64748B]">
                            출결 상태 <span aria-hidden="true">*</span>
                            <select
                                className="mt-1.5 h-10 w-full appearance-none rounded-[9px] border border-[#E2E8F0] bg-white px-4 pr-9 text-[13px] text-[#0F172A] outline-none"
                                defaultValue="ABSENT"
                                name="status"
                            >
                                <option value="PRESENT">출석</option>
                                <option value="ABSENT">결석</option>
                                <option value="LATE">지각</option>
                                <option value="ONLINE">온라인</option>
                                <option value="ETC">기타</option>
                            </select>
                            <ChevronDown
                                aria-hidden="true"
                                className="pointer-events-none absolute right-3 bottom-[14px] size-3 text-[#64748B]"
                                strokeWidth={1.5}
                            />
                        </label>
                    </div>

                    <label className="mt-5 block text-[12px] leading-[18px] font-medium text-[#64748B]">
                        <span className="flex items-center">
                            내용 <span aria-hidden="true">*</span>
                        </span>
                        <textarea
                            className="mt-1.5 h-[131px] w-full resize-none rounded-[9px] border border-[#E2E8F0] bg-white px-3 py-2.5 text-[13px] leading-[22px] text-[#0F172A] outline-none placeholder:text-[#0F172A]/50"
                            name="content"
                            placeholder="예: 학생이 오늘 결석했습니다."
                        />
                    </label>
                    {!state.success && state.message && (
                        <div className="mt-4 rounded-[8px] bg-[#FFF0F3] px-3 py-3 text-[12px] leading-6 text-[#D45D76]" role="alert">
                            {state.message}
                        </div>
                    )}
                </div>

                <footer className="flex justify-end gap-2 border-t border-[#F1F5F9] px-7 py-4">
                    <button
                        className="h-9 rounded-[9px] border border-[#E2E8F0] bg-white px-4 text-[13px] leading-[19.5px] text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-9 rounded-[9px] bg-[#1E293B] px-[22px] text-[13px] leading-[19.5px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#94A3B8]"
                        disabled={isPending}
                        type="submit"
                    >
                        {isPending ? "등록 중" : "등록"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
