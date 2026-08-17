"use client";

import { Plus, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import ApprovalLineItem from "../ApprovalLineItem";
import { createApprovalTemplateAction } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ApprovalLine {
    stepOrder: number;
    approverId: number | "";
}


interface CreateApprovalTemplateModalProps {
    closeModal: () => void;
}

export default function CreateApprovalTemplateModal({
    closeModal,
}: CreateApprovalTemplateModalProps) {
    const [approvalLines, setApprovalLines] = useState<ApprovalLine[]>([
        { stepOrder: 1, approverId: "" },
    ]);

    const [state, createTemplateFormAction, ispending] = useActionState(createApprovalTemplateAction, {
        success: false,
        message: '',
        data: undefined
    })
    const route = useRouter();

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            closeModal();
            route.refresh();
        }
    }, [state])

    const selectedApproverIds = approvalLines
        .map(({ approverId }) => approverId)
        .filter((approverId): approverId is number => typeof approverId === "number");

    const addApprovalLine = () => {
        setApprovalLines([
            ...approvalLines,
            {
                stepOrder: approvalLines.length + 1,
                approverId: "",
            },
        ]);
    };

    const removeApprovalLine = (stepOrder: number) => {
        if (approvalLines.length === 1) return;

        setApprovalLines(
            approvalLines
                .filter((line) => line.stepOrder !== stepOrder)
                .map((line, index) => ({ ...line, stepOrder: index + 1 })),
        );
    };

    const changeApprover = (stepOrder: number, approverId: number | "") => {
        setApprovalLines(
            approvalLines.map((line) =>
                line.stepOrder === stepOrder ? { ...line, approverId } : line,
            ),
        );
    };

    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35"
            onClick={closeModal}
        >
            <form
                action={createTemplateFormAction}
                className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] sm:w-[420px]  -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(22,34,54,0.18)]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex h-[49px] w-full shrink-0 items-center p-5 pb-0 sm:p-6 sm:pb-0 mb-5">
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">
                        결재 템플릿 생성
                    </h2>
                    <button
                        aria-label="결재 템플릿 생성 모달 닫기"
                        className="ml-auto flex size-[22px] items-center justify-center text-[#C0C8D0]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 pt-0">
                    <div className="mt-4 w-full">
                        <label
                            className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]"
                            htmlFor="approval-template-name"
                        >
                            템플릿 이름 <span className="text-[#C0483F]">*</span>
                        </label>
                        <input
                            className="h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] font-normal text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                            id="approval-template-name"
                            name="name"
                            placeholder="예: 휴가 신청서"
                        />
                    </div>

                    <div className="mt-4 w-full">
                        <p className="text-[12px] font-medium leading-[18px] text-[#6B7280]">
                            결재 라인 <span className="text-[#C0483F]">*</span>
                        </p>
                        <div className="pt-1.5">
                            {approvalLines.map((line) => (
                                <ApprovalLineItem
                                    changeApprover={changeApprover}
                                    key={line.stepOrder}
                                    line={line}
                                    removeApprovalLine={removeApprovalLine}
                                    selectedApproverIds={selectedApproverIds}
                                />
                            ))}
                            <button
                                className="flex h-8 w-full items-center gap-1.5 rounded-[7px] border border-dashed border-[#D7E8DB] px-2.5 text-[12px] font-normal leading-[18px] text-[#B0B8C1]"
                                onClick={addApprovalLine}
                                type="button"
                            >
                                <Plus className="size-3.5" strokeWidth={1.5} />
                                결재자 추가
                            </button>
                        </div>
                    </div>
                    {!state.success && <p>{state.message}</p>}
                </div>

                <footer className="shrink-0 p-5 pt-2">
                    <button
                        className="h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white"
                        type="submit"
                        disabled={ispending}
                    >
                        템플릿 저장
                    </button>
                </footer>
            </form>
        </div>
    );
}
