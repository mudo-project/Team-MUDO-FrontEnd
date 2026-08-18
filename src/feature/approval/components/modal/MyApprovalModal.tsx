"use client";

import { cancelApprovalAction, getApprovalDetailAction, hideApprovalHistoryAction, resubmitApprovalAction } from "@/feature/approval/actions";
import ApprovalAttachmentDownloadButton from "../ApprovalAttachmentDownloadButton";
import {
    ApprovalDetailData,
    ApprovalDocumentStatus,
    ApprovalLineStatus,
} from "@/feature/approval/type";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useModal from "@/components/hooks/useModal";
import EditApprovalModal from "./EditApprovalModal";
import ApprovalLineView from "../ApprovalLineView";
import { format } from "date-fns";

const documentStatusLabel: Record<ApprovalDocumentStatus, string> = {
    IN_PROGRESS: "진행중",
    APPROVED: "승인",
    REJECTED: "반려",
    CANCELLED: "취소",
};

const lineStatusLabel: Record<ApprovalLineStatus, string> = {
    WAITING: "대기",
    PENDING: "검토중",
    APPROVED: "승인",
    REJECTED: "반려",
};


interface MyApprovalModalProps {
    closeModal: () => void;
    id: number;
}

export default function MyApprovalModal({ closeModal, id }: MyApprovalModalProps) {
    const router = useRouter();
    const [approval, setApproval] = useState<ApprovalDetailData>();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modal = useModal();


    useEffect(() => {
        let cancelled = false;

        const loadApproval = async () => {
            const response = await getApprovalDetailAction(id);

            if (cancelled) return;

            if (!response.success || !response.data) {
                setError(response.message);
                return;
            }

            setApproval(response.data);
        };

        void loadApproval();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleCancel = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const response = await cancelApprovalAction(id);
        setIsSubmitting(false);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        closeModal();
        router.refresh();
    };

    const handleResubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const response = await resubmitApprovalAction(id);
        setIsSubmitting(false);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        closeModal();
        router.refresh();
    };

    const handleHideHistory = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const response = await hideApprovalHistoryAction(id);
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
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35" onClick={closeModal}>
            <div
                className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(22,34,54,0.18)] md:w-3/5 lg:w-[560px]"
                onClick={(event) => event.stopPropagation()}>
                <header className="flex w-full shrink-0 items-start gap-3 p-6 pb-0 lg:p-8 lg:pb-0">
                    <div className="w-full">
                        <div className="flex items-center gap-2.5">
                            <span className="bg-[#F0F2F5] text-[#8A94A3] rounded-[20px] px-[9px] py-0.5 min-h-[16.5px] text-[11px] font-medium leading-[16.5px]">
                                {approval && documentStatusLabel[approval.status]}
                            </span>
                            <span className="min-h-[16.5px] text-[11px] font-normal leading-[16.5px] text-[#B0B8C1]">{approval?.templateName}</span>
                        </div>
                        <h2 className="pt-1.5 min-h-[27px] text-[18px] font-bold leading-[27px] text-[#0F172A]">{approval?.title}</h2>
                        <p className="pt-1 text-[12px] font-normal leading-[18px] text-[#B0B8C1]">
                            {error ? error : <>기안자: {approval?.creatorName} · {approval?.createdAt && format(approval.createdAt, 'yyyy-MM-dd')}</>}
                        </p>
                    </div>
                    <button aria-label="내가 신청한 결재 모달 닫기" className="flex size-[22px] shrink-0 items-center justify-center text-[#C0C8D0]" onClick={closeModal} type="button">
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-0 lg:p-8 lg:pt-0">
                    <section className="mt-6 w-full rounded-[10px] bg-[#F7F8FA] px-5 py-4 overflow-x-auto">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">결재 라인</h3>
                        <div className="flex h-[92px] w-full items-start pt-5 pb-2">
                            {approval?.lines && [...approval.lines].sort((a, b) => a.stepOrder - b.stepOrder).map((line, i) => (
                                <ApprovalLineView key={line.lineId} line={line} i={i} length={approval.lines.length} />
                            ))}
                        </div>
                    </section>

                    <section className="mt-6 w-full">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">내용</h3>
                        <div className="mt-2 w-full min-h-[50px] rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5 text-[13px] leading-[22.1px] text-[#3D4A5A]">{approval?.text || (approval && "첨부파일 결재 문서입니다.")}</div>
                    </section>

                    <section className="mt-5 w-full">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">파일</h3>
                        <div className="mt-2 min-h-[50px] rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5 text-[12px] leading-[18px] text-[#3D4A5A]">
                            {approval && (approval.attachments.length > 0 ? approval.attachments.map((attachment) => <ApprovalAttachmentDownloadButton documentId={approval.id} fileId={attachment.fileId} key={attachment.fileId} />) : "첨부파일이 없습니다.")}
                        </div>
                    </section>
                </div>

                <footer className="flex  w-full shrink-0 items-start gap-1 border-t border-[#D7E8DB] p-6 pt-4 lg:p-8 lg:pt-4">
                    {approval && (documentStatusLabel[approval.status] === '반려' || documentStatusLabel[approval.status] === '승인') &&
                        <button
                            className="h-[41px] rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[13px] font-normal leading-[19.5px] text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                            onClick={handleHideHistory}
                            type="button"
                        >
                            {isSubmitting ? "처리 중..." : "삭제"}
                        </button>
                    }
                    {approval && [...approval.lines].every((line) => lineStatusLabel[line.status] === '검토중' || lineStatusLabel[line.status] === '대기') && (
                        <>
                            <button
                                className="h-[41px] rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[13px] font-normal leading-[19.5px] text-[#0F172A]"
                                type="button"
                                onClick={modal.openModal}
                            >
                                결재라인 수정
                            </button>

                            <button
                                className="h-[41px] rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[13px] font-normal leading-[19.5px] text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isSubmitting}
                                onClick={handleCancel}
                                type="button"
                            >
                                {isSubmitting ? "처리 중..." : "결재 취소"}
                            </button>
                        </>
                    )}
                    {approval && documentStatusLabel[approval.status] === '반려' && (
                        <button
                            className="h-[41px] rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[13px] font-normal leading-[19.5px] text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isSubmitting}
                            onClick={handleResubmit}
                            type="button"
                        >
                            {isSubmitting ? "처리 중..." : "재상신"}
                        </button>
                    )}
                </footer>
            </div>
            {modal.isModal && approval &&
                <EditApprovalModal
                    closeModal={modal.closeModal}
                    documentId={id}
                    approval={approval}
                />
            }
        </div>
    );
}

