"use client";

import { myInfoUpdateFormValues, myInfoUpdateSchema } from "@/lib/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getMyProfileAction, updateMyProfileAction } from "../actions";
import { MyProfileData } from "../type";

export default function MyInfo({ profile }: { profile: MyProfileData }) {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<myInfoUpdateFormValues>({
        defaultValues: {
            phone: profile.phone ?? '',
            email: profile.email ?? ''
        },
        resolver: zodResolver(myInfoUpdateSchema),
        mode: "onSubmit",
    });



    const onSubmit = async (data: myInfoUpdateFormValues) => {
        setIsSaving(true);

        try {
            const response = await updateMyProfileAction(data);

            if (!response.success) {
                toast.error(response.message);
                setIsSaving(false);
                return;
            }

            toast.success(response.message);
            router.refresh();
        } catch {
            toast.error("내 정보 수정에 실패했습니다.");
            setIsSaving(false);
        }
    };

    if (!profile) return null;

    return (
        <form
            className="w-full col-span-2 rounded-[12px] bg-white p-7 border-1 border-[#D7E8DB]"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="grid w-full grid-cols-2 gap-4">
                <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                    이름 <span className="text-[#C0483F]">*</span>
                    <div className="mt-1.5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] bg-[#EDF0F470] px-3 text-[14px] font-normal text-[#0F172A]">
                        {profile.name}
                    </div>
                </label>

                <label className="relative col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                    역할
                    <div className="mt-1.5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] bg-[#EDF0F470] px-3 text-[14px] font-normal text-[#0F172A]">
                        {profile.roleName ?? "역할 없음"}
                    </div>
                </label>

                <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                    연락처
                    <input
                        {...register("phone")}
                        className="mt-1.5 h-11 w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]"
                        placeholder="전화번호를 입력해주세요"
                    />
                    {errors.phone?.message && <p className="pt-1 text-[12px] text-[#C0483F]">{errors.phone.message}</p>}
                </label>

                <label className="text-[12px] font-medium leading-[18px] text-[#64748B]">
                    이메일
                    <input
                        {...register("email")}
                        className="mt-1.5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] px-3 text-[14px] font-normal text-[#0F172A] outline-none focus:border-2 focus:border-[#B7D5BE]"
                        placeholder="이메일을 입력해주세요"
                    />
                    {errors.email?.message && <p className="pt-1 text-[12px] text-[#C0483F]">{errors.email.message}</p>}
                </label>

                <label className="col-span-2 text-[12px] font-medium leading-[18px] text-[#64748B]">
                    입사일
                    <div className="mt-1.5 flex h-11 w-full items-center rounded-[8px] border border-[#D7E8DB] bg-[#EDF0F470] px-3 text-[14px] font-normal text-[#0F172A]">
                        {format(profile.joinedAt, "yyyy-MM-dd")}
                    </div>
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
