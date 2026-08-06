import ApprovalNavBar from "@/feature/approval/components/ApprovalNavBar";
import TemplateItem from "@/feature/approval/components/TemplateItem";


export default function Page() {
    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-2 py-4 sm:px-2.5 md:px-4 md:py-5 lg:px-8 lg:py-7">
            <ApprovalNavBar buttonType='템플릿 추가' />


            <section className="mt-3 w-full overflow-hidden border md:mt-4 rounded-[10px] border-[#D7E8DB] bg-white lg:mt-5">
                <div className="grid h-9 grid-cols-9 items-center border-b border-[#D7E8DB] px-1 text-[10px] font-medium leading-[16.5px] text-[#B0B8C1] sm:px-2 md:h-[37px] md:px-3 md:text-[11px] lg:grid-cols-11 lg:px-5">
                    <p className="col-span-4 lg:col-span-6">템플릿 이름</p>
                    <p className="col-span-1">생성자</p>
                    <p className="col-span-3">결재 라인</p>
                    <p className="col-span-1">생성일</p>
                </div>

                <TemplateItem />
                <TemplateItem />
            </section>

            <p className="mt-3 w-full rounded-none border border-transparent bg-transparent py-10 text-center text-[10px] font-normal leading-[19.5px] text-[#C0C8D0] md:mt-4 md:rounded-[10px] md:border-[#D7E8DB] md:bg-white md:py-14 md:text-[12px] lg:mt-5 lg:py-[61px] lg:text-[13px]">
                템플릿 문서가 없습니다
            </p>
        </main>
    );
}
