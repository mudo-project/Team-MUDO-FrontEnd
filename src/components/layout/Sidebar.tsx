'use client'

import { useSidebarStore } from "@/store/useSidebarStore";
import NavLink from "./NavLink";
import { GraduationCap, LogOut, Settings } from "lucide-react";
import CloseSidebar from "./CloseSidebar";
import OpenMemo from "./OpenMemo";
import { useEffect, useRef, useState } from "react";
import { getApprovalPendingCountAction } from "@/feature/approval/actions";
import { logoutAction } from "@/feature/auth/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!profileMenuRef.current?.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
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

    const handleLogout = async () => {
        const response = await logoutAction();

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        router.replace("/auth");
        router.refresh();
    };


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

            <div ref={profileMenuRef} className="relative mt-auto shrink-0 border-t border-white/8">
                {isProfileMenuOpen && (
                    <div className="absolute right-2 bottom-[58px] w-[203px] overflow-hidden rounded-[12px] bg-white py-1 shadow-[0_8px_16px_rgba(22,34,54,0.18)]">
                        <div className="border-b border-[#D7E8DB] px-4 py-3">
                            <strong className="block text-[14px] font-semibold text-[#0F172A]">김지수</strong>
                            <span className="mt-1 block text-[12px] text-[#64748B]">원장</span>
                        </div>
                        <Link
                            className="flex h-11 items-center gap-3 px-4 text-[14px] text-[#0F172A] hover:bg-[#F2F8F4]"
                            href="/mypage"
                            onClick={() => setIsProfileMenuOpen(false)}
                        >
                            <Settings className="size-4" strokeWidth={1.8} />
                            마이페이지
                        </Link>
                        <button
                            className="flex h-11 w-full items-center gap-3 px-4 text-left text-[14px] text-[#0F172A] hover:bg-[#F2F8F4]"
                            onClick={handleLogout}
                            type="button"
                        >
                            <LogOut className="size-4" strokeWidth={1.8} />
                            로그아웃
                        </button>
                    </div>
                )}

                <button
                    aria-expanded={isProfileMenuOpen}
                    className="flex h-[52px] w-full items-center px-4 text-left"
                    onClick={() => setIsProfileMenuOpen((current) => !current)}
                    type="button"
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C8D50] text-[8px] font-semibold text-white">
                        김지
                    </span>
                    <span className="ml-2 leading-none">
                        <strong className="block text-[10px] font-medium text-white">김지수</strong>
                        <span className="mt-1 block text-[8px] text-[#94A3B8]">원장</span>
                    </span>
                    <span className="ml-auto text-[11px] text-[#CBD5E1]">⌃</span>
                </button>
            </div>
        </aside>
    );
}
