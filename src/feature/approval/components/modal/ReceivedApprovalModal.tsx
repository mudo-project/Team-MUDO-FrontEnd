

"use client";

import { getApprovalDetailAction } from "@/feature/approval/actions";
import ApprovalAttachmentDownloadButton from "../ApprovalAttachmentDownloadButton";
import {
    ApprovalDetailData,
    ApprovalDocumentStatus,
    ApprovalLineStatus,
} from "@/feature/approval/type";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ApprovalRest from "../ApprovalRest";
import ApprovalIng from "../ApprovalIng";
import ApprovalComp from "../ApprovalComp";
import ApprovalReject from "../ApprovalReject";

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

    const summary = approval?.attachments.find(({ aiSummary }) => aiSummary)?.aiSummary;

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35" onClick={closeModal}>
            <div className="fixed top-1/2 left-1/2 z-1000 max-h-[85vh] h-[85vh] w-5/6 max-w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white shadow-[0_8px_20px_rgba(22,34,54,0.18)] md:w-3/5 lg:w-[680px] p-5" onClick={(event) => event.stopPropagation()}>
                <section className="overflow-y-auto h-full p-3 lg:p-4 ">

                    <div className="flex w-full items-start gap-3">
                        <div className="w-full">
                            {approval ? (
                                <>
                                    <div className="flex items-center gap-2.5">
                                        <span className="rounded-[20px] bg-[#DCFCE7] px-[9px] py-0.5 text-[11px] font-medium leading-[16.5px] text-[#2C8D50]">{documentStatusLabel[approval.status]}</span>
                                        <span className="text-[11px] leading-[16.5px] text-[#B0B8C1]">{approval.templateName}</span>
                                    </div>
                                    <h2 className="pt-1.5 text-[18px] font-bold leading-[27px] text-[#0F172A]">{approval.title}</h2>
                                    <p className="pt-1 text-[12px] leading-[18px] text-[#B0B8C1]">기안자: {approval.creatorName} · {approval.createdAt}</p>
                                </>
                            ) : (
                                <p className="text-[12px] text-[#64748B]">{error || "결재 문서를 불러오는 중입니다."}</p>
                            )}
                        </div>
                        <button aria-label="결재 확인 모달 닫기" className="flex size-[22px] shrink-0 items-center justify-center text-[#C0C8D0]" onClick={closeModal} type="button"><X className="size-3.5" strokeWidth={1.5} /></button>
                    </div>

                    {approval && (
                        <>
                            <section className="mt-6 w-full rounded-[10px] bg-[#F7F8FA] px-5 py-4">
                                <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">결재 라인</h3>
                                <div className="flex h-[107px] w-full items-start pt-5 pb-2">
                                    {[...approval.lines].sort((a, b) => a.stepOrder - b.stepOrder).map((line, i) => (
                                        <section key={line.lineId} className="flex flex-1 last:flex-none">
                                            <div className="flex min-w-[72px] shrink-0 flex-col items-center gap-1.5">
                                                {lineStatusLabel[line.status] === "대기" &&
                                                    <ApprovalRest />
                                                }
                                                {lineStatusLabel[line.status] === "검토중" &&
                                                    <ApprovalIng />
                                                }
                                                {lineStatusLabel[line.status] === "승인" &&
                                                    <ApprovalComp />
                                                }
                                                {lineStatusLabel[line.status] === "반려" &&
                                                    <ApprovalReject />
                                                }
                                                <div className="text-center">
                                                    <p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">{line.stepOrder}차 · {line.approverName}</p>
                                                    <p className="pt-px text-[10px] leading-[15px] text-[#64748B]">{lineStatusLabel[line.status]}</p>
                                                    {line.decidedAt && <p className="pt-px text-[10px] leading-[15px] text-[#C0C8D0]">{line.decidedAt}</p>}
                                                </div>
                                            </div>
                                            {[...approval.lines].length !== i + 1 &&
                                                <div className="mt-[11px] px-10 h-[1.5px] min-w-3 flex-1 bg-[#D0D5DC]" />
                                            }
                                        </section>
                                    ))}
                                </div>
                            </section>

                            {approval.lines.filter(({ comment }) => comment).map((line) => (
                                <section className="mt-5 w-full rounded-[8px] border border-[#D7E8DB] bg-[#F7F8FA] px-3.5 py-2.5" key={line.lineId}>
                                    <div className="flex items-center"><p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">{line.stepOrder}차 · {line.approverName} · {lineStatusLabel[line.status]}</p>{line.decidedAt && <p className="ml-auto text-[11px] leading-[16.5px] text-[#C0C8D0]">{line.decidedAt}</p>}</div>
                                    <p className="pt-1 text-[12px] leading-[18px] text-[#6B7280]">&quot;{line.comment}&quot;</p>
                                </section>
                            ))}

                            <section className="pt-5">
                                <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">요약</h3>
                                <div className="mt-2 w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5">
                                    <p className="text-[13px] leading-[22.1px] text-[#3D4A5A]">{summary || "생성된 AI 요약이 없습니다."}</p>
                                </div>
                            </section>
                            <section className="pt-5">
                                <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">내용</h3>
                                <div className="mt-2 w-full rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5">
                                    <p className="text-[13px] leading-[22.1px] text-[#3D4A5A]">{approval.text || "첨부파일 결재 문서입니다."}</p>
                                </div>
                            </section>
                            <section className="pt-5">
                                <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">파일</h3>
                                <div className="mt-2 rounded-[8px] border border-[#D7E8DB] bg-[#FAFBFC] px-4 py-3.5 text-[13px] leading-[22.1px] text-[#3D4A5A]">{approval.attachments.length > 0 ? approval.attachments.map((attachment) => <ApprovalAttachmentDownloadButton documentId={approval.id} fileId={attachment.fileId} key={attachment.fileId} />) : "첨부파일이 없습니다."}</div>
                            </section>
                        </>
                    )}
                    <div className="mt-5 flex h-[58px] w-full gap-2 border-t border-[#D7E8DB] pt-4">
                        <button
                            onClick={noneActiveModal}
                            className="h-full w-full rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] text-[13px] font-semibold leading-[19.5px] text-[#0F172A]" type="button">
                            반려
                        </button>
                        <button
                            onClick={activeModal}
                            className="h-full w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white" type="button">
                            승인
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
