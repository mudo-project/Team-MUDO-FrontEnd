"use client";

import useModal from "@/components/hooks/useModal";
import CreateMessageTemplateModal from "@/feature/message/components/modals/CreateMessageTemplateModal";
import { Plus } from "lucide-react";

export default function MessageTemplateCreateButton() {
    const createTemplateModal = useModal();

    return (
        <>
            <button className="ml-auto flex h-9 items-center gap-1.5 rounded-[9px] bg-[#1E293B] px-4 text-[13px] font-medium text-white" onClick={createTemplateModal.openModal} type="button">
                <Plus aria-hidden="true" className="size-3.5" strokeWidth={2} />
                템플릿 등록
            </button>
            {createTemplateModal.isModal && (
                <CreateMessageTemplateModal closeModal={createTemplateModal.closeModal} />
            )}
        </>
    );
}
