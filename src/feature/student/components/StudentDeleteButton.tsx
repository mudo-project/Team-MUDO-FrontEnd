"use client";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteStudentAction } from "../actions";
import { useState } from "react";

export default function StudentDeleteButton({ studentId, closeModal }: { studentId: number, closeModal: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    const deleteStudentModal = useModal();

    const handleDeleteStudent = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        const response = await deleteStudentAction(studentId);
        setIsDeleting(false);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        deleteStudentModal.closeModal();
        closeModal();
        router.refresh();
    };


    return (
        <>
            <button
                className=" flex h-7 items-center rounded-[7px] border-1 border-[#D8E5DF] px-2 text-[10px] font-semibold text-[#64748B]  md:h-8  md:text-[12px] lg:h-9  lg:text-[13px]"
                onClick={deleteStudentModal.openModal}
                type="button"
                aria-label="학생 삭제"
            >
                <Trash2 className="text-[#64748B] h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>

            {deleteStudentModal.isModal && (
                <TwoButtonModal
                    title="원생 삭제"
                    content="삭제하시겠습니까?"
                    closeModal={deleteStudentModal.closeModal}
                    activeModal={handleDeleteStudent}
                />
            )}
        </>
    )
}
