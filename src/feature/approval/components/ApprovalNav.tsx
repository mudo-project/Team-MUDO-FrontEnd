'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ApprovalNav({ href, children }: { href: string, children: string }) {
    const pathName = usePathname();
    const purehref = href.split('?')[0]
    const isActive = pathName.startsWith(purehref);

    const activeClass = `h-9 px-1 pb-2 pt-2 text-[10px] leading-[19.5px] border-b-2 border-[#0F172A] font-semibold text-[#0F172A] sm:px-1.5 md:h-[39px] md:px-3 md:pb-[10px] md:pt-[9px] md:text-[12px] lg:px-[18px] lg:text-[13px]`
    const noneActiveClass = `h-9 px-1 pb-2 pt-2 text-[10px] leading-[19.5px] font-normal text-[#64748B] sm:px-1.5 md:h-[39px] md:px-3 md:pb-[10px] md:pt-[9px] md:text-[12px] lg:px-[18px] lg:text-[13px]`

    return (
        <Link href={href} className={`${isActive ? activeClass : noneActiveClass}`}>
            {children}
        </Link>
    )
}
