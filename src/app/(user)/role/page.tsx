import AuthoritySelect from "@/feature/role/components/AuthoritySelect";
import RoleItem from "@/feature/role/components/RoleItem";
import { Check, Plus, Search, X } from "lucide-react";

const roles = [
    { name: "원장", count: 1, color: "bg-[#0F172A]" },
    { name: "강사", count: 4, color: "bg-[#2C8D50]", active: true },
    { name: "행정", count: 2, color: "bg-[#3E7D62]" },
    { name: "조교", count: 2, color: "bg-[#E8A838]" },
];



export default function Page() {
    return (
        <main className="h-[calc(100dvh-52px)] w-full overflow-auto bg-[#FCFCFC] px-8 py-7">
            <div className="flex flex-col md:flex-row h-full w-full items-start gap-6">
                <aside className="w-full mb-10 md:w-[240px] shrink-0">
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
                        {/* {roles.map((role) => (
                            <RoleItem role={role} />
                        ))} */}
                        <RoleItem />
                        <div className="text-[14px] text-center leading-[21px] text-[#64748B] font-normal mt-10">
                            생성된 역할이 없습니다
                        </div>

                    </nav>
                </aside>

                <section className="h-full w-full md:overflow-hidden rounded-[12px] md:border md:border-[#D7E8DB] md:bg-white">
                    {/* <div className="h-full flex justify-center items-center text-[14px] text-center leading-[21px] text-[#64748B] font-normal">
                        생성된 역할이 없습니다
                    </div> */}
                    <AuthoritySelect />
                </section>
            </div>
        </main>
    );
}
