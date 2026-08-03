import Link from "next/link";

const menuGroups = [
    [
        { label: "홈", icon: "⌂", href: "/" },
        { label: "템플릿", icon: "≡", href: "#" },
    ],
    [
        { label: "메신저", icon: "□", href: "#", count: 3 },
        { label: "공지사항", icon: "♧", href: "#", count: 2 },
    ],
    [
        { label: "전자결재", icon: "▤", href: "#", count: 3 },
        { label: "워크스페이스", icon: "▦", href: "/workspace" },
        { label: "업무관리", icon: "☑", href: "/workspace/my-works" },
    ],
    [
        { label: "근태", icon: "◷", href: "#" },
        { label: "재무", icon: "$", href: "#" },
    ],
    [
        { label: "원생관리", icon: "◇", href: "#" },
        { label: "일정", icon: "□", href: "#" },
        { label: "시간표", icon: "▦", href: "#" },
        { label: "문자 발송", icon: "▯", href: "#" },
    ],
    [
        { label: "구성원", icon: "♧", href: "#" },
        { label: "역할 설정", icon: "♢", href: "#" },
        { label: "영수증·지출", icon: "▤", href: "#" },
        { label: "자료실", icon: "□", href: "#" },
        { label: "설정", icon: "⚙", href: "#" },
    ],
    [
        { label: "메모", icon: "□", href: "#" },
        { label: "메모1", icon: "□", href: "#" },
        { label: "메모2", icon: "□", href: "#" },
        { label: "메모3", icon: "□", href: "#" },
        { label: "메모4", icon: "□", href: "#" },
        { label: "메모5", icon: "□", href: "#" }
    ],
];

export default function Sidebar() {
    return (
        <aside className="
                fixed top-16 bottom-0 left-0
                flex w-70 flex-col
                border-r border-[#E3E7EC]
                bg-white text-[#4F5968]
            ">
            <nav className="
                min-h-0 flex-1 overflow-y-auto
                px-1.5
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
                ">
                {menuGroups.map((group, groupIndex) => (
                    <div
                        className={groupIndex === 0 ? "pb-1" : "border-t border-[#EEF0F3] py-1"}
                        key={group.map((item) => item.label).join("-")}
                    >
                        {group.map((item) => (
                            <Link
                                className={`flex h-[33px] w-full items-center rounded-[7px] px-2.5 text-[12px] text-[#596474]`}
                                href={item.href}
                                key={item.label}
                            >
                                <span className="flex w-5 shrink-0 items-center justify-center text-[16px] font-light text-[#8E99A9]">
                                    {item.icon}
                                </span>
                                <span className="ml-2">{item.label}</span>
                                {item.count && (
                                    <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-[#172035] px-1 text-[9px] font-semibold text-white">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="
                flex h-[60px] w-full shrink-0 items-center
                border-t border-[#E7EAEF]
                bg-white px-3 text-left
                ">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#172035] text-[9px] font-semibold text-white">
                    김지
                </span>
                <span className="ml-2">
                    <strong className="block text-[12px] font-semibold text-[#202A3C]">김지수</strong>
                    <span className="mt-0.5 block text-[9px] text-[#AAB2BF]">원장</span>
                </span>
                <span className="ml-auto text-[14px] text-[#AEB6C2]">⌄</span>
            </div>
        </aside>
    );
}
