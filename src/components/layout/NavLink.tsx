'use client'

import { useUserStore } from "@/store/useUserStore";
import {
    Bell,
    BellRing,
    Book,
    CalendarDays,
    Clock3,
    FileCheck2,
    Folder,
    GraduationCap,
    Grid2X2,
    HardDriveDownload,
    Home,
    Mail,
    MessageSquare,
    PanelTop,
    Settings,
    Shield,
    TrendingUp,
    UserRoundPen,
    Users,
    WalletCards,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuHref } from "./Sidebar";

interface NavLinkProps {
    href: MenuHref,
    children: string,
    icon: 'Home' | "PanelTop" | "MessageSquare" | "Bell" | "BellRing" | "FileCheck2" | "Grid2X2" | "Clock3" | "WalletCards" | "GraduationCap" | "CalendarDays" | "Users" | "Shield" | "Settings" | "Book" | "Folder" | "TrendingUp" | 'Mail' | 'UserRoundPen' | 'HardDriveDownload',
    count?: number;
    border?: boolean
}

const Icon = { Home: Home, PanelTop: PanelTop, MessageSquare: MessageSquare, Bell: Bell, BellRing: BellRing, FileCheck2: FileCheck2, Grid2X2: Grid2X2, Clock3: Clock3, WalletCards: WalletCards, GraduationCap: GraduationCap, CalendarDays: CalendarDays, Users: Users, Shield: Shield, Settings: Settings, Book: Book, Folder: Folder, TrendingUp: TrendingUp, Mail: Mail, UserRoundPen: UserRoundPen, HardDriveDownload: HardDriveDownload }

const checkPermission: Partial<Record<MenuHref, string>> = {
    '/role': 'ROLE:MANAGE',
    '/members': 'ACCOUNT:MANAGE',
    '/lecture': 'LECTURE:READ',
    '/rollbook': 'ROLLCALL:MANAGE',
    '/message': 'ROLLCALL:TEMPLATE_MANAGE',
    '/student': 'STUDENT:MANAGE',
    '/approval/my': 'APPROVAL:SUBMIT',
}

export default function NavLink({ href, children, icon, count, border }: NavLinkProps) {
    const SidebarIcon = Icon[icon]
    const pathName = usePathname().split('/')[1];
    const purehref = href.split('?')[0].split('/')[1]
    const permissions = useUserStore((state) => state.permissions);


    const isActive = pathName.startsWith(purehref);
    const requiredPermission = checkPermission[href];
    const hasPermission = requiredPermission
        ? permissions.includes(requiredPermission)
        : true;

    if (!hasPermission) return null;

    return (
        <>
            <div className={` px-2.5 py-1.5  rounded-[5px] ${isActive
                ? "bg-[#2C8D50] font-semibold text-white"
                : "text-[#CBD5E1] hover:bg-white/5"
                }`}>
                <Link className={`flex h-[25px] gap-2.5 w-full items-center text-[10px]`}
                    href={href}>
                    <SidebarIcon className="h-3.5 w-3.5" strokeWidth={1.7} />
                    <p className="ml-2 pt-[4px] text-[13px]">{children}</p>
                    {(count ?? 0) !== 0 && (
                        <span className="ml-auto flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-white px-1 text-[8px] font-semibold text-[#2C8D50]">
                            {count}
                        </span>
                    )}
                </Link>
            </div>
            {border && <div className={`my-1 w-full border-b border-[#94A3B8]`}></div>}
        </>
    );
}
