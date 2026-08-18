'use client'

import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ApprovalNav({ href, children }: { href: string, children: string }) {
    const permissions = useUserStore((state) => state.permissions);

    const pathName = usePathname();
    const purehref = href.split('?')[0]
    const isActive = pathName.startsWith(purehref);

    const all = permissions.includes('APPROVAL:READ_ALL')
    const template = permissions.includes('APPROVAL:TEMPLATE_MANAGE')

    const activeClass = `shrink-0 whitespace-nowrap h-9 px-1 pb-2 pt-2 text-[10px] leading-[19.5px] border-b-2 border-[#0F172A] font-semibold text-[#0F172A] sm:px-1.5 md:h-[39px] md:px-3 md:pb-[10px] md:pt-[9px] md:text-[12px] lg:px-[18px] lg:text-[13px]`
    const noneActiveClass = `shrink-0 whitespace-nowrap h-9 px-1 pb-2 pt-2 text-[10px] leading-[19.5px] font-normal text-[#64748B] sm:px-1.5 md:h-[39px] md:px-3 md:pb-[10px] md:pt-[9px] md:text-[12px] lg:px-[18px] lg:text-[13px]`
    const permissionClass = `${(!all && children === '전체') || (!template && children === '템플릿 관리') ? 'hidden' : 'block'}`

    return (
        <Link href={href} className={`${isActive ? activeClass : noneActiveClass} ${permissionClass}`}>
            {children}
        </Link>
    )
}
