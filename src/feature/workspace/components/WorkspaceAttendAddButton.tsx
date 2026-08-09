'use client'
import useModal from "@/components/hooks/useModal"
import AddWorkspaceAttendModal from "./modals/AddWorkspaceAttendModal";
import { User } from "lucide-react";

export default function WorkspaceAttendAddButton({ workspaceId }: { workspaceId: string }) {
    const modal = useModal();

    return (
        <>
            <button
                className=" flex h-7 items-center rounded-[7px] border-1 border-[#D8E5DF] px-2 text-[10px] font-semibold text-[#64748B]  md:h-8  md:text-[12px] lg:h-9  lg:text-[13px]"
                onClick={modal.openModal}
                type="button"
                aria-label="워크스페이스 참여자 추가"
            >
                <User className="text-[#64748B] h-4 w-4" />
            </button>
            {modal.isModal &&
                <AddWorkspaceAttendModal
                    closeModal={modal.closeModal}
                    workspaceId={workspaceId} />
            }
        </>
    )
}