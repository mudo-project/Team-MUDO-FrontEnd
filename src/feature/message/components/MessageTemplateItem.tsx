"use client";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import EditMessageTemplateModal from "@/feature/message/components/modals/EditMessageTemplateModal";
import { Pencil, Trash2 } from "lucide-react";

export interface MessageTemplateItemData {
    name: string;
    status: string;
    content: string;
    updatedAt: string;
    createdAt: string;
    dotClassName: string;
    badgeClassName: string;
}

export default function MessageTemplateItem({ template }: { template: MessageTemplateItemData }) {
    const editTemplateModal = useModal();
    const deleteTemplateModal = useModal();

    return (
        <>
            <article className="flex h-[199px] flex-col gap-3 rounded-[14px] border border-[#E8EDF2] bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.04)]">
                <div>
                    <div className="flex h-[25px] items-center gap-2 pb-1">
                        <span className={`size-[7px] shrink-0 rounded-full ${template.dotClassName}`} />
                        <h2 className="text-[14px] leading-[21px] font-bold text-[#0F172A]">
                            {template.name}
                        </h2>
                        <button
                            aria-label={`${template.name} 수정`}
                            className="ml-auto flex size-7 items-center justify-center rounded-[6px] border border-[#DCE8E2] bg-white text-[#64748B]"
                            onClick={editTemplateModal.openModal}
                            type="button"
                        >
                            <Pencil aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                        </button>
                        <button
                            aria-label={`${template.name} 삭제`}
                            className="flex size-7 items-center justify-center rounded-[6px] border border-[#DCE8E2] bg-white text-[#64748B]"
                            onClick={deleteTemplateModal.openModal}
                            type="button"
                        >
                            <Trash2 aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="h-6 pt-1">
                        <span className={`inline-flex h-5 items-center rounded-full px-2 text-[11px] leading-[16.5px] font-semibold ${template.badgeClassName}`}>
                            {template.status}
                        </span>
                    </div>
                </div>

                <p className="h-[67px] overflow-hidden rounded-[9px] bg-[#F8FAFC] px-3.5 py-3 text-[13px] leading-[21.45px] text-[#475569]">
                    {template.content}
                </p>

                <div className="flex items-center text-[11px] leading-[16.5px] text-[#B0B8C1]">
                    <span>수정 {template.updatedAt}</span>
                    <span className="ml-auto">생성 {template.createdAt}</span>
                </div>
            </article>
            {editTemplateModal.isModal && (
                <EditMessageTemplateModal
                    closeModal={editTemplateModal.closeModal}
                    content={template.content}
                    name={template.name}
                />
            )}
            {deleteTemplateModal.isModal && (
                <TwoButtonModal
                    activeModal={deleteTemplateModal.activeModal}
                    closeModal={deleteTemplateModal.closeModal}
                    content="삭제하시겠습니까?"
                    title="템플릿 삭제"
                />
            )}
        </>
    );
}
