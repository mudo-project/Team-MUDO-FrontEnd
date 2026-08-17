import { Monitor } from "lucide-react";

export default function DesktopOnlyGuard({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="hidden lg:block">{children}</div>
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-[#DCE9DF] bg-white px-6 py-12 text-center lg:hidden">
                <Monitor className="size-6 text-[#94A3B8]" strokeWidth={1.6} />
                <p className="text-[13px] font-semibold text-[#172033]">더 넓은 화면에서 이용해 주세요</p>
                <p className="text-[12px] text-[#64748B]">
                    이 화면은 다루는 정보가 많아 모바일에서는 지원하지 않습니다.
                    <br />
                    모니터나 태블릿 가로모드 등 더 넓은 화면(PC)으로 접속해 주세요.
                </p>
            </div>
        </>
    );
}
