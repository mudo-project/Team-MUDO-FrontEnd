'use client'

import { Plus } from "lucide-react";

import useModal from "@/components/hooks/useModal";
import CreateLectureModal from "./modal/CreateLectureModal";
import { LectureTermData } from "../type";
import { useUserStore } from "@/store/useUserStore";

interface CreateLectureButtonProps {
    classrooms?: string[];
    subjects?: string[];
    teachers?: string[];
    terms?: LectureTermData[];
}

export default function CreateLectureButton({ classrooms = [], subjects = [], teachers = [], terms = [] }: CreateLectureButtonProps) {
    const permissions = useUserStore((state) => state.permissions);
    const modal = useModal();

    return (
        <>
            {permissions.includes("LECTURE:MANAGE") && (
                <>
                    <button
                        className="min-w-[70px] ml-auto md:ml-0 flex h-7 md:h-8 lg:h-9 items-center gap-1 md:gap-1.5 lg:gap-1.5 rounded-[8px] bg-[#2A3A4A] px-2.5 md:px-3.5 lg:px-4 text-[12px] md:text-[13px] leading-[19.5px] font-medium text-white"
                        onClick={modal.openModal}
                        type="button"
                    >
                        <Plus className="size-3 md:size-3.5" strokeWidth={1.5} />
                        강의 등록
                    </button>

                    {modal.isModal && (
                        <CreateLectureModal
                            classrooms={classrooms}
                            closeModal={modal.closeModal}
                            subjects={subjects}
                            teachers={teachers}
                            terms={terms}
                        />
                    )}
                </>
            )}
        </>
    );
}
