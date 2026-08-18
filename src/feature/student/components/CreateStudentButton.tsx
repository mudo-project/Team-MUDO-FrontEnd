"use client";

import useModal from "@/components/hooks/useModal";
import { Plus } from "lucide-react";
import CreateStudentModal from "./modal/CreateStudentModal";

export default function CreateStudentButton() {
    const createStudentModal = useModal();

    return (
        <>
            <button
                className="min-w-[80px] ml-auto flex h-[30px] sm:h-[32px] md:h-[34px] items-center gap-1 sm:gap-1.5 rounded-lg bg-[#2A3A4A] px-2.5 sm:px-3 md:px-3.5 text-[11px] sm:text-xs font-medium text-white"
                onClick={createStudentModal.openModal}
                type="button"
            >
                <Plus className="size-3 md:size-3.5" strokeWidth={1.7} />
                원생 등록
            </button>

            {createStudentModal.isModal && (
                <CreateStudentModal closeModal={createStudentModal.closeModal} />
            )}
        </>
    );
}
