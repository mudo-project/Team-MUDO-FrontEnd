'use client'

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PasswordSetupFormValues, passwordSetupSchema } from "@/lib/passwordSetupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { setupPasswordAction } from "../actions";
import { toast } from "sonner";

export default function PasswordForm({ username, tempPassword }: { username: string, tempPassword: string }) {
    const route = useRouter();
    const [toggleEye, setToggleEye] = useState<boolean>(true);
    const [toggleEyeCheck, setToggleEyeCheck] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordSetupFormValues>({
        resolver: zodResolver(passwordSetupSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: PasswordSetupFormValues) => {
        const payload = {
            username, tempPassword, newPassword: data.newPassword
        }

        try {
            const response = await setupPasswordAction(payload);
            if (response.success) {
                toast.success(response.message)
                route.push('/auth')
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error('네트워크 연결이 원활하지 않습니다.')
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full  px-8 pt-9 pb-7 ">
            <div className="flex w-full flex-col gap-[18px]">


                <label className="text-[12px] font-semibold leading-[18px] tracking-[0.24px] text-[#64748B]">
                    비밀번호
                    <span className="relative mt-[7px] block w-full">
                        <input
                            {...register('newPassword')}
                            maxLength={100}
                            className="h-12 w-full rounded-[10px] border-[1.5px] bg-white border-[#DCE8E2] pr-11 pl-3.5 text-[14px] font-normal text-[#1D2B3A] outline-none placeholder:text-[#64748B]/50"
                            placeholder="비밀번호를 입력하세요"
                            type={`${toggleEye ? 'password' : 'text'}`}
                        />
                        <button
                            aria-label="비밀번호 보기"
                            className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center text-[#7A9A90]"
                            type="button"
                            onClick={() => setToggleEye(!toggleEye)}
                        >
                            {toggleEye ? (
                                <Eye className="size-4" strokeWidth={1.5} />
                            ) : (
                                <EyeClosed className="size-4" strokeWidth={1.5} />
                            )}
                        </button>
                    </span>
                </label>
                {errors.newPassword?.message && <p>{errors.newPassword.message}</p>}


                <label className="text-[12px] font-semibold leading-[18px] tracking-[0.24px] text-[#64748B]">
                    비밀번호 확인
                    <span className="relative mt-[7px] block w-full">
                        <input
                            {...register('confirmPassword')}
                            maxLength={100}
                            className="h-12 w-full rounded-[10px] border-[1.5px] bg-white border-[#DCE8E2] pr-11 pl-3.5 text-[14px] font-normal text-[#1D2B3A] outline-none placeholder:text-[#64748B]/50"
                            placeholder="비밀번호를 다시 입력하세요"
                            type={`${toggleEyeCheck ? 'password' : 'text'}`}
                        />
                        <button
                            aria-label="비밀번호 보기"
                            className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center text-[#7A9A90]"
                            type="button"
                            onClick={() => setToggleEyeCheck(!toggleEyeCheck)}
                        >
                            {toggleEyeCheck ? (
                                <Eye className="size-4" strokeWidth={1.5} />
                            ) : (
                                <EyeClosed className="size-4" strokeWidth={1.5} />
                            )}
                        </button>
                    </span>
                </label>
                {errors.confirmPassword?.message && <p>{errors.confirmPassword.message}</p>}

                <button
                    disabled={isSubmitting}
                    className={`mt-1 h-[50px] w-full rounded-[10px] text-[15px] font-semibold leading-[22.5px] tracking-[0.15px]  ${true ? 'bg-[#0F172A50]' : 'text-white bg-[#0F172A]'}`}
                    type="submit"
                >
                    비밀번호 저장
                </button>
            </div>

        </form>
    )
}
