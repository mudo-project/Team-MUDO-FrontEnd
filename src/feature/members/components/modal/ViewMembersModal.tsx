"use client";

import { getRoleListAction } from "@/feature/role/actions";
import { changeMemberStatusAction, updateMemberAction } from "@/feature/members/actions";
import { ChevronDown, X } from "lucide-react";
import { MemberAccountStatus, MemberListData } from "../../type";
import { useEffect, useRef, useState } from "react";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authEditFormInput, authEditFormValues, authEditSchema } from "@/lib/authSchema";
import { format } from "date-fns";

interface RoleOption {
    roleId: number;
    name: string;
}

const status = {
    ACTIVE: '활성',
    INACTIVE: '휴직',
    RESIGNED: '퇴사'
}

export default function ViewMembersModal({ closeModal, member }: { closeModal: () => void, member: MemberListData }) {
    const [roles, setRoles] = useState<RoleOption[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<MemberAccountStatus>("ACTIVE");

    const statusModal = useModal(clickButton);

    const router = useRouter();

    //구성원 정보 수정
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm<authEditFormInput, unknown, authEditFormValues>({
        resolver: zodResolver(authEditSchema),
        defaultValues: {
            name: member.name,
            email: member.email,
            phone: member.phone,
            joinedAt: format(member.joinedAt, 'yyyy-MM-dd'),
            roleId: member.roleId
        },
        mode: 'onSubmit',
    });


    //역할 목록 불러오기
    useEffect(() => {
        let cancelled = false;
        setFocus("name");

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
    }, [setFocus]);

    const onSubmit = async (data: authEditFormValues) => {
        const newName = data.name === member.name ? ({}) : ({ name: data.name });
        const newJoinedAt = data.joinedAt === format(member.joinedAt, 'yyyy-MM-dd') ? ({}) : ({ joinedAt: `${data.joinedAt}T00:00:00` })
        const newEmail = data.email === member.email ? ({}) : ({ email: data.email });
        const newPhone = data.phone === member.phone ? ({}) : ({ phone: data.phone });
        const newRole = data.roleId === member.roleId ? ({}) : ({ roleId: Number(data.roleId) })

        const payload = {
            ...newName, ...newJoinedAt, ...newEmail, ...newPhone, ...newRole
        }


        setIsSaving(true);

        try {
            const response = await updateMemberAction(member.userId, payload);


            if (!response.success) {
                toast.error(response.message);
                setIsSaving(false);
                return;
            }

            toast.success(response.message);
            router.refresh();
            closeModal();
        } catch {
            toast.error("직원 정보 수정에 실패했습니다.");
            setIsSaving(false);
        }
    };


    //계정 상태 변경
    async function clickButton() {
        const response = await changeMemberStatusAction(member.userId, selectedStatus);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        toast.success(response.message);
        router.refresh();
    }


    return (
        <div onClick={closeModal} className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45">
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(onSubmit)} className="flex-col overflow-hidden flex max-h-[450px] md:max-h-[550px] w-[90%] sm:w-4/5 md:w-[580px] fixed top-1/2 left-1/2 z-1000  -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white  shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                <div className="flex shrink-0  w-full items-center gap-3.5 pb-0 px-5 pt-5 sm:px-6 md:px-7 ">
                    <div>
                        <h2 className="text-[15px] sm:text-base md:text-[18px] font-bold leading-[27px] text-[#0F172A]">{member.name}</h2>
                        <p className="pt-0.5 text-[13px] leading-[19.5px] text-[#64748B]">{member.roleName}</p>
                    </div>

                    <button
                        aria-label="구성원 정보 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        type="button"
                        onClick={closeModal}
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-5 h-1px w-full bg-[#D7E8DB] " />
                <section className="flex-1 overflow-y-auto min-h-0  p-5 sm:p-6 md:p-7">
                    <div className=" grid w-full grid-cols-2 gap-4 ">
                        <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                            이름 <span className="text-[#C0483F]">*</span>
                            <input
                                {...register('name')}
                                placeholder="이름을 입력해주세요"
                                className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3  text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]" />
                        </label>
                        {errors.name?.message && <p className="-mt-[14px] text-[12px] text-[#C0483F]">{errors.name?.message}</p>}

                        <label className="relative col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                            역할
                            <select
                                className="mt-1.5 h-11 w-full appearance-none rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]"
                                {...register('roleId')}
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
                        {errors.roleId?.message && <p className="-mt-[14px] text-[12px] text-[#C0483F]">{errors.roleId?.message}</p>}

                        <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                            연락처
                            <input
                                {...register('phone')}
                                placeholder="전화번호를 입력해주세요"
                                className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3  text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]" />
                        </label>
                        {errors.phone?.message && <p className="-mt-[14px] text-[12px] text-[#C0483F]">{errors.phone?.message}</p>}


                        <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                            이메일
                            <input
                                {...register('email')}
                                placeholder="이메일을 입력해주세요"
                                className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3  text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]" />
                        </label>
                        {errors.email?.message && <p className="-mt-[14px] text-[12px] text-[#C0483F]">{errors.email?.message}</p>}


                        <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                            입사일
                            <input
                                {...register('joinedAt')}
                                type="date"
                                placeholder="입사일을 선택해주세요"
                                className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3  text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]" />
                        </label>
                        {errors.joinedAt?.message && <p className="-mt-[14px] text-[12px] text-[#C0483F]">{errors.joinedAt?.message}</p>}

                    </div>

                    <div className="mt-5 flex w-full items-center gap-3 rounded-[10px] border border-[#D7E8DB] bg-[#EDF0F4] px-4 py-3.5">
                        <div>
                            <strong className="block text-[13px] font-semibold leading-[19.5px] text-[#0F172A]">{status[member.status]} 계정</strong>
                            <p className="sm:block hidden pt-0.5 text-[12px] leading-[18px] text-[#64748B]">이 계정은 현재 {status[member.status]} 상태입니다.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-1 ml-auto">
                            {member.status !== 'ACTIVE' &&
                                <button
                                    className=" h-9 shrink-0 rounded-[7px] border border-[#2C8D50] bg-white px-3.5 text-[12px] font-medium text-[#2C8D50]"
                                    onClick={() => { setSelectedStatus('ACTIVE'); statusModal.openModal(); }}
                                    type="button"
                                >
                                    계정 활성화
                                </button>}
                            {member.status !== 'INACTIVE' &&
                                <button
                                    className="h-9 shrink-0 rounded-[7px] border border-[#D7E8DB] bg-white px-3.5 text-[12px] font-medium text-[#64748B]"
                                    onClick={() => { setSelectedStatus('INACTIVE'); statusModal.openModal(); }}
                                    type="button"
                                >
                                    휴직 처리
                                </button>}
                            {member.status !== 'RESIGNED' &&
                                <button
                                    className=" h-9 shrink-0 rounded-[7px] border border-[#C0483F] bg-white px-3.5 text-[12px] font-medium text-[#C0483F]"
                                    onClick={() => { setSelectedStatus('RESIGNED'); statusModal.openModal(); }}
                                    type="button"
                                >
                                    퇴사 처리
                                </button>}
                        </div>
                    </div>
                </section>
                <div className="p-5 sm:p-6 md:p-7 pt-3 flex w-full justify-end gap-2">
                    <button
                        className="h-11 w-full rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] text-[#0F172A]"
                        type="button"
                        onClick={closeModal}
                    >
                        취소
                    </button>
                    <button
                        className="h-11 w-full rounded-[8px] bg-[#0F172A] px-5 text-[14px] font-semibold text-white"
                        disabled={isSaving}
                        type="submit"
                    >
                        저장
                    </button>
                </div>
            </form>

            {statusModal.isModal &&
                (
                    <TwoButtonModal
                        closeModal={statusModal.closeModal}
                        title={`${status[selectedStatus]} 처리`}
                        content={`해당 직원을 ${status[selectedStatus]} 처리 하시겠습니까?`}
                        activeModal={statusModal.activeModal}
                    />
                )
            }

        </div>
    );
}
