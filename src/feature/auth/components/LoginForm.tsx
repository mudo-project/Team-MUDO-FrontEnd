'use client'

import { Eye, EyeClosed } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const route = useRouter();
    const [toggleEye, setToggleEye] = useState<boolean>(true);
    const [state, loginFormAction, ispending] = useActionState(loginAction, {
        success: false,
        message: '',
    })

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            route.push('/role');
        } else {
            toast.error(state.message)
        }
    }, [state])

    return (
        <form
            action={loginFormAction}
            className="w-full rounded-[16px] border-[1.5px] border-[#DCE8E2] bg-white px-8 pt-9 pb-7 shadow-[0_2px_10px_rgba(22,34,54,0.07),0_1px_2px_rgba(22,34,54,0.04)]">
            <div className="flex w-full flex-col gap-[18px]">
                <label className="text-[12px] font-semibold leading-[18px] tracking-[0.24px] text-[#64748B]">
                    아이디
                    <input
                        maxLength={50}
                        className="mt-[7px] h-12 w-full rounded-[10px] border-[1.5px] border-[#DCE8E2] px-3.5 text-[14px] font-normal text-[#1D2B3A] outline-none placeholder:text-[#64748B]/50"
                        name="username"
                        placeholder="아이디를 입력하세요"
                        type="text"
                    />
                </label>

                <label className="text-[12px] font-semibold leading-[18px] tracking-[0.24px] text-[#64748B]">
                    비밀번호
                    <span className="relative mt-[7px] block w-full">
                        <input
                            maxLength={100}
                            className="h-12 w-full rounded-[10px] border-[1.5px] border-[#DCE8E2] pr-11 pl-3.5 text-[14px] font-normal text-[#1D2B3A] outline-none placeholder:text-[#64748B]/50"
                            name="password"
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

                <button
                    disabled={ispending}
                    className={`mt-1 h-[50px] w-full rounded-[10px] text-[15px] font-semibold leading-[22.5px] tracking-[0.15px]  ${ispending ? 'bg-[#0F172A50]' : 'text-white bg-[#0F172A]'}`}
                    type="submit"
                >
                    로그인
                </button>
            </div>

            <p className="mt-6 w-full border-t-[1.5px] border-[#ECF3EF] pt-5 text-center text-[11px] leading-[17.6px] text-[#B0BEC8]">
                테스트 계정 · 아이디 <strong className="font-bold text-[#7A9A90]">10001</strong>
                {" · 비밀번호 "}
                <strong className="font-bold text-[#7A9A90]">1234</strong>
            </p>
        </form>
    )
}
