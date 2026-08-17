import { Mail } from "lucide-react";
import { CONTACT_EMAIL, MAILTO } from "@/feature/landing/constants";

export default function LandingFooter() {
    return (
        <footer className="w-full border-t border-[#F1F5F9] bg-white py-10">
            <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[15px] font-bold text-[#0F172A]">이음</p>
                    <p className="mt-1 text-[12.5px] text-[#94A3B8]">
                        흩어진 학원 업무를 하나로 잇는 학원 전문 경량화 그룹웨어
                    </p>
                </div>
                <div className="flex flex-col gap-1 text-[12.5px] text-[#94A3B8] sm:text-right">
                    <a href={MAILTO} className="flex items-center gap-1.5 text-[#64748B] sm:justify-end">
                        <Mail className="size-3.5" strokeWidth={1.8} />
                        {CONTACT_EMAIL}
                    </a>
                    <p>© 2026 Team MUDO. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
