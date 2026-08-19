import LoginForm from "@/feature/auth/components/LoginForm";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

export default async function Page() {

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-[#FCFCFC] p-6">
            <div className="w-full max-w-[420px]">
                <header className="flex w-full flex-col items-center">
                    <div className="flex w-25 h-20 items-center justify-center relative">
                        <Image
                            src='/ieum.png'
                            alt="ieum 로고"
                            fill
                            sizes="w-20 h-10"
                            className="object-cover hover:cursor-pointer" />
                    </div>
                    <h1 className="pt-3.5 text-[22px] font-bold leading-[33px] tracking-[-0.3px] text-[#1D2B3A]">
                        이음 그룹웨어
                    </h1>
                    <p className="pt-1.5 text-[13px] leading-[19.5px] text-[#64748B]">
                        이음에 로그인하여 업무를 시작하세요
                    </p>
                </header>

                <section className="pt-9">
                    <LoginForm />
                </section>

                <footer className="pt-5 text-center text-[11px] leading-[16.5px] text-[#64748B]">
                    © 2026 Ieum 그룹웨어
                </footer>
            </div>
        </main>
    );
}
