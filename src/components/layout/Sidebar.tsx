'use client'

import { useSidebarStore } from "@/store/useSidebarStore";
import NavLink from "./NavLink";
import { GraduationCap } from "lucide-react";
import CloseSidebar from "./CloseSidebar";
import OpenMemo from "./OpenMemo";
import { useEffect, useRef, useState } from "react";
import { getApprovalPendingCountAction } from "@/feature/approval/actions";;
import { useUserStore } from "@/store/useUserStore";
import MyMenu from "./MyMenu";
import { decodeJWT } from "@/lib/decode";
import { getMyPermissionListAction } from "@/feature/auth/actions";
import { getUnreadNotificationCountAction } from "@/feature/alarm/actions";
import { useAlarmStore } from "@/store/useAlarmStore";
import { useMessengerUnreadStore } from "@/store/useMessengerUnreadStore";
import Image from "next/image";

type MenuItem = {
    label: string;
    href: string;
    icon: 'Home' | "PanelTop" | "MessageSquare" | "Bell" | "BellRing" | "FileCheck2" | "Grid2X2" | "Clock3" | "WalletCards" | "GraduationCap" | "CalendarDays" | "Users" | "Shield" | "Settings" | "Book" | "Folder" | "TrendingUp" | "Mail" | 'UserRoundPen' | 'HardDriveDownload',
    count?: number;
    dividerAfter?: boolean;
};

export default function Sidebar() {
    const isOpen = useSidebarStore((state) => state.isOpen)
    const [approvalPendingCount, setApprovalPendingCount] = useState(0);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const permissions = useUserStore((state) => state.permissions);
    const setPermissions = useUserStore((state) => state.setPermissions);
    const unreadNotificationCount = useAlarmStore((state) => state.unreadCount);
    const setUnreadNotificationCount = useAlarmStore((state) => state.setUnreadCount);
    const unreadMessengerCount = useMessengerUnreadStore((state) => state.unreadCount);

    useEffect(() => {
        let cancelled = false;
        const decode = async () => {
            const user = await decodeJWT();
            if (user) {
                setUser(user);
            }
        }

        const loadPermission = async () => {
            const response = await getMyPermissionListAction();

            if (response.data?.permissions) {
                setPermissions(response.data.permissions);
            }
        }

        const loadApprovalPendingCount = async () => {
            const response = await getApprovalPendingCountAction();

            if (!cancelled && response.success) {
                setApprovalPendingCount(response.data?.count ?? 0);
            }
        };

        const loadUnreadNotificationCount = async () => {
            try {
                const count = await getUnreadNotificationCountAction();

                if (!cancelled) {
                    setUnreadNotificationCount(count);
                }
            } catch {
                // 조회 실패 시 뱃지는 0으로 유지한다.
            }
        };

        decode();
        loadPermission();
        loadApprovalPendingCount();
        loadUnreadNotificationCount();

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
        { label: "알림", href: "/alarm", icon: 'BellRing', count: unreadNotificationCount },
        { label: "공지사항", href: "/notice", icon: 'Bell' },
        { label: "메신저", href: "/messenger", icon: 'MessageSquare', count: unreadMessengerCount },
        { label: "전자결재", href: "/approval/my", icon: 'FileCheck2', count: approvalPendingCount },
        { label: "워크스페이스", href: "/workspace/my-works", icon: 'Grid2X2' },
        { label: "공용폴더", href: "/shared-folder", icon: 'Folder' },
        { label: "일정", href: "/schedule", icon: 'CalendarDays', dividerAfter: true },
        { label: "근태", href: "/attendance", icon: 'Clock3' },
        { label: "재무", href: "/finance", icon: 'WalletCards', dividerAfter: true },
        { label: "원생 관리", href: "/student", icon: 'GraduationCap' },
        { label: "강의 관리", href: "/lecture", icon: 'Book' },
        { label: "출결 관리", href: "/rollbook", icon: 'UserRoundPen' },
        { label: "SMS 관리", href: "/message", icon: 'Mail' },
        { label: "시간표", href: "/timetable", icon: 'Grid2X2', dividerAfter: true },
        { label: "매출 리포트", href: "/revenue-report", icon: 'TrendingUp' },
        { label: "구성원", href: "/members", icon: 'Users' },
        { label: "역할 설정", href: "/role", icon: 'Shield' },
        { label: "데이터 세팅", href: "/initial", icon: 'HardDriveDownload' },
        { label: "설정", href: "/setting", icon: 'Settings' },
    ];



    return (
        <aside className={`${isOpen ? 'flex' : 'hidden'} h-screen w-[219px] shrink-0 flex-col bg-[#0F172A] text-[#CBD5E1]`}>
            <div className="flex h-13 shrink-0 items-center border-b border-white/8 px-4">
                <div className="relative flex h-6 w-10 items-center justify-center rounded-[6px]">
                    <Image
                        src='/ieum.png'
                        alt="ieum 로고"
                        fill
                        sizes="w-10 h-10"
                        className="object-cover hover:cursor-pointer" />
                </div>
                <strong className="ml-2 block text-[14px] font-semibold text-white">이음 그룹웨어</strong>
                <CloseSidebar />
            </div>

            <nav className="w-full overflow-y-auto px-2 py-2  scrollbar-hide">
                {menuItems.map((item) => (
                    <NavLink key={item.label} href={item.href} icon={item.icon} count={item.count} border={item.dividerAfter} >
                        {item.label}
                    </NavLink>))}
                <OpenMemo />
            </nav>

            <div ref={profileMenuRef} className="relative mt-auto shrink-0 border-t border-white/8">
                {isProfileMenuOpen && (
                    <MyMenu setIsProfileMenuOpen={setIsProfileMenuOpen} />
                )}

                <button
                    aria-expanded={isProfileMenuOpen}
                    className="flex h-[52px] w-full items-center px-4 text-left"
                    onClick={() => setIsProfileMenuOpen((current) => !current)}
                    type="button"
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C8D50] text-[8px] font-semibold text-white">
                        {user.username.slice(0, 2)}
                    </span>
                    <span className="ml-2 leading-none">
                        <strong className="block text-[10px] font-medium text-white">{user.username}</strong>
                    </span>
                    <span className="ml-auto text-[11px] text-[#CBD5E1]">⌃</span>
                </button>
            </div>
        </aside>
    );
}
