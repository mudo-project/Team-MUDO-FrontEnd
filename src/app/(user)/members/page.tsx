import PaginationPrev from "@/components/ui/PaginationPrev";
import { getMemberListAction } from "@/feature/members/actions";
import MemberCreateButton from "@/feature/members/components/MemberCreateButton";
import MemberItem from "@/feature/members/components/MemberItem";
import MemberSearchInput from "@/feature/members/components/MemberSearchInput";

interface MembersPageProps {
    searchParams: Promise<{
        roleId?: string;
        keyword?: string;
        page: string;
    }>;
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
    const { roleId, keyword, page } = await searchParams;
    const parsedRoleId = Number(roleId);
    const parsedPage = Number(page);
    const memberResponse = await getMemberListAction({
        keyword,
        roleId: Number.isInteger(parsedRoleId) && parsedRoleId > 0
            ? parsedRoleId
            : undefined,
        page: Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0,
    });
    const members = memberResponse.data?.content ?? [];

    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-7 text-[#0F172A]">
            <section className="w-full">
                <div className="flex w-full items-center gap-1.5 sm:gap-2 md:gap-2.5">
                    <MemberSearchInput keyword={keyword ?? ""} />

                    <div className="ml-auto flex items-center gap-4 text-[13px] text-[#64748B]">
                        <span>총 <strong className="font-bold text-[#0F172A]">{members.length}</strong>명</span>
                    </div>
                    <MemberCreateButton />
                </div>

                <div className="mt-4 overflow-auto h-[calc(100vh-200px)] rounded-[12px] border border-[#D7E8DB] bg-white md:min-w-[680px]">
                    <div className="sticky top-0 left-0 grid h-10 grid-cols-5 items-center bg-[#FAFBFC] px-3 sm:px-4 md:px-5 text-[11px] font-semibold tracking-[0.44px] text-[#64748B] sm:grid-cols-7">
                        <span className="col-span-3 md:pl-11">이름</span>
                        <span className="col-span-1">역할</span>
                        <span className="col-span-1">연락처</span>
                        <span className="col-span-1 hidden sm:block">입사일</span>
                        <span className="col-span-1 hidden sm:block">상태</span>
                    </div>

                    {memberResponse.success ? members.map((member) => (
                        <MemberItem key={member.userId} member={member} />
                    )) : (
                        <p className="px-5 py-8 text-center text-[13px] text-[#64748B]">
                            {memberResponse.message}
                        </p>
                    )}
                    {memberResponse.success && members.length === 0 && (
                        <p className="px-5 py-8 text-center text-[13px] text-[#64748B]">
                            조회된 구성원이 없습니다.
                        </p>
                    )}
                </div>
            </section>
            <PaginationPrev
                url="members"
                page={Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0}
                hasNext={memberResponse.data?.hasNext}
                searchParams={{ keyword, roleId }}
            />

        </main>
    );
}
