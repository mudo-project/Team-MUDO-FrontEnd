import Link from "next/link";
import { MAILTO, NAV_LINKS } from "@/feature/landing/constants";

export default function LandingHeader() {
    return (
        <div className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center px-6">
                <Link href="/" className="text-[19px] font-bold tracking-tight text-[#0F172A]">
                    이음
                </Link>

                <div className="ml-10 hidden items-center gap-7 text-[13px] font-medium text-[#64748B] md:flex">
                    {NAV_LINKS.map((link) => (
                        <a key={link.href} href={link.href} className="hover:text-[#0F172A]">
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <a
                        href={MAILTO}
                        className="flex h-9 items-center gap-1.5 rounded-[8px] bg-[#0F172A] px-4 text-[13px] font-semibold text-white"
                    >
                        도입 문의
                    </a>
                </div>
            </div>
        </div>
    );
}
