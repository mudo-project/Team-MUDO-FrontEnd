"use client";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { deleteMessageTemplateAction } from "@/feature/message/actions";
import EditMessageTemplateModal from "@/feature/message/components/modals/EditMessageTemplateModal";
import { MessageTemplateData } from "@/feature/message/type";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_STYLES: Record<MessageTemplateData["status"], {
    badgeClassName: string;
    dotClassName: string;
    label: string;
}> = {
    PRESENT: { badgeClassName: "bg-[#F0FDF4] text-[#16A34A]", dotClassName: "bg-[#16A34A]", label: "출석" },
    ABSENT: { badgeClassName: "bg-[#FEF2F2] text-[#DC2626]", dotClassName: "bg-[#DC2626]", label: "결석" },
    LATE: { badgeClassName: "bg-[#FFFBEB] text-[#D97706]", dotClassName: "bg-[#D97706]", label: "지각" },
    ONLINE: { badgeClassName: "bg-[#EFF6FF] text-[#2563EB]", dotClassName: "bg-[#2563EB]", label: "온라인" },
    ETC: { badgeClassName: "bg-[#F1F5F9] text-[#64748B]", dotClassName: "bg-[#64748B]", label: "기타" },
};

export default function MessageTemplateItem({ template }: { template: MessageTemplateData }) {
    const router = useRouter();
    const editTemplateModal = useModal();
    const deleteTemplateModal = useModal();
    const [isDeleting, setIsDeleting] = useState(false);
    const statusStyle = STATUS_STYLES[template.status];

    const deleteTemplate = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        const response = await deleteMessageTemplateAction(template.id);
        setIsDeleting(false);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        deleteTemplateModal.closeModal();
        router.refresh();
    };

    return (
        <>
            <article className="flex h-[199px] flex-col gap-2.5 sm:gap-2.5 md:gap-3 rounded-[14px] border border-[#E8EDF2] bg-white p-4 sm:p-4 md:p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.04)]">
                <div>
                    <div className="flex h-[25px] items-center gap-2 pb-1">
                        <span className={`size-[7px] shrink-0 rounded-full ${statusStyle.dotClassName}`} />
                        <h2 className="text-[12px] sm:text-[13px] md:text-[14px] leading-[21px] font-bold text-[#0F172A]">
                            {template.name}
                        </h2>
                        <button
                            aria-label={`${template.name} 수정`}
                            className="ml-auto flex size-6 sm:size-6 md:size-7 items-center justify-center rounded-[6px] border border-[#DCE8E2] bg-white text-[#64748B]"
                            onClick={editTemplateModal.openModal}
                            type="button"
                        >
                            <Pencil aria-hidden="true" className="size-3 sm:size-3 md:size-3.5" strokeWidth={1.5} />
                        </button>
                        <button
                            aria-label={`${template.name} 삭제`}
                            className="flex size-6 sm:size-6 md:size-7 items-center justify-center rounded-[6px] border border-[#DCE8E2] bg-white text-[#64748B]"
                            disabled={isDeleting}
                            onClick={deleteTemplateModal.openModal}
                            type="button"
                        >
                            <Trash2 aria-hidden="true" className="size-3 sm:size-3 md:size-3.5" strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="h-6 pt-1">
                        <span className={`inline-flex h-5 items-center rounded-full px-2 text-[11px] leading-[16.5px] font-semibold ${statusStyle.badgeClassName}`}>
                            {statusStyle.label}
                        </span>
                    </div>
                </div>

                <p className="h-[67px] overflow-hidden rounded-[9px] bg-[#F8FAFC] px-3 sm:px-3 md:px-3.5 py-2.5 sm:py-2.5 md:py-3 text-[12px] sm:text-[12px] md:text-[13px] leading-[21.45px] text-[#475569]">
                    {template.content}
                </p>

                <div className="flex items-center text-[11px] leading-[16.5px] text-[#B0B8C1]">
                    <span>수정 {format(parseISO(template.updatedAt), "yyyy-MM-dd")}</span>
                    <span className="ml-auto">생성 {format(parseISO(template.createdAt), "yyyy-MM-dd")}</span>
                </div>
            </article>
            {editTemplateModal.isModal && (
                <EditMessageTemplateModal
                    closeModal={editTemplateModal.closeModal}
                    content={template.content}
                    name={template.name}
                    templateId={template.id}
                />
            )}
            {deleteTemplateModal.isModal && (
                <TwoButtonModal
                    activeModal={deleteTemplate}
                    closeModal={deleteTemplateModal.closeModal}
                    content="삭제하시겠습니까?"
                    isPending={isDeleting}
                    title="템플릿 삭제"
                />
            )}
        </>
    );
}
