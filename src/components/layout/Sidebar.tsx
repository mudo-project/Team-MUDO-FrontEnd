'use client'

import { useSidebarStore } from "@/store/useSidebarStore";
import NavLink from "./NavLink";
import { ChevronsLeft, GraduationCap } from "lucide-react";
import CloseSidebar from "./CloseSidebar";
import OpenMemo from "./OpenMemo";
import { useEffect, useState } from "react";
import { getApprovalPendingCountAction } from "@/feature/approval/actions";

type MenuItem = {
    label: string;
    href: string;
    icon: 'Home' | "PanelTop" | "MessageSquare" | "Bell" | "FileCheck2" | "Grid2X2" | "Clock3" | "WalletCards" | "GraduationCap" | "CalendarDays" | "Users" | "Shield" | "Settings",
    count?: number;
    active?: boolean;
    dividerAfter?: boolean;
};

export default function Sidebar() {
    const isOpen = useSidebarStore((state) => state.isOpen)
    const [approvalPendingCount, setApprovalPendingCount] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const loadApprovalPendingCount = async () => {
            const response = await getApprovalPendingCountAction();

            if (!cancelled && response.success) {
                setApprovalPendingCount(response.data?.count ?? 0);
            }
        };

        loadApprovalPendingCount();

        return () => {
            cancelled = true;
        };
    }, []);

    const menuItems: MenuItem[] = [
        { label: "홈", href: "/", icon: 'Home' },
        { label: "템플릿", href: "/template", icon: 'PanelTop' },
        { label: "메신저", href: "/messenger", icon: 'MessageSquare', count: 3 },
        { label: "공지사항", href: "/notice", icon: 'Bell', count: 2 },
        { label: "전자결재", href: "/approval/my", icon: 'FileCheck2', count: approvalPendingCount },
        { label: "워크스페이스", href: "/workspace/my-works", icon: 'Grid2X2' },
        { label: "근태", href: "/attendance", icon: 'Clock3' },
        { label: "재무", href: "/finance", icon: 'WalletCards' },
        // { label: "원생관리", href: "#", icon: 'GraduationCap' },
        { label: "일정", href: "/schedule", icon: 'CalendarDays' },
        { label: "시간표", href: "/timetable", icon: 'Grid2X2' },
        { label: "구성원", href: "/members", icon: 'Users' },
        { label: "역할 설정", href: "/role", icon: 'Shield', active: true },
        { label: "설정", href: "/setting", icon: 'Settings' },
    ];


    return (
        <aside className={`${isOpen ? 'flex' : 'hidden'} h-screen w-[219px] shrink-0 flex-col bg-[#0F172A] text-[#CBD5E1]`}>
            <div className="flex h-13 shrink-0 items-center border-b border-white/8 px-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#2C8D50]">
                    <GraduationCap className="h-4 w-4 text-white" strokeWidth={1.8} />
                </div>
                <strong className="ml-2 block text-[14px] font-semibold text-white">아카데미</strong>
                <CloseSidebar />
            </div>

            <nav className="w-full overflow-y-auto px-2 py-2  scrollbar-hide">
                {menuItems.map((item) => (
                    <NavLink key={item.label} href={item.href} icon={item.icon} count={item.count} >
                        {item.label}
                    </NavLink>))}
                <OpenMemo />
            </nav>

            <button className="mt-auto flex h-[52px] w-full shrink-0 items-center border-t border-white/8 px-4 text-left">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C8D50] text-[8px] font-semibold text-white">
                    김지
                </span>
                <span className="ml-2 leading-none">
                    <strong className="block text-[10px] font-medium text-white">김지수</strong>
                    <span className="mt-1 block text-[8px] text-[#94A3B8]">원장</span>
                </span>
                <span className="ml-auto text-[11px] text-[#64748B]">⌄</span>
            </button>
        </aside>
    );
}
