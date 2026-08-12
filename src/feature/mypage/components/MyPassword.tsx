"use client";

import { MyPasswordFormValues, myPasswordSchema } from "@/lib/myPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { changeMyPasswordAction } from "../actions";

export default function MyPassword() {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MyPasswordFormValues>({
        resolver: zodResolver(myPasswordSchema),
        mode: "onChange",
    });


    const onSubmit = async (data: MyPasswordFormValues) => {
        setIsSaving(true);

        try {
            const response = await changeMyPasswordAction({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (!response.success) {
                toast.error(response.message);
                setIsSaving(false);
                return;
            }

            toast.success(response.message);
            router.refresh();
        } catch {
            toast.error("비밀번호 변경에 실패했습니다.");
            setIsSaving(false);
        }
    };


    return (
        <form
            className="w-full rounded-[12px] bg-white p-7 border-1 border-[#D7E8DB]"
            onSubmit={handleSubmit(onSubmit)}
        >

            <div className="grid w-full grid-cols-1 gap-4">

                <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                    현재 비밀번호
                    <input
                        {...register("currentPassword")}
                        className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]"
                        placeholder="현재 비밀번호를 입력해주세요"
                        type="password"
                    />
                    {errors.currentPassword?.message && <p className="pt-1 text-[12px] text-[#C0483F]">{errors.currentPassword.message}</p>}
                </label>

                <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                    수정할 비밀번호
                    <input
                        {...register("newPassword")}
                        className="mt-1.5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]"
                        placeholder="새 비밀번호를 입력해주세요"
                        type="password"
                    />
                    {errors.newPassword?.message && <p className="pt-1 text-[12px] text-[#C0483F]">{errors.newPassword.message}</p>}
                </label>

                <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                    수정할 비밀번호 확인
                    <input
                        {...register("confirmPassword")}
                        className="mt-1.5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]"
                        placeholder="새 비밀번호를 다시 입력해주세요"
                        type="password"
                    />
                    {errors.confirmPassword?.message && <p className="pt-1 text-[12px] text-[#C0483F]">{errors.confirmPassword.message}</p>}
                </label>

            </div>

            <div className="mt-5 flex w-full justify-end gap-2">
                <button
                    className="h-11 rounded-[8px] bg-[#0F172A] px-5 text-[14px] font-semibold text-white"
                    disabled={isSaving}
                    type="submit"
                >
                    저장
                </button>
            </div>
        </form>
    );
}
