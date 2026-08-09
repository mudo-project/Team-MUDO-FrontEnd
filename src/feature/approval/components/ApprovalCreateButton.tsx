'use client'

import useModal from "@/components/hooks/useModal";
import { Plus } from "lucide-react";
import CreateApprovalModal from "./modal/CreateApprovalModal";

export default function ApprovalCreateButton() {
    const modal = useModal();
    return (
        <>
            <button
                className="ml-auto mb-1 flex items-center gap-0.5 rounded-[6px] bg-[#0F172A] px-1.5 py-1 text-[10px] font-medium leading-[18px] text-white sm:gap-1 sm:px-2 md:mb-2 md:gap-1.5 md:rounded-[8px] md:px-3 md:py-1.5 md:text-[11px] lg:px-3.5 lg:text-[12px]"
                type="button"
            >
                <Plus className="size-3 md:size-3.5" strokeWidth={2} />
                결재 생성
            </button>
            {modal.isModal && (
                <CreateApprovalModal
                    closeModal={modal.closeModal}
                    activeModal={modal.activeModal}
                />
            )}
        </>
    )
}