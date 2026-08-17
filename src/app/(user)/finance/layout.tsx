import FinanceSensitiveNotice from "./FinanceSensitiveNotice";
import FinanceTabs from "./FinanceTabs";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-[calc(100dvh-3.25rem)] min-h-0 overflow-hidden bg-[#FCFCFC] px-4 text-[#172033] sm:px-5 lg:px-6">
            <div className="h-full min-h-0 overflow-y-auto scrollbar-hide">
                <div className="w-full pb-6 pt-2">
                    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <FinanceTabs />
                        <FinanceSensitiveNotice />
                    </header>
                    {children}
                </div>
            </div>
        </main>
    );
}
