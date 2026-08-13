'use query'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspaceTaskAction } from "../actions";
import { toast } from "sonner";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import useModal from "@/components/hooks/useModal";

export default function TaskDeleteButton({ workspaceId, selectedTask, setSelectedTask }: { workspaceId: string, selectedTask: number, setSelectedTask: Dispatch<SetStateAction<number | undefined>> }) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () =>
            deleteWorkspaceTaskAction(Number(workspaceId), selectedTask),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.message);
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });

            setSelectedTask(undefined);
            toast.success(result.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const modal = useModal(deleteMutation.mutate);


    return (
        <>
            <button
                aria-label="업무 삭제"
                disabled={deleteMutation.isPending}
                onClick={modal.openModal}
                type="button"
                className="text-[#B0B8C1] ml-auto"
            >
                <Trash2 className="w-4 h-4 " />
            </button>
            {modal.isModal &&
                <TwoButtonModal
                    closeModal={modal.closeModal}
                    content="삭제하시겠습니까?"
                    title="업무 삭제"
                    activeModal={modal.activeModal}
                />
            }

        </>
    )
}