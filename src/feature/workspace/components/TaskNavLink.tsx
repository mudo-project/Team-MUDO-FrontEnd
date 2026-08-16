'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TaskNavLink({ href, children }: { href: string, children: string }) {

    const pathName = usePathname();
    const purehref = href.split('?')[0]
    const isActive = pathName.startsWith(purehref);

    const activeClass = `h-full border-b border-[#596273] px-2 text-[10px] font-semibold leading-[35px] md:px-3 md:text-[12px] lg:px-4 lg:text-[13px]`
    const noneActiveClass = `h-full border-b text-[10px] px-2  leading-[35px] text-[#A9B0BC] md:px-3 md:text-[12px] lg:px-4 lg:text-[13px]`

    return (
        <Link href={href} className={`${isActive ? activeClass : noneActiveClass}`}>
            {children}
        </Link>
    )
}
