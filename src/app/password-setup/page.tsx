import PasswordForm from "@/feature/password-setup/components/PasswordForm";
import { GraduationCap } from "lucide-react";



export default async function Page() {


    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-[#FCFCFC] p-6 ">
            <div className="w-full max-w-[420px] overflow-auto h-[calc(100dvh-52px)] sidebar-hide">
                <header className="flex w-full flex-col items-center">
                    <div className="flex size-14 items-center justify-center rounded-[16px] bg-[#3D7A6A] shadow-[0_4px_8px_rgba(61,122,106,0.28)]">
                        <GraduationCap className="size-7 text-white" strokeWidth={1.8} />
                    </div>
                    <h1 className="pt-3.5 text-[22px] font-bold leading-[33px] tracking-[-0.3px] text-[#1D2B3A]">
                        이음 그룹웨어
                    </h1>
                    <p className="pt-1.5 text-[13px] leading-[19.5px] text-[#64748B]">
                        서비스를 사용하기 위한 정보를 입력해주세요
                    </p>
                </header>

                <section className="pt-9">
                    <PasswordForm />
                </section>

                <footer className="pt-5 text-center text-[11px] leading-[16.5px] text-[#64748B]">
                    © 2026 Ieum 그룹웨어
                </footer>
            </div>
        </main>
    );
}
