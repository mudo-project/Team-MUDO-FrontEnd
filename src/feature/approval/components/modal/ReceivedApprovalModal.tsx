

"use client";

import {
    getApprovalDetailAction,
    summarizeApprovalAttachmentAction,
} from "@/feature/approval/actions";
import ApprovalAttachmentDownloadButton from "../ApprovalAttachmentDownloadButton";
import {
    ApprovalDetailData,
    ApprovalDocumentStatus,
    ApprovalLineStatus,
} from "@/feature/approval/type";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ApprovalLineView from "../ApprovalLineView";

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

interface ReceivedApprovalModalProps {
    closeModal: () => void;
    activeModal: () => void;
    noneActiveModal: () => void;
    id: number;
}

export default function ReceivedApprovalModal({ closeModal, activeModal, noneActiveModal, id }: ReceivedApprovalModalProps) {
    const [approval, setApproval] = useState<ApprovalDetailData>();
    const [error, setError] = useState("");
    const [summaryError, setSummaryError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadApproval = async () => {
            const response = await getApprovalDetailAction(id);

            if (cancelled) return;

            if (!response.success || !response.data) {
                setError(response.message);
                return;
            }

            const approvalDetail = response.data;
            setApproval(approvalDetail);

            const attachmentsWithoutSummary = approvalDetail.attachments.filter(
                ({ aiSummary, fileId }) => !aiSummary && fileId > 0,
            );

            if (attachmentsWithoutSummary.length === 0) return;

            const summaryResponses = await Promise.all(
                attachmentsWithoutSummary.map(({ fileId }) =>
                    summarizeApprovalAttachmentAction(approvalDetail.id, fileId),
                ),
            );

            if (cancelled) return;

            const failedSummary = summaryResponses.find(({ success }) => !success);
            if (failedSummary) setSummaryError(failedSummary.message);

            const refreshedResponse = await getApprovalDetailAction(id);

            if (cancelled) return;

            if (refreshedResponse.success && refreshedResponse.data) {
                setApproval(refreshedResponse.data);
            }
        };

        void loadApproval();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const summary = approval?.attachments.find(({ aiSummary }) => aiSummary)?.aiSummary;

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35" onClick={closeModal}>
            <div
                className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_40px_rgba(22,34,54,0.18)] md:w-3/5 lg:w-[560px]"
                onClick={(event) => event.stopPropagation()}>
                <header className="flex w-full shrink-0 items-start gap-3 p-6 pb-0 lg:p-8 lg:pb-0">
                    <div className="w-full">
                        <div className="flex items-center gap-2.5">
                            <span className="min-w-[5px] bg-[#F0F2F5] text-[#8A94A3] rounded-[20px] px-[9px] py-0.5 min-h-[16.5px] text-[11px] font-medium leading-[16.5px]">
                                {approval && documentStatusLabel[approval.status]}
                            </span>
                            <span className="min-h-[16.5px] text-[11px] leading-[16.5px] text-[#B0B8C1]">{approval?.templateName}</span>
                        </div>
                        <h2 className="pt-1.5 min-h-[27px] text-[18px] font-bold leading-[27px] text-[#0F172A]">{approval?.title}</h2>
                        <p className="pt-1 text-[12px] leading-[18px] text-[#B0B8C1]">
                            {error ? error : <>기안자: {approval?.creatorName} · {approval?.createdAt}</>}
                        </p>
                    </div>
                    <button aria-label="결재 확인 모달 닫기" className="flex size-[22px] shrink-0 items-center justify-center text-[#C0C8D0]" onClick={closeModal} type="button"><X className="size-3.5" strokeWidth={1.5} /></button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-0 lg:p-8 lg:pt-0">
                    <section className="mt-6 w-full rounded-[10px] bg-[#F7F8FA] px-5 py-4 overflow-x-auto">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">결재 라인</h3>
                        <div className="flex h-[107px] w-full items-start pt-5 pb-2">
                            {approval?.lines && [...approval.lines].sort((a, b) => a.stepOrder - b.stepOrder).map((line, i) => (
                                <ApprovalLineView key={line.lineId} line={line} i={i} length={approval.lines.length} />
                            ))}
                        </div>
                    </section>

                    {approval?.lines.filter(({ comment }) => comment).map((line) => (
                        <section className="mt-5 w-full rounded-[8px] border border-[#D7E8DB] bg-[#F7F8FA] px-3.5 py-2.5" key={line.lineId}>
                            <div className="flex items-center"><p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">{line.stepOrder}차 · {line.approverName} · {lineStatusLabel[line.status]}</p>{line.decidedAt && <p className="ml-auto text-[11px] leading-[16.5px] text-[#C0C8D0]">{line.decidedAt}</p>}</div>
                            <p className="pt-1 text-[12px] leading-[18px] text-[#6B7280]">&quot;{line.comment}&quot;</p>
                        </section>
                    ))}

                    <section className="pt-5">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">요약</h3>
                        <div className="mt-2 w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5">
                            <p className="min-h-[23px] text-[13px] leading-[22.1px] text-[#3D4A5A]">{approval?.attachments[0]?.fileId ? (summary || summaryError || "AI 요약을 불러오는 중...") : '"생성된 AI 요약이 없습니다."'}</p>
                        </div>
                    </section>
                    <section className="pt-5">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">내용</h3>
                        <div className="mt-2 w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5">
                            <p className="min-h-[23px] text-[13px] leading-[22.1px] text-[#3D4A5A]">{approval?.text || (approval && "첨부파일 결재 문서입니다.")}</p>
                        </div>
                    </section>
                    <section className="pt-5">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">파일</h3>
                        <div className="mt-2 min-h-[23px] rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5 text-[13px] leading-[22.1px] text-[#3D4A5A]">{approval && (approval.attachments.length > 0 ? approval.attachments.map((attachment) => <ApprovalAttachmentDownloadButton documentId={approval.id} fileId={attachment.fileId} key={attachment.fileId} />) : "첨부파일이 없습니다.")}</div>
                    </section>
                </div>

                <footer className="flex  w-full shrink-0 gap-2 border-t border-[#D7E8DB] p-5 pt-4">
                    <button
                        onClick={noneActiveModal}
                        className="h-[41px] w-full rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] text-[13px] font-semibold leading-[19.5px] text-[#0F172A]" type="button">
                        반려
                    </button>
                    <button
                        onClick={activeModal}
                        className="h-[41px] w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white" type="button">
                        승인
                    </button>
                </footer>
            </div>
        </div>
    );
}
