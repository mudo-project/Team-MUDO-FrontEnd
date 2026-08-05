import CreateRoleModal from "@/feature/role/components/modal/CreateRoleModal";
import { Check, Plus, Search, X } from "lucide-react";

const roles = [
    { name: "원장", count: 1, color: "bg-[#0F172A]" },
    { name: "강사", count: 4, color: "bg-[#2C8D50]", active: true },
    { name: "행정", count: 2, color: "bg-[#3E7D62]" },
    { name: "조교", count: 2, color: "bg-[#E8A838]" },
];

const permissionGroups = [
    {
        title: "구성원 관리",
        permissions: [
            { name: "구성원 초대", description: "새 구성원을 학원에 초대할 수 있습니다." },
            { name: "구성원 내보내기", description: "기존 구성원을 내보낼 수 있습니다." },
            { name: "역할 관리", description: "역할을 생성, 수정, 삭제하고 구성원에게 지정할 수 있습니다." },
        ],
    },
    {
        title: "원생 관리",
        permissions: [
            { name: "원생 조회", description: "원생 목록 및 상세 정보를 조회할 수 있습니다.", enabled: true },
            { name: "원생 등록·수정", description: "원생 정보를 등록하거나 수정할 수 있습니다." },
            { name: "원생 삭제", description: "원생 정보를 삭제할 수 있습니다." },
        ],
    },
    {
        title: "일정 및 수업",
        permissions: [
            { name: "일정 조회", description: "학원 일정 및 시간표를 조회할 수 있습니다.", enabled: true },
            { name: "일정 관리", description: "일정을 생성, 수정, 삭제할 수 있습니다." },
            { name: "시간표 관리", description: "수업 시간표와 강사 배정을 관리할 수 있습니다." },
        ],
    },
    {
        title: "전자결재",
        permissions: [
            { name: "전자결재 조회", description: "전자결재 문서 목록을 조회할 수 있습니다.", enabled: true },
            { name: "전자결재 처리", description: "전자결재 문서를 승인하거나 반려할 수 있습니다." },
        ],
    },
];

export default function Page() {
    return (
        <main className="h-[calc(100dvh-52px)] w-full overflow-hidden bg-[#FCFCFC] px-8 py-7">
            {/* <CreateRoleModal /> */}
            <div className="flex h-full w-full items-start gap-6">
                <aside className="h-full w-[240px] shrink-0">
                    <div className="flex h-[36px] w-full items-start border-b border-transparent pb-2">
                        <h2 className="text-[13px] font-semibold leading-[19.5px] tracking-[0.78px] text-[#64748B]">
                            역할
                        </h2>
                        <button
                            aria-label="역할 추가"
                            className="ml-auto flex size-7 items-center justify-center rounded-[6px] text-[#64748B]"
                            type="button"
                        >
                            <Plus className="size-4" strokeWidth={1.5} />
                        </button>
                    </div>

                    <nav className="mt-1 w-full">
                        {roles.map((role) => (
                            <button
                                className={`flex h-11 w-full items-center gap-2.5 rounded-[8px] border-l-[2px] px-3 ${role.active
                                    ? "border-[#2C8D50] bg-[#EDF0F4]"
                                    : "border-transparent bg-transparent"
                                    }`}
                                key={role.name}
                                type="button"
                            >
                                <span className={`size-2.5 rounded-full ${role.color}`} />
                                <span className={`text-[14px] leading-[21px] text-[#0F172A] ${role.active ? "font-semibold" : "font-normal"}`}>
                                    {role.name}
                                </span>
                                <span className="ml-auto text-[12px] font-normal leading-[18px] text-[#64748B]">
                                    {role.count}명
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <section className="h-full w-full overflow-hidden rounded-[12px] border border-[#D7E8DB] bg-white">
                    <header className="w-full border-b border-[#D7E8DB] px-6 pt-5 pb-4">
                        <div className="flex w-full items-center gap-3">
                            <span className="size-3.5 rounded-full bg-[#2C8D50]" />
                            <h1 className="text-[20px] font-bold leading-[30px] text-[#0F172A]">강사</h1>
                            <button
                                className="ml-auto h-8 rounded-[6px] border border-[#D7E8DB] bg-white px-3 text-[12px] font-normal leading-[18px] text-[#64748B]"
                                type="button"
                            >
                                이름 수정
                            </button>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-[13px] font-normal leading-[19.5px] text-[#64748B]">
                            <span>구성원 4명</span>
                            <span>권한 4/18개 활성</span>
                        </div>
                    </header>

                    <div className="border-b border-[#D7E8DB] px-6 py-3">
                        <div className="flex h-9 w-full items-center gap-2 rounded-[8px] bg-[#FCFCFC] px-3">
                            <Search className="size-3.5 text-[#B0B8C1]" strokeWidth={1.5} />
                            <input
                                className="w-full bg-transparent text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                placeholder="권한 검색"
                            />
                        </div>
                    </div>

                    <div className="h-[calc(100%-153px)] w-full overflow-y-auto py-2 scrollbar-hide">
                        {permissionGroups.map((group) => (
                            <section className="w-full" key={group.title}>
                                <h2 className="px-6 pt-4 pb-2 text-[11px] font-bold leading-[16.5px] tracking-[0.88px] text-[#64748B]">
                                    {group.title}
                                </h2>
                                {group.permissions.map((permission) => (
                                    <div
                                        className="flex min-h-[73px] w-full items-center gap-4 border-b border-[#FCFCFC] px-6 py-3.5 last:border-b-0"
                                        key={permission.name}
                                    >
                                        <div className="w-full">
                                            <h3 className="text-[14px] font-semibold leading-[21px] text-[#0F172A]">
                                                {permission.name}
                                            </h3>
                                            <p className="pt-1 text-[13px] font-normal leading-[19.5px] text-[#64748B]">
                                                {permission.description}
                                            </p>
                                        </div>
                                        <span
                                            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${permission.enabled ? "bg-[#2C8D50] text-white" : "bg-[#EDF0F4] text-[#64748B]"
                                                }`}
                                        >
                                            {permission.enabled ? (
                                                <Check className="size-4" strokeWidth={1.7} />
                                            ) : (
                                                <X className="size-3.5" strokeWidth={1.5} />
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </section>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
