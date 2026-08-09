'use client'

import useModal from "@/components/hooks/useModal";
import ApprovalTemplateModal from "./modal/ApprovalTemplateModal";
import EditApprovalTemplateModal from "./modal/EditApprovalTemplateModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { deleteApprovalTemplateAction } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TemplateDetailButton({
    id,
    children,
}: Readonly<{
    id: number,
    children: React.ReactNode;
}>) {
    const route = useRouter();
    const editModal = useModal();
    const deleteModal = useModal(deleteTemplate);
    const modal = useModal(editModal.openModal, deleteModal.openModal);

    async function deleteTemplate() {
        const response = await deleteApprovalTemplateAction(id)
        if (response.success) {
            modal.closeModal();
            deleteModal.closeModal();
            toast.success(response.message)
            route.refresh();
        } else {
            toast.error(response.message)
        }
    }

    return (
        <>
            <button
                onClick={modal.openModal}
                type="button"
                className="w-full text-left grid h-11 grid-cols-9 items-center border-b border-[#F7F8F9] px-1 last:border-b-0 sm:px-2 md:h-[47px] md:px-3 lg:h-[49px] lg:grid-cols-11 lg:px-5"
            >
                {children}
            </button>
            {modal.isModal &&
                <ApprovalTemplateModal
                    id={id}
                    closeModal={modal.closeModal}
                    activeModal={modal.activeModal}
                    noneActiveModal={modal.noneActiveModal}
                />
            }
            {editModal.isModal &&
                <EditApprovalTemplateModal
                    id={id}
                    closeModal={editModal.closeModal}
                />
            }
            {deleteModal.isModal &&
                <TwoButtonModal
                    title='템플릿 삭제'
                    content="삭제하시겠습니까?"
                    closeModal={deleteModal.closeModal}
                    activeModal={deleteModal.activeModal}
                />}
        </>
    )
}