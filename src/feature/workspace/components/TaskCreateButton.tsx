'use client'

import useModal from "@/components/hooks/useModal";
import CreateTaskModal from "./modals/CreateTaskModal";

export default function TaskCreateButton({ workspaceId }: { workspaceId: string }) {
    const modal = useModal();
    return (
        <>
            <button
                onClick={modal.openModal}
                className=" flex h-7 items-center rounded-[7px] bg-[#1D2639] px-2 text-[10px] font-semibold text-white  md:h-8 md:px-3 md:text-[12px] lg:h-9 lg:px-4 lg:text-[13px]">
                <span className="mr-1 text-[14px] font-light md:mr-1.5 md:text-base lg:mr-2 lg:text-lg">＋</span>
                업무 등록
            </button>
            {modal.isModal &&
                <CreateTaskModal closeModal={modal.closeModal} workspaceId={workspaceId} />
            }

        </>
    )
}