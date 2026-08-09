"use client";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteWorkspaceAction } from "../actions";

export default function WorkspaceDeleteButton({ workspaceId }: { workspaceId: string }) {
    const router = useRouter();
    const deleteModal = useModal(deleteWorkspace);

    async function deleteWorkspace() {
        const response = await deleteWorkspaceAction(Number(workspaceId));

        if (response.success) {
            deleteModal.closeModal();
            toast.success(response.message);
            router.refresh();
        } else {
            toast.error(response.message);
        }
    }

    return (
        <>
            <button
                className=" flex h-7 items-center rounded-[7px] border-1 border-[#D8E5DF] px-2 text-[10px] font-semibold text-[#64748B]  md:h-8  md:text-[12px] lg:h-9  lg:text-[13px]"
                onClick={deleteModal.openModal}
                type="button"
            >
                <Trash2 className="text-[#64748B] h-4 w-4" />
            </button>

            {deleteModal.isModal && (
                <TwoButtonModal
                    title="워크스페이스 삭제"
                    content="삭제하시겠습니까?"
                    closeModal={deleteModal.closeModal}
                    activeModal={deleteModal.activeModal}
                />
            )}
        </>
    )
}
