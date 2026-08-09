'use client'

import { Pencil } from "lucide-react";
import EditWorkspaceModal from "./modals/EditWorkspaceModal";
import useModal from "@/components/hooks/useModal";

export default function WorkspaceEditButton({ workspaceId }: { workspaceId: string }) {
    const modal = useModal();
    return (
        <>
            <button
                className="px-2 "
                onClick={modal.openModal}
                type="button"
                aria-label="워크스페이스 이름 수정"
            >
                <Pencil className="text-[#64748B] h-3 w-3 mr-1" />
            </button >
            {
                modal.isModal &&
                <EditWorkspaceModal
                    closeModal={modal.closeModal}
                    workspaceId={workspaceId} />
            }
        </>
    )
}
