import MemberItem from "@/feature/members/components/MemberItem";
import MemberStateFilter from "@/feature/members/components/MemberStateFilter";
import { Search } from "lucide-react";

interface paramsProps {
    searchParams: Promise<{
        state: string;
    }>
}

export default async function MembersPage({ searchParams }: paramsProps) {
    const { state } = await searchParams;

    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-8 py-7 text-[#0F172A]">
            <section className="w-full">
                <div className="flex w-full items-center gap-2.5">
                    <label className="flex h-10 w-[260px] shrink-0 items-center gap-2 rounded-[8px] border border-[#D7E8DB] bg-white px-3">
                        <Search className="size-3.5 shrink-0 text-[#94A3B8]" strokeWidth={1.7} />
                        <input
                            aria-label="이름 또는 역할 검색"
                            className="w-full bg-transparent text-[13px] leading-normal outline-none placeholder:text-[#0F172A]/50"
                            placeholder="이름·역할 검색"
                        />
                    </label>

                    <MemberStateFilter state={state} />

                    <div className="ml-auto flex items-center gap-4 text-[13px] text-[#64748B]">
                        <span>재직 <strong className="font-bold text-[#0F172A]">8</strong>명</span>
                        <span>비활성 <strong className="font-bold text-[#0F172A]">1</strong>명</span>
                    </div>
                </div>

                <div className="mt-4 md:min-w-[680px] overflow-hidden rounded-[12px] border border-[#D7E8DB] bg-white">
                    <div className="grid h-10 grid-cols-5 sm:grid-cols-7 items-center bg-[#FAFBFC] px-5 text-[11px] font-semibold tracking-[0.44px] text-[#64748B]">
                        <span className="md:pl-11 col-span-3">이름</span>
                        <span className="col-span-1">역할</span>
                        <span className="col-span-1">연락처</span>
                        <span className="col-span-1 hidden sm:block">입사일</span>
                        <span className="col-span-1 hidden sm:block">상태</span>
                    </div>

                    {/* {members.map((member) => (
                        <MemberItem member={member} />
                    ))} */}
                    <MemberItem member={null} />
                    <MemberItem member={null} />
                </div>
            </section>
        </main>
    );
}
