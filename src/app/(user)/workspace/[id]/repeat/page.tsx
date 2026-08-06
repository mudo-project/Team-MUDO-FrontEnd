import WorkTemplateItem from "@/feature/workspace/components/WorkTemplateItem";

export default function Page() {

    return (
        <main className="min-h-[calc(100vh-112px)] w-full bg-[#FCFDFE] p-2 text-[#202A3C] sm:p-2.5 md:p-4 lg:p-6">
            <div className="text-[10px] leading-[19.2px] text-[#AEB6C3] md:text-[11px] lg:text-[12px]">
                <p>
                    반복 주기와 업무 제목을 미리 등록해두면 주기 도래 시 자동으로 상태
                    <strong className="ml-1 font-bold text-[#4F5868]">대기</strong>
                    로 업무가 생성됩니다.
                </p>
                <p className="text-[#C2C8D1]">아래 &apos;지금 생성&apos; 버튼으로 즉시 테스트할 수 있습니다.</p>
            </div>
            <section className="mt-3 space-y-2 sm:mt-4 md:space-y-2.5 lg:mt-5">
                <WorkTemplateItem />
            </section>
        </main>
    );
}
