import { Search } from "lucide-react";
import AuthoritySelectList from "./AuthoritySelectList";

export default function AuthoritySelect() {
    return (
        <>
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

            <div className="border-b border-[#D7E8DB] md:px-6 py-3">
                <div className="flex h-9 w-full items-center gap-2 rounded-[8px] bg-[#FCFCFC] px-3">
                    <Search className="size-3.5 text-[#B0B8C1]" strokeWidth={1.5} />
                    <input
                        className="w-full bg-transparent text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                        placeholder="권한 검색"
                    />
                </div>
            </div>

            <AuthoritySelectList />
        </>
    )
}