'use client'

import { X } from "lucide-react";
import { WorkspaceRecurringTemplateData } from "../type";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteWorkspaceRecurringTemplateAction } from "../actions";
import EditTaskTemplateModal from "./modals/EditTaskTemplateModal";

interface WorkTemplateItemProps {
    template: WorkspaceRecurringTemplateData;
    workspaceId: string;
}

export default function WorkTemplateItem({ template, workspaceId }: WorkTemplateItemProps) {
    const recurrenceLabel = template.recurrenceType === "WEEKLY" ? "매주" : "매월";
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: () =>
            deleteWorkspaceRecurringTemplateAction(
                Number(workspaceId),
                template.templateId,
            ),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.message);
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace-recurring-templates", workspaceId],
            });

            toast.success(result.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const deleteModal = useModal(() => deleteMutation.mutate());
    const editModal = useModal();

    return (
        <article
            className="flex h-[68px] w-full items-center gap-1.5 rounded-[8px] border border-[#DEE3E9] bg-white px-2 sm:gap-2 sm:px-2.5 md:h-[72px] md:gap-3 md:rounded-[10px] md:px-3.5 lg:h-[76px] lg:gap-3.5 lg:px-[18px]"
        >
            <button
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#F5F6F8] text-[10px] font-light text-[#A9B2BF] md:h-8 md:w-8 md:rounded-[7px] md:text-[13px] lg:h-9 lg:w-9 lg:rounded-[8px] lg:text-[16px]"
                aria-label={`수정`}
            >
                ⟋
            </button>

            <div>
                <h2 className="text-[10px] leading-[19.5px] font-semibold tracking-[-0.02em] md:text-[12px] lg:text-[13px]">{template.title}</h2>
                <div className="sm:gap-2 mt-0.5 flex  flex-col sm:flex-row sm:items-center text-[10px] leading-[16.5px] text-[#B4BCC7] lg:mt-1 lg:text-[11px]">
                    <div>
                        <span className="rounded-full bg-[#EDF5FF] px-1 py-px text-[#76A9DF] sm:px-1.5 lg:px-2">{recurrenceLabel}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={editModal.openModal}
                className="ml-auto h-7 rounded-[7px] border border-[#DCE1E7] bg-white px-1 text-[10px] leading-[18px] font-medium text-[#515B6A] md:px-2 md:text-[11px] lg:h-8 lg:px-3 lg:text-[12px]">
                수정하기
            </button>
            <button
                onClick={deleteModal.openModal}
                disabled={deleteMutation.isPending}
                className="h-6 text-[10px] leading-[18px] font-light text-[#C5CBD4] lg:h-7 lg:text-[12px]"
                aria-label="반복 업무 템플릿 삭제"
                type="button"
            >
                <X className="h-4 w-4" />
            </button>
            {editModal.isModal &&
                <EditTaskTemplateModal
                    closeModal={editModal.closeModal}
                    workspaceId={workspaceId}
                    template={template}
                />}
            {deleteModal.isModal && (
                <TwoButtonModal
                    title="업무 템플릿 삭제"
                    content="삭제하시겠습니까?"
                    closeModal={deleteModal.closeModal}
                    activeModal={deleteModal.activeModal}
                />
            )}
        </article>
    )
}
