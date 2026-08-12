"use client";

import { Plus, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import ApprovalLineItem from "../ApprovalLineItem";
import { ApprovalActionResult, changeApprovalTemplateAction, createApprovalTemplateAction, getApprovalTemplateDetailAction } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApprovalTemplateDetailData } from "../../type";

interface ApprovalLine {
    stepOrder: number;
    approverId: number | "";
}


interface EditApprovalTemplateModalProps {
    id: number;
    closeModal: () => void;
}

export default function EditApprovalTemplateModal({
    id,
    closeModal,
}: EditApprovalTemplateModalProps) {
    const [approvalLines, setApprovalLines] = useState<ApprovalLine[]>([
        { stepOrder: 1, approverId: "" },
    ]);
    const changeApprovalTemplateWithId = changeApprovalTemplateAction.bind(null, id);

    const [state, changeTemplateFormAction, ispending] = useActionState(changeApprovalTemplateWithId, {
        success: false,
        message: '',
    })
    const route = useRouter();

    const [templateDetail, setTemplateDetail] = useState<{
        loading: boolean;
        error: string;
        data: ApprovalTemplateDetailData | undefined
    }>({
        loading: true,
        error: '',
        data: undefined
    })

    useEffect(() => {
        const fetchTemplateDetail = async () => {
            const response: ApprovalActionResult<ApprovalTemplateDetailData> = await getApprovalTemplateDetailAction(id);
            setTemplateDetail({
                loading: false,
                error: response.success ? '' : response.message,
                data: response.data
            })
            if (response.data?.lines) {
                setApprovalLines(response.data.lines.map((line) => ({ stepOrder: line.stepOrder, approverId: line.approverId })))
            }
        }

        fetchTemplateDetail();
    }, [])


    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            closeModal();
            route.refresh();
        }
    }, [state])


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
                action={changeTemplateFormAction}
                className="fixed top-1/2 left-1/2 z-1000 max-h-[85vh] w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[14px] bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)] scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex h-[27px] w-full items-center">
                    <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">
                        결재 템플릿 수정
                    </h2>
                    <button
                        aria-label="결재 템플릿 수정 모달 닫기"
                        className="ml-auto flex size-[22px] items-center justify-center text-[#C0C8D0]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

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
                        defaultValue={templateDetail.data?.name}
                    />
                </div>

                <div className="mt-4 w-full">
                    <p className="text-[12px] font-medium leading-[18px] text-[#6B7280]">
                        결재 라인 <span className="text-[#C0483F]">*</span>
                    </p>
                    <div className="pt-1.5">
                        {approvalLines.map((line) => (
                            <ApprovalLineItem key={line.stepOrder} line={line} removeApprovalLine={removeApprovalLine} changeApprover={changeApprover} />
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

                <button
                    className="mt-4 h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white"
                    type="submit"
                    disabled={ispending}
                >
                    템플릿 수정
                </button>
            </form>
        </div>
    );
}
