"use client";

import { getRoleListAction } from "@/feature/role/actions";
import { ChevronDown, Copy, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { authFormInput, authFormValues, authSchema } from "@/lib/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEmployeeAccountAction } from "../../actions";
import { CreateEmployeeAccountRequest } from "../../type";

interface RoleOption {
    roleId: number;
    name: string;
}

interface Temporary {
    username: string;
    temporaryPassword: string;
}

export default function CreateMemberModal({ closeModal }: { closeModal: () => void }) {
    const [roles, setRoles] = useState<RoleOption[]>([]);
    const [temporary, setTemporary] = useState<Temporary>({
        username: '',
        temporaryPassword: ''
    });
    const modal = useModal(handleCloseAll);
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<authFormInput, unknown, authFormValues>({
        resolver: zodResolver(authSchema),
        mode: 'onSubmit',
    });

    const handleClose = () => {
        if (temporary.temporaryPassword || temporary.username) {
            modal.openModal();
            return;
        }
        closeModal();
    }

    function handleCloseAll() {
        modal.closeModal();
        closeModal();
        router.refresh();
    }

    const onSubmit = async (data: authFormValues) => {
        const payload: CreateEmployeeAccountRequest = {
            name: data.name,
            username: data.username,
            roleId: data.roleId,
        }

        try {
            const response = await createEmployeeAccountAction(payload);

            if (response.success) {
                toast.success(response.message);
                setTemporary({
                    username: response.data?.username ?? '',
                    temporaryPassword: response.data?.temporaryPassword ?? ''
                })
            } else {
                toast.error(response.message);
            }
        } catch {
            toast.error("네트워크 연결이 원활하지 않습니다.");
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`아이디: ${temporary.username} 비밀번호: ${temporary.temporaryPassword}`);

            toast.success('복사되었습니다')
        } catch (error) {
            toast.error('복사 실패하였습니다')
        }
    };



    return (
        <div onClick={handleClose} className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(onSubmit)} className="fixed top-1/2 left-1/2 z-1000 w-11/12 sm:w-4/5 md:w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-5 sm:p-6 md:p-7 shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                <div className="flex w-full items-center gap-3.5">
                    <div>
                        <h2 className="text-[15px] sm:text-base md:text-[18px] font-bold leading-[27px] text-[#0F172A]">계정 생성</h2>
                        <p className="pt-0.5 text-[13px] leading-[19.5px] text-[#64748B]">새 구성원 계정을 만듭니다</p>
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
                        <input
                            {...register('name')}
                            placeholder="이름을 입력해주세요"
                            className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3  text-[14px] font-normal text-[#0F172A] outline-none" />
                    </label>
                    {errors.name?.message && <p>{errors.name.message}</p>}
                    <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        아이디 <span className="text-[#C0483F]">*</span>
                        <input
                            {...register('username')}
                            placeholder="아이디를 입력해주세요"
                            className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3  text-[14px] font-normal text-[#0F172A] outline-none" />
                    </label>
                    {errors.username?.message && <p>{errors.username.message}</p>}


                    <label className="relative col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                        역할
                        <select
                            {...register("roleId")}
                            className="mt-1.5 h-11 w-full appearance-none rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[14px] font-normal text-[#0F172A] outline-none"
                        >
                            <option disabled value="">역할을 선택해주세요.</option>
                            {roles.map((item) => (
                                <option key={item.roleId} value={item.roleId}>{item.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 bottom-[17px] size-3 text-[#64748B]" strokeWidth={1.5} />
                    </label>
                    {errors.roleId?.message && <p>{errors.roleId.message}</p>}


                </div>
                {(temporary.username && temporary.temporaryPassword) ? (
                    <div className="mt-5 flex w-full items-center gap-5 rounded-[10px] border border-[#D7E8DB] bg-[#EDF0F4] px-4 py-3.5">
                        <button
                            type="button"
                            onClick={handleCopy}
                            aria-label="링크 복사"
                        >
                            <Copy size={14} />
                        </button>
                        <div>
                            <p className="text-[13px] font-semibold leading-[19.5px] text-[#0F172A]">아이디: {temporary.username} </p>
                            <p className="text-[13px] font-semibold leading-[19.5px] text-[#0F172A]">비밀번호: {temporary.temporaryPassword} </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-5 flex w-full justify-end gap-2">
                        <button
                            className="h-[41px] w-full rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[13px] font-normal leading-[19.5px] text-[#6B7280]"
                            type="button"
                            onClick={handleClose}
                        >
                            취소
                        </button>
                        <button
                            className="h-[41px] w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting ? "저장 중..." : "저장"}
                        </button>
                    </div>
                )}
            </form>
            {modal.isModal && (
                <TwoButtonModal
                    closeModal={modal.closeModal}
                    activeModal={modal.activeModal}
                    content={`임시비밀번호는 재조회가 불가능합니다. 저장하셨습니까?`}
                    title="계정 생성" />
            )}

        </div>
    );
}
