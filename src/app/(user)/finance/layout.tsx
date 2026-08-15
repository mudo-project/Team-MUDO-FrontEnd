import FinanceSensitiveNotice from "./FinanceSensitiveNotice";
import FinanceTabs from "./FinanceTabs";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-[calc(100dvh-3.25rem)] min-h-0 overflow-hidden bg-[#FCFCFC] px-6 text-[#172033]">
            <div className="h-full min-h-0 overflow-y-auto scrollbar-hide">
                <div className="w-full pb-6 pt-2">
                    <header className="flex items-center justify-between">
                    <FinanceTabs />
                        <FinanceSensitiveNotice />
                    </header>
                    {children}
                </div>
            </div>
        </main>
    );
}
