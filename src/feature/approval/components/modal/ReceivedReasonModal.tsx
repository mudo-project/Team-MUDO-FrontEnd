"use client";

import { decideApprovalAction } from "@/feature/approval/actions";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ReceivedReasonModal({ mode, closeModal, id }: { mode: '승인' | '반려', closeModal: () => void, id: number }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const response = await decideApprovalAction(id, {
            decision: mode === '승인' ? "APPROVE" : "REJECT",
            comment: String(formData.get("reason") ?? ""),
        });

        setIsSubmitting(false);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        closeModal();
        router.refresh();
    };

    return (
        <div
            onClick={closeModal}
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30">
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_8px_16px_rgba(22,34,54,0.16)]"
            >
                <header className="flex w-full shrink-0 items-start gap-3 p-6 pb-0 lg:p-8 lg:pb-0">
                    <h2 className="text-[15px] font-bold leading-[22.5px] text-[#0F172A]">
                        결재 {mode}
                    </h2>
                    <button
                        aria-label="결재 승인 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#C0C8D0]"
                        type="button"
                        onClick={closeModal}
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-5">
                    <div className="w-full">
                        <label
                            className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]"
                            htmlFor="received-approval-reason"
                        >
                            사유 {mode === '승인' && <span className="text-[#C0C8D0]">(선택)</span>}
                        </label>
                        <textarea
                            className="block h-[78px] w-full resize-none rounded-[8px] border border-[#D7E8DB] px-3 py-[9px] text-[13px] font-normal leading-[19.5px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                            id="received-approval-reason"
                            name="reason"
                            placeholder={`${mode} 의견`}
                        />
                    </div>
                </div>

                <footer className="shrink-0 p-6 pt-3.5">
                    <button
                        className="h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isSubmitting}
                        type="submit"
                    >
                        {isSubmitting ? "처리 중..." : `${mode} 처리`}
                    </button>
                </footer>
            </form>
        </div>
    );
}
