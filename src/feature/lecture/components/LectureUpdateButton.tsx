"use client";

import { Pencil } from "lucide-react";
import useModal from "@/components/hooks/useModal";
import { LectureDetailData } from "../type";
import EditLectureModal from "./modal/EditLectureModal";

interface LectureUpdateButtonProps {
    lecture: LectureDetailData;
    lectureId: number;
    onUpdated: () => void | Promise<void>;
}

export default function LectureUpdateButton({ lecture, lectureId, onUpdated }: LectureUpdateButtonProps) {
    const modal = useModal();

    return (
        <>
            <button aria-label="강의 수정" className="flex h-7 items-center rounded-[7px] border border-[#D8E5DF] px-2 text-[#64748B] md:h-8 lg:h-9" onClick={modal.openModal} type="button">
                <Pencil className="size-4" />
            </button>
            {modal.isModal && (
                <EditLectureModal
                    closeModal={modal.closeModal}
                    lecture={lecture}
                    lectureId={lectureId}
                    onUpdated={onUpdated}
                />
            )}
        </>
    );
}
