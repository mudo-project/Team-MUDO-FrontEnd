"use client";

import { changeRoleAction, RoleActionResult } from "@/feature/role/actions";
import { Check, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

const roleColors = [
    "#2C8D50",
    "#3E7D62",
    "#E8A838",
    "#9B59B6",
    "#1AADA4",
    "#E67E22",
    "#C0483F",
    "#607D8B",
];

const initialState: RoleActionResult = {
    success: false,
    message: "",
};

interface EditRoleModalProps {
    closeModal: () => void;
    role: RoleListData;
}

export default function EditRoleModal({ closeModal, role }: EditRoleModalProps) {
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState(
        role.color ?? roleColors[0],
    );
    const changeRoleFormAction = changeRoleAction.bind(null, role.roleId);
    const [state, formAction, isPending] = useActionState(
        changeRoleFormAction,
        initialState,
    );

    useEffect(() => {
        if (!state.message) return;

        if (state.success) {
            toast.success(state.message);
            closeModal();
            router.refresh();
            return;
        }

        toast.error(state.message);
    }, [state, closeModal, router]);

    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/45"
            onClick={closeModal}
        >
            <form
                action={formAction}
                className="fixed top-1/2 left-1/2 z-1000 w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_12px_rgba(22,34,54,0.12)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex h-[27px] w-full items-center">
                    <h2 className="text-[18px] leading-[27px] font-bold text-[#0F172A]">
                        역할 수정
                    </h2>
                    <button
                        aria-label="역할 수정 모달 닫기"
                        className="ml-auto flex size-[18px] items-center justify-center text-[#64748B]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-5 w-full">
                    <label
                        className="block pb-1.5 text-[13px] leading-[19.5px] font-medium text-[#0F172A]"
                        htmlFor={`role-name-${role.roleId}`}
                    >
                        역할 이름
                    </label>
                    <input
                        className="h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] focus:outline-none"
                        defaultValue={role.name}
                        id={`role-name-${role.roleId}`}
                        maxLength={50}
                        name="name"
                        required
                    />
                </div>

                <div className="mt-5 w-full">
                    <label
                        className="block pb-1.5 text-[13px] leading-[19.5px] font-medium text-[#0F172A]"
                        htmlFor={`role-description-${role.roleId}`}
                    >
                        역할 설명
                    </label>
                    <input
                        className="h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] focus:outline-none"
                        defaultValue={role.description ?? ""}
                        id={`role-description-${role.roleId}`}
                        maxLength={255}
                        name="description"
                    />
                </div>

                <fieldset className="mt-5 w-full">
                    <legend className="text-[13px] leading-[19.5px] font-medium text-[#0F172A]">
                        역할 색상
                    </legend>
                    <div className="flex w-full gap-2 pt-2.5">
                        {roleColors.map((color, index) => (
                            <label
                                aria-label={`역할 색상 ${index + 1}`}
                                className="flex size-7 cursor-pointer items-center justify-center rounded-full"
                                htmlFor={`edit-role-color-${role.roleId}-${index}`}
                                key={color}
                                style={{ backgroundColor: color }}
                            >
                                <input
                                    checked={selectedColor === color}
                                    className="sr-only"
                                    id={`edit-role-color-${role.roleId}-${index}`}
                                    name="color"
                                    onChange={() => setSelectedColor(color)}
                                    type="radio"
                                    hidden
                                    value={color}
                                />
                                {selectedColor === color && (
                                    <Check
                                        className="size-3.5 text-white"
                                        strokeWidth={2.5}
                                    />
                                )}
                            </label>
                        ))}
                        <label htmlFor="colorPicker" className="relative block cursor-pointer rounded-[8px] border border-[#D7E8DB] size-7 rounded-full">

                            <span className="z-20 w-4 h-4 p-0.5 bg-black rounded-full absolute top-[-4px] right-[-4px] flex justify-center items-center">
                                <Pencil className="text-white size-3" />
                            </span>
                            <span
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: selectedColor }}
                            >

                            </span>

                            <input
                                aria-label="직접 역할 색상 선택"
                                name="color"
                                onChange={(event) => setSelectedColor(event.target.value)}
                                type="color"
                                value={selectedColor}
                                className="absolute inset-0 size-full cursor-pointer opacity-0"
                                id="colorPicker"
                            />
                        </label>
                    </div>
                </fieldset>

                <div className="mt-5 flex w-full justify-end gap-2">
                    <button
                        className="h-11 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-[14px] leading-[21px] font-normal text-[#0F172A]"
                        onClick={closeModal}
                        type="button"
                    >
                        취소
                    </button>
                    <button
                        className="h-11 rounded-[8px] bg-[#0F172A] px-5 text-[14px] leading-[21px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isPending}
                        type="submit"
                    >
                        {isPending ? "수정 중..." : "수정"}
                    </button>
                </div>

                {!state.success && state.message && (
                    <p
                        className="pt-3 text-[12px] leading-[18px] text-[#C0483F]"
                        role="alert"
                    >
                        {state.message}
                    </p>
                )}
            </form>
        </div>
    );
}
