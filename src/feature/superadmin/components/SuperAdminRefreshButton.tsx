"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminRefreshButton() {
    const router = useRouter();

    return (
        <button className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#D7E8DB] bg-white px-3.5 text-[13px] text-[#0F172A]" onClick={() => router.refresh()} type="button">
            <RefreshCw className="size-3.5" strokeWidth={1.5} />
            새로고침
        </button>
    );
}
