'use client'

import useModal from "@/components/hooks/useModal";
import CreateTaskModal from "./modals/CreateTaskModal";

export default function TaskAddButton({ workspaceId }: { workspaceId: string }) {
    const modal = useModal();

    return (
        <>
            <button onClick={modal.openModal} className="flex h-8 w-full items-center rounded-[7px] border border-dashed border-[#E1E5EA] px-2 text-[10px] leading-[16px] text-[#C2C8D1] sm:text-[11px] md:px-3 lg:h-9 lg:rounded-[8px] lg:px-3.5 lg:text-[12px] lg:leading-[18px]">
                <span className="mr-1 text-[12px] font-light sm:text-[13px] lg:mr-1.5 lg:text-[14px]">＋</span> 업무 추가
            </button>
            {modal.isModal &&
                <CreateTaskModal closeModal={modal.closeModal} workspaceId={workspaceId} />
            }
        </>
    )
}