"use client";

import useModal from "@/components/hooks/useModal";
import { Plus } from "lucide-react";
import CreateRoleModal from "./modal/CreateRoleModal";

export default function RoleCreateButton() {
    const modal = useModal();

    return (
        <>
            <button
                aria-label="역할 추가"
                className="ml-auto flex size-7 items-center justify-center rounded-[6px] text-[#64748B]"
                onClick={modal.openModal}
                type="button"
            >
                <Plus className="size-4" strokeWidth={1.5} />
            </button>
            {modal.isModal && <CreateRoleModal closeModal={modal.closeModal} />}
        </>
    );
}
