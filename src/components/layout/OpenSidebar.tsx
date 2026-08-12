'use client'

import { useSidebarStore } from "@/store/useSidebarStore"
import { Menu } from "lucide-react"

export default function OpenSidebar() {
    const isOpen = useSidebarStore((state) => state.isOpen);
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

    if (isOpen) {
        return;
    }
    return (
        <button
            className="flex h-8 w-8 items-center justify-center text-[#64748B]"
            type="button"
            aria-label="사이드바 메뉴 열기"
            onClick={toggleSidebar}
        >
            <Menu className="h-4 w-4" strokeWidth={1.8} />
        </button>
    )
}