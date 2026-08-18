import { Pencil, Trash2 } from "lucide-react";
import UpdateStudentModal from "./modal/UpdateStudentModal";
import useModal from "@/components/hooks/useModal";
import { StudentDetailData } from "../type";

export default function StudentUpdateButton({ refreshStudent, student, studentId }: { refreshStudent: () => Promise<void>, student: StudentDetailData | undefined, studentId: number }) {
    const updateStudentModal = useModal();

    return (
        <>
            <button
                className=" flex h-7 items-center rounded-[7px] border-1 border-[#D8E5DF] px-2 text-[10px] font-semibold text-[#64748B]  md:h-8  md:text-[12px] lg:h-9  lg:text-[13px]"
                onClick={updateStudentModal.openModal}
                type="button"
                aria-label="학생 수정"
            >
                <Pencil className="text-[#64748B] h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
            {updateStudentModal.isModal && student && (
                <UpdateStudentModal
                    closeModal={updateStudentModal.closeModal}
                    onUpdated={refreshStudent}
                    student={student}
                    studentId={studentId}
                />
            )}
        </>
    )
}