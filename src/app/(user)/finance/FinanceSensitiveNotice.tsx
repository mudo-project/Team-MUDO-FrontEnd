'use client'

import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FinanceSensitiveNotice() {
    const pathname = usePathname();

    if (pathname.startsWith("/finance/payroll/settings")) {
        return null;
    }

    return (
        <p className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
            <ShieldCheck className="size-3.5" /> 민감정보 화면입니다. 화면 공유에 주의하세요
        </p>
    );
}
