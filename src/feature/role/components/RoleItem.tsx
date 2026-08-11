"use client";

import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { deleteRoleAction } from "@/feature/role/actions";
import { MoreHorizontal, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import EditRoleModal from "./modal/EditRoleModal";

interface RoleItemProps {
    isSelected: boolean;
    role: RoleListData;
}

export default function RoleItem({ isSelected, role }: RoleItemProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const editModal = useModal();
    const deleteModal = useModal(deleteRole);

    async function deleteRole() {
        const response = await deleteRoleAction(role.roleId);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        deleteModal.closeModal();
        toast.success(response.message);

        if (isSelected) {
            router.replace("/role");
        }
        router.refresh();
    }

    const openEditModal = () => {
        setIsMenuOpen(false);
        editModal.openModal();
    };

    const openDeleteModal = () => {
        setIsMenuOpen(false);
        deleteModal.openModal();
    };

    return (
        <div
            className={`relative flex h-11 w-full items-center rounded-[8px] border-l-[2px] ${isSelected
                ? "border-[#2C8D50] bg-[#F2F8F4]"
                : "border-transparent bg-transparent"
                }`}
        >
            <Link
                className="flex h-full min-w-0 flex-1 items-center gap-2.5 pl-3"
                href={`/role?roleId=${role.roleId}`}
            >
                <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: role.color ?? "#0F172A" }}
                />
                <span className="truncate text-[14px] leading-[21px] font-normal text-[#0F172A]">
                    {role.name}
                </span>
                <span className="ml-auto shrink-0 text-[12px] leading-[18px] font-normal text-[#64748B]">
                    {role.memberCount}명
                </span>
            </Link>

            <button
                aria-expanded={isMenuOpen}
                aria-label={`${role.name} 역할 메뉴`}
                className="mr-1 flex size-8 shrink-0 items-center justify-center rounded-[6px] text-[#64748B] hover:bg-[#E7F1E9]"
                onClick={() => setIsMenuOpen((current) => !current)}
                type="button"
            >
                <MoreVertical className="size-4" strokeWidth={1.5} />
            </button>

            {isMenuOpen && (
                <div className="absolute top-10 right-1 z-20 w-[104px] rounded-[8px] border border-[#D7E8DB] bg-white p-1 shadow-[0_4px_12px_rgba(22,34,54,0.12)]">
                    <button
                        className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-[13px] text-[#0F172A] hover:bg-[#F2F8F4]"
                        onClick={openEditModal}
                        type="button"
                    >
                        수정
                    </button>
                    <button
                        className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-[13px] text-[#C0483F] hover:bg-[#FFF4F2]"
                        onClick={openDeleteModal}
                        type="button"
                    >
                        삭제
                    </button>
                </div>
            )}

            {editModal.isModal && (
                <EditRoleModal closeModal={editModal.closeModal} role={role} />
            )}
            {deleteModal.isModal && (
                <TwoButtonModal
                    activeModal={deleteModal.activeModal}
                    closeModal={deleteModal.closeModal}
                    content="삭제하시겠습니까?"
                    title="역할 삭제"
                />
            )}
        </div>
    );
}
