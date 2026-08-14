'use client'

import { Plus } from "lucide-react";

import useModal from "@/components/hooks/useModal";
import CreateLectureModal from "./modal/CreateLectureModal";

export default function CreateLectureButton() {
    const modal = useModal();

    return (
        <>
            <button
                className="ml-auto flex h-9 items-center gap-1.5 rounded-[8px] bg-[#2A3A4A] px-4 text-[13px] leading-[19.5px] font-medium text-white"
                onClick={modal.openModal}
                type="button"
            >
                <Plus className="size-3.5" strokeWidth={1.5} />
                강의 등록
            </button>

            {modal.isModal && <CreateLectureModal closeModal={modal.closeModal} />}
        </>
    );
}
