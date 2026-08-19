'use client'

import { usePathname } from "next/navigation";

const DOMAIN_LABELS: { prefix: string; label: string }[] = [
    { prefix: "/alarm", label: "알림" },
    { prefix: "/notice", label: "공지사항" },
    { prefix: "/messenger", label: "메신저" },
    { prefix: "/approval", label: "전자결재" },
    { prefix: "/workspace", label: "워크스페이스" },
    { prefix: "/shared-folder", label: "공용폴더" },
    { prefix: "/schedule", label: "일정" },
    { prefix: "/finance", label: "재무" },
    { prefix: "/attendance", label: "근태" },
    { prefix: "/student", label: "원생 관리" },
    { prefix: "/lecture", label: "강의 관리" },
    { prefix: "/rollbook", label: "출결 관리" },
    { prefix: "/message", label: "SMS 관리" },
    { prefix: "/timetable", label: "시간표" },
    { prefix: "/revenue-report", label: "매출 리포트" },
    { prefix: "/members", label: "구성원" },
    { prefix: "/role", label: "역할 설정" },
    { prefix: "/initial", label: "데이터 세팅" },
    { prefix: "/setting", label: "설정" },
];

export default function HeaderTitle() {
    const pathname = usePathname();
    const domain = DOMAIN_LABELS.find(({ prefix }) => pathname.startsWith(prefix));

    if (!domain) {
        return null;
    }

    return (
        <span className="ml-3 text-[14px] font-semibold text-[#0F172A]">{domain.label}</span>
    );
}
