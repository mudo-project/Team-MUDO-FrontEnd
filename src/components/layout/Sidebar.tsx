import Link from "next/link";
import {
    Bell,
    CalendarDays,
    Clock3,
    FileCheck2,
    GraduationCap,
    Grid2X2,
    Home,
    MessageSquare,
    NotebookPen,
    PanelTop,
    Settings,
    Shield,
    Users,
    WalletCards,
    type LucideIcon,
} from "lucide-react";

type MenuItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    count?: number;
    active?: boolean;
    dividerAfter?: boolean;
};

const menuItems: MenuItem[] = [
    { label: "홈", href: "/", icon: Home },
    { label: "템플릿", href: "/template", icon: PanelTop },
    { label: "메신저", href: "/messenger", icon: MessageSquare, count: 3 },
    { label: "공지사항", href: "/notice", icon: Bell, count: 2 },
    { label: "전자결재", href: "#", icon: FileCheck2, count: 3 },
    { label: "워크스페이스", href: "/workspace", icon: Grid2X2 },
    { label: "근태", href: "/attendance", icon: Clock3 },
    { label: "재무", href: "/finance", icon: WalletCards },
    { label: "원생관리", href: "#", icon: GraduationCap },
    { label: "일정", href: "/schedule", icon: CalendarDays },
    { label: "시간표", href: "/timetable", icon: Grid2X2 },
    { label: "구성원", href: "#", icon: Users },
    { label: "역할 설정", href: "#", icon: Shield, active: true },
    { label: "설정", href: "/setting", icon: Settings },
    { label: "메모", href: "/memo", icon: NotebookPen },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex h-screen w-[219px] shrink-0 flex-col bg-[#0F172A] text-[#CBD5E1]">
            <div className="flex h-13 shrink-0 items-center border-b border-white/8 px-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#2C8D50]">
                    <GraduationCap className="h-4 w-4 text-white" strokeWidth={1.8} />
                </div>
                <strong className="ml-2 block text-[14px] font-semibold text-white">아카데미</strong>
            </div>

            <nav className="w-full overflow-y-auto px-2 py-2  scrollbar-hide">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            className={`px-2.5 py-1.5  rounded-[5px] ${item.active
                                ? "bg-[#2C8D50] font-semibold text-white"
                                : "text-[#CBD5E1] hover:bg-white/5"
                                }`}
                            key={item.label}
                        >
                            <Link
                                className={`flex h-[25px] gap-2.5 w-full items-center text-[10px]`}
                                href={item.href}
                            >
                                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                                <span className="ml-2 text-[13px]">{item.label}</span>
                                {item.count && (
                                    <span className="ml-auto flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#2C8D50] px-1 text-[8px] font-semibold text-white">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        </div>
                    );
                })}
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
