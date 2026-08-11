"use client";

import { getRoleListAction } from "@/feature/role/actions";
import { changeEmployeeRoleAction } from "@/feature/members/actions";
import { ChevronDown, X } from "lucide-react";
import { MemberListData } from "../../type";
import { FormEvent, useEffect, useState } from "react";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RoleOption {
    roleId: number;
    name: string;
}

export default function ViewMembersModal({ closeModal, member }: { closeModal: () => void, member: MemberListData }) {
    const [role, setRole] = useState<number | "">(member.roleId ?? "");
    const [roles, setRoles] = useState<RoleOption[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const modal = useModal(closeModal);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        const loadRoles = async () => {
            const response = await getRoleListAction();

            if (!cancelled && response.success) {
                setRoles(response.data ?? []);
            }
        };

        loadRoles();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleClose = () => {
        if (member.roleId !== role) {
            modal.openModal();
            return;
        }
        closeModal();
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!role) {
            toast.error("역할을 선택해주세요.");
            return;
        }
        if (member.roleId === role) {
            return;
        }

        setIsSaving(true);

        try {
            const response = await changeEmployeeRoleAction(member.userId, role);

            if (!response.success) {
                toast.error(response.message);
                setIsSaving(false);
                return;
            }

            toast.success(response.message);
            router.refresh();
            closeModal();
        } catch {
            toast.error("직원 역할 변경에 실패했습니다.");
            setIsSaving(false);
        }
    };

    return (
        <div onClick={handleClose} className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="fixed top-1/2 left-1/2 z-1000 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-7 shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                <div className="flex w-full items-center gap-3.5">
                    <div>
                        <h2 className="text-[18px] font-bold leading-[27px] text-[#0F172A]">{member.name}</h2>
                        <p className="pt-0.5 text-[13px] leading-[19.5px] text-[#64748B]">{member.roleName}</p>
                    </div>

                    <button
                        aria-label="구성원 정보 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        type="button"
                        onClick={handleClose}
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="my-5 h-px w-full bg-[#D7E8DB]" />

                <div className="grid w-full grid-cols-2 gap-4">
                    <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        이름 <span className="text-[#C0483F]">*</span>
                        <div className="flex items-center mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3  text-[14px] font-normal text-[#0F172A] outline-none">
                            {member.name}
                        </div>
                    </label>

                    <label className="relative col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        역할
                        <select
                            className="mt-1.5 h-11 w-full appearance-none rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[14px] font-normal text-[#0F172A] outline-none"
                            onChange={(e) => setRole(Number(e.target.value))}
                            value={role}
                        >
                            <option disabled value="">역할을 선택해주세요.</option>
                            {roles.length === 0 && (
                                <option value={Number(member.roleId)}>{member.roleName}</option>
                            )}
                            {roles.map((item) => (
                                <option key={item.roleId} value={item.roleId}>{item.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 bottom-[17px] size-3 text-[#64748B]" strokeWidth={1.5} />
                    </label>

                    <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                        연락처
                        <div className="flex items-center mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none">
                            {member.phone}
                        </div>
                    </label>

                    <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                        이메일
                        <div className="flex items-center mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none">
                            {member.email}
                        </div>
                    </label>

                    <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        입사일
                        <div className="flex items-center mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none">
                            {member.joinedAt}
                        </div>
                    </label>
                </div>

                <div className="mt-5 flex w-full items-center gap-3 rounded-[10px] border border-[#D7E8DB] bg-[#EDF0F4] px-4 py-3.5">
                    <div>
                        <strong className="block text-[13px] font-semibold leading-[19.5px] text-[#0F172A]">활성 계정</strong>
                        <p className="pt-0.5 text-[12px] leading-[18px] text-[#64748B]">이 계정은 현재 정상 활성 상태입니다.</p>
                    </div>
                    <button
                        className="ml-auto h-9 shrink-0 rounded-[7px] border border-[#C0483F] bg-white px-3.5 text-[12px] font-medium text-[#C0483F]"
                        type="button"
                    >
                        계정 비활성화
                    </button>
                </div>

                <div className="mt-5 flex w-full justify-end gap-2">
                    <button
                        className="h-11 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] text-[#0F172A]"
                        type="button"
                        onClick={handleClose}
                    >
                        취소
                    </button>
                    <button
                        className="h-11 rounded-[8px] bg-[#0F172A] px-5 text-[14px] font-semibold text-white"
                        disabled={isSaving}
                        type="submit"
                    >
                        저장
                    </button>
                </div>
            </form>
            {modal.isModal && (
                <TwoButtonModal
                    closeModal={modal.closeModal}
                    activeModal={modal.activeModal}
                    content={`역할이 저장되지 않았습니다.\n저장하지 않고 나가시겠습니까?`}
                    title="구성원" />
            )}

        </div>
    );
}
