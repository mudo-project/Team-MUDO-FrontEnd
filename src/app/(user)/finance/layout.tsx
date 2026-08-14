import { ShieldCheck } from "lucide-react";
import FinanceTabs from "./FinanceTabs";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 py-5 text-[#172033] lg:px-6">
            <div className="h-full overflow-y-auto scrollbar-hide">
                <div className="mx-auto w-full max-w-[1360px] pb-8">
                    <header className="flex items-center justify-between">
                        <FinanceTabs />
                        <p className="flex items-center gap-1 pt-1 text-[11px] text-[#94A3B8]">
                            <ShieldCheck className="size-3.5" /> 민감정보 화면입니다. 화면 공유에 주의하세요
                        </p>
                    </header>
                    {children}
                </div>
            </div>
        </main>
    );
}
