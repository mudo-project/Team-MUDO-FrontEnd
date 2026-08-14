"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { deleteLectureAction } from "../actions";

export default function LectureDeleteButton({ closeModal, lectureId }: { closeModal: () => void; lectureId: number }) {
    const router = useRouter();
    const confirmModal = useModal();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteLecture = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        const response = await deleteLectureAction(lectureId);
        setIsDeleting(false);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        confirmModal.closeModal();
        closeModal();
        router.refresh();
    };

    return (
        <>
            <button aria-label="강의 삭제" className="flex h-7 items-center rounded-[7px] border border-[#D8E5DF] px-2 text-[#64748B] md:h-8 lg:h-9" disabled={isDeleting} onClick={confirmModal.openModal} type="button">
                <Trash2 className="size-4" />
            </button>
            {confirmModal.isModal && <TwoButtonModal activeModal={deleteLecture} closeModal={confirmModal.closeModal} content="삭제하시겠습니까?" title="강의 삭제" />}
        </>
    );
}
