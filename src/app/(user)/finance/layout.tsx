import { ShieldCheck } from "lucide-react";
import FinanceTabs from "./FinanceTabs";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-[calc(100dvh-3.25rem)] min-h-0 overflow-hidden bg-[#FCFCFC] px-6 text-[#172033]">
            <div className="h-full min-h-0 overflow-y-auto scrollbar-hide">
                <div className="w-full pb-6 pt-2">
                    <header className="flex items-center justify-between">
                    <FinanceTabs />
                        <p className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                            <ShieldCheck className="size-3.5" /> 민감정보 화면입니다. 화면 공유에 주의하세요
                        </p>
                    </header>
                    {children}
                </div>
            </div>
        </main>
    );
}
