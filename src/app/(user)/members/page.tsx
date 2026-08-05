import ViewMembersModal from "@/feature/members/components/modal/ViewMembersModal";
import { Search } from "lucide-react";

const members = [
    { initials: "KJ", name: "김지수", email: "jskim@academy.kr", role: "원장", phone: "010-1234-5678", joinedAt: "2020.03.02", status: "출근", avatar: "bg-[#0F172A] text-white" },
    { initials: "LM", name: "이민준", email: "mlee@academy.kr", role: "강사", phone: "010-2345-6789", joinedAt: "2022.09.01", status: "출근", avatar: "bg-[#E6F1EA] text-[#3E7D62]" },
    { initials: "PS", name: "박서연", email: "sypark@academy.kr", role: "강사", phone: "010-3456-7890", joinedAt: "2021.03.10", status: "연차", avatar: "bg-[#E6F1EA] text-[#3E7D62]" },
    { initials: "CH", name: "최현우", email: "hwchoi@academy.kr", role: "강사", phone: "010-4567-8901", joinedAt: "2023.03.02", status: "출근", avatar: "bg-[#E6F1EA] text-[#3E7D62]" },
    { initials: "JD", name: "정다은", email: "dejung@academy.kr", role: "행정", phone: "010-5678-9012", joinedAt: "2021.07.01", status: "출근", avatar: "bg-[#E6F1EA] text-[#3E7D62]" },
    { initials: "KD", name: "강도현", email: "dhkang@academy.kr", role: "강사", phone: "010-6789-0123", joinedAt: "2022.03.01", status: "미출근", avatar: "bg-[#E6F1EA] text-[#3E7D62]" },
    { initials: "YY", name: "윤예진", email: "yjyoong@academy.kr", role: "조교", phone: "010-7890-1234", joinedAt: "2023.09.01", status: "출근", avatar: "bg-[#E6F1EA] text-[#3E7D62]" },
    { initials: "LS", name: "임성훈", email: "shim@academy.kr", role: "조교", phone: "010-8901-2345", joinedAt: "2023.09.01", status: "출근", avatar: "bg-[#E6F1EA] text-[#3E7D62]" },
    { initials: "OJ", name: "오지원", email: "jioh@academy.kr", role: "강사", phone: "010-9012-3450", joinedAt: "2020.08.01", status: "비활성", avatar: "bg-[#F1F5F3] text-[#9AA9A0]" },
];

const statusStyle = {
    출근: "bg-[#EAF5EE] text-[#246B40]",
    연차: "bg-[#ECFDF3] text-[#22A559] ring-1 ring-inset ring-[#B7E9C8]",
    미출근: "bg-[#F1F3F5] text-[#9AA2AE]",
    비활성: "bg-[#F1F3F5] text-[#9AA2AE]",
};

export default function MembersPage() {
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

                    <div className="flex h-10 shrink-0 items-center gap-1 rounded-[8px] bg-[#EDF0F4] p-[3px] text-[13px]">
                        <button className="h-[34px] rounded-[6px] bg-white px-3.5 font-semibold shadow-[0_1px_1.5px_rgba(22,34,54,0.08)]" type="button">전체</button>
                        <button className="h-[34px] rounded-[6px] px-3.5 text-[#64748B]" type="button">재직</button>
                        <button className="h-[34px] rounded-[6px] px-3.5 text-[#64748B]" type="button">비활성</button>
                    </div>

                    <div className="ml-auto flex items-center gap-4 text-[13px] text-[#64748B]">
                        <span>재직 <strong className="font-bold text-[#0F172A]">8</strong>명</span>
                        <span>비활성 <strong className="font-bold text-[#0F172A]">1</strong>명</span>
                    </div>
                </div>

                <div className="mt-4 min-w-[680px] overflow-hidden rounded-[12px] border border-[#D7E8DB] bg-white">
                    <div className="grid h-10 grid-cols-[minmax(240px,1fr)_120px_160px_110px_90px] items-center bg-[#FAFBFC] px-5 text-[11px] font-semibold tracking-[0.44px] text-[#64748B]">
                        <span className="pl-11">이름</span>
                        <span>역할</span>
                        <span>연락처</span>
                        <span>입사일</span>
                        <span>상태</span>
                    </div>

                    {members.map((member) => (
                        <div
                            className="grid h-16 grid-cols-[minmax(240px,1fr)_120px_160px_110px_90px] items-center border-t border-[#D7E8DB] px-5 text-[12px] text-[#64748B]"
                            key={member.email}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${member.avatar}`}>
                                    {member.initials}
                                </span>
                                <span className="min-w-0">
                                    <strong className="block truncate text-[13px] font-semibold leading-[18px] text-[#0F172A]">{member.name}</strong>
                                    <span className="block truncate text-[10px] leading-[15px] text-[#94A3B8]">{member.email}</span>
                                </span>
                            </div>
                            <span>{member.role}</span>
                            <span>{member.phone}</span>
                            <span>{member.joinedAt}</span>
                            <span>
                                <span className={`inline-flex min-h-5 items-center rounded-full px-2 text-[10px] font-semibold ${statusStyle[member.status as keyof typeof statusStyle]}`}>
                                    {member.status}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
