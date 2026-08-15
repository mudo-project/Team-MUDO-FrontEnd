"use client";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteWorkspaceAction } from "../actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function WorkspaceDeleteButton({ workspaceId }: { workspaceId: string }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const deleteModal = useModal();
    const deleteWorkspaceMutation = useMutation({
        mutationFn: () => deleteWorkspaceAction(Number(workspaceId)),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.message);
                return;
            }

            queryClient.removeQueries({
                queryKey: ["workspace", workspaceId],
                exact: true,
            });
            void queryClient.invalidateQueries({
                queryKey: ["workspace-list", "MINE"],
            });
            deleteModal.closeModal();
            toast.success(result.message);
            router.replace("/workspace/my-works");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <>
            <button
                className=" flex h-7 items-center rounded-[7px] border-1 border-[#D8E5DF] px-2 text-[10px] font-semibold text-[#64748B]  md:h-8  md:text-[12px] lg:h-9  lg:text-[13px]"
                onClick={deleteModal.openModal}
                type="button"
                aria-label="워크스페이스 삭제"
            >
                <Trash2 className="text-[#64748B] h-4 w-4" />
            </button>

            {deleteModal.isModal && (
                <TwoButtonModal
                    title="워크스페이스 삭제"
                    content="삭제하시겠습니까?"
                    closeModal={deleteModal.closeModal}
                    activeModal={() => deleteWorkspaceMutation.mutate()}
                    isPending={deleteWorkspaceMutation.isPending}
                />
            )}
        </>
    )
}
