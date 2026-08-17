'use client'

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { ApprovalActionResult, getApprovalTemplateDetailAction } from "../../actions";
import { ApprovalTemplateDetailData } from "../../type";
import { format } from "date-fns";
import ApprovalTemplateLine from "../ApprovalTemplateLine";

export default function ApprovalTemplateModal({ id, closeModal, activeModal, noneActiveModal }: { id: number, closeModal: () => void, activeModal: () => void, noneActiveModal: () => void }) {
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
        }

        fetchTemplateDetail();
    }, [])

    return (
        <div
            onClick={closeModal}
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35">
            <div
                onClick={(e) => e.stopPropagation()}
                className="overflow-x-hidden fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] sm:w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_20px_rgba(22,34,54,0.18)]">
                <header className="flex h-[49px] w-full shrink-0 items-start gap-3 p-5 pb-0 sm:p-6 sm:pb-0">
                    <div className="w-full">
                        <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">
                            {templateDetail.data?.name}
                        </h2>
                        <p className="pt-1 text-[12px] font-normal leading-[18px] text-[#B0B8C1]">
                            생성자: {templateDetail.data?.creatorId} · {templateDetail.data?.createdAt && format(templateDetail.data?.createdAt as string, 'yyyy.MM.dd')}
                        </p>
                    </div>
                    <button
                        aria-label="결재 템플릿 상세 모달 닫기"
                        className="flex size-[22px] shrink-0 items-center justify-center text-[#C0C8D0]"
                        type="button"
                        onClick={closeModal}
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 pt-0 mt-5">
                    <section className="mt-5 h-[118px] w-full rounded-[10px] bg-[#F7F8FA] px-5 py-4">
                        <h3 className="text-[11px] font-semibold leading-[16.5px] tracking-[0.55px] text-[#64748B]">
                            결재 라인
                        </h3>
                        <div className="overflow-x-auto mt-3 flex w-full items-center">
                            {templateDetail.data?.lines.map((line, i) => {
                                return <ApprovalTemplateLine key={line.approverId} line={line} i={i} length={templateDetail.data?.lines.length || 0} />
                            })}
                        </div>
                    </section>
                </div>

                <footer className="flex w-full shrink-0 items-start gap-2 border-t border-[#D7E8DB] p-5 pt-4">
                    <button
                        className="h-[41px] w-full rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[13px] font-normal leading-[19.5px] text-[#6B7280]"
                        type="button"
                        onClick={noneActiveModal}
                    >
                        삭제
                    </button>
                    <button
                        className="h-[41px] w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white"
                        type="button"
                        onClick={activeModal}
                    >
                        수정
                    </button>
                </footer>
            </div>
        </div>
    );
}
