'use client'

import {
    Bell,
    CalendarDays,
    Clock3,
    FileCheck2,
    GraduationCap,
    Grid2X2,
    Home,
    MessageSquare,
    PanelTop,
    Settings,
    Shield,
    Users,
    WalletCards,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
    href: string,
    children: string,
    icon: 'Home' | "PanelTop" | "MessageSquare" | "Bell" | "FileCheck2" | "Grid2X2" | "Clock3" | "WalletCards" | "GraduationCap" | "CalendarDays" | "Users" | "Shield" | "Settings",
    count?: number
}

const Icon = { Home: Home, PanelTop: PanelTop, MessageSquare: MessageSquare, Bell: Bell, FileCheck2: FileCheck2, Grid2X2: Grid2X2, Clock3: Clock3, WalletCards: WalletCards, GraduationCap: GraduationCap, CalendarDays: CalendarDays, Users: Users, Shield: Shield, Settings: Settings }

export default function NavLink({ href, children, icon, count }: NavLinkProps) {
    const SidebarIcon = Icon[icon]
    const pathName = usePathname().split('/')[1];
    const purehref = href.split('?')[0].split('/')[1]

    let isActive
    if (href === '/') {
        isActive = pathName === purehref;
    } else {
        isActive = pathName.startsWith(purehref);

    }

    return (
        <div className={`px-2.5 py-1.5  rounded-[5px] ${isActive
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
    );
}