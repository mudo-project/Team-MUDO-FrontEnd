'use client'

import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FinanceTabs() {
    const permissions = useUserStore((state) => state.permissions)
    const pathname = usePathname();
    const isCorporateCardActive = pathname.startsWith("/finance/corporate-card");
    const isPayrollActive = pathname.startsWith("/finance/payroll");

    if (pathname.startsWith("/finance/payroll/settings")) {
        return null;
    }

    return (
        <nav
            aria-label="재무 메뉴"
            className="mt-7 flex gap-2 border-b border-[#E1EBE3] text-[15px] font-semibold"
        >
            {permissions.includes('CORPORATE_CARD:EXPENSE') && (
                <Link
                    className={
                        isCorporateCardActive
                            ? "border-b-2 border-[#4D9560] px-5 pb-3 text-[#172033]"
                            : "px-5 pb-3 text-[#94A3B8]"
                    }
                    href="/finance/corporate-card"
                >
                    법인카드
                </Link>
            )}
            {permissions.includes('PAYROLL:MANAGE') && (
                <Link
                    className={
                        isPayrollActive
                            ? "border-b-2 border-[#4D9560] px-5 pb-3 text-[#172033]"
                            : "px-5 pb-3 text-[#94A3B8]"
                    }
                    href="/finance/payroll"
                >
                    급여명세서
                </Link>
            )}

        </nav>
    );
}
