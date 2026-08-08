"use client";

import { X } from "lucide-react";
import { useActionState, useState } from "react";
import { createWorkspaceAction } from "../../actions";
import { CreateWorkspaceData } from "../../type";
import WorkspaceAttends from "../WorkspaceAttends";

const members = [
    { name: "김지수", role: "원장" },
    { name: "이민호", role: "강사" },
    { name: "최현우", role: "강사" },
    { name: "강도현", role: "강사" },
    { name: "윤예진", role: "조교" },
    { name: "임성훈", role: "조교" },
];

export default function CreateWorkspaceModal() {
    const [isMemberListOpen, setIsMemberListOpen] = useState(false);
    const [state, createWorkspaceFormAcition, ispending] = useActionState(createWorkspaceAction, {
        success: false,
        message: '',
        data: undefined
    });

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30">
            <form
                action={createWorkspaceFormAcition}
                className="fixed top-1/2 left-1/2 z-1000 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                <div className="flex w-full items-center">
                    <h2 className="text-[15px] leading-[22.5px] font-bold text-[#0F172A]">
                        새 워크스페이스 만들기
                    </h2>
                    <button
                        aria-label="새 워크스페이스 만들기 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#94A3B8]"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-5">
                    <label
                        className="block text-[12px] leading-[18px] font-medium text-[#6B7280]"
                        htmlFor="workspace-name"
                    >
                        워크스페이스 이름
                    </label>
                    <input
                        className="mt-1.5 h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                        id="workspace-name"
                        name="workspaceName"
                        placeholder="예: 2월 학사 운영"
                    />
                </div>

                <div className="mt-3.5">
                    <p className="text-[12px] leading-[18px] font-medium text-[#6B7280]">
                        참여자
                    </p>

                    <div className="mt-1.5 flex h-[26px] items-center gap-1.5">
                        <span className="flex h-[26px] items-center gap-1.5 rounded-full bg-[#0F172A] px-2.5 text-[12px] leading-[18px] text-white">
                            박서연
                            <button
                                aria-label="박서연 참여자 제거"
                                className="text-[14px] leading-[14px] text-[#94A3B8]"
                                type="button"
                            >
                                ×
                            </button>
                        </span>
                        <span className="flex h-[26px] items-center gap-1.5 rounded-full bg-[#0F172A] px-2.5 text-[12px] leading-[18px] text-white">
                            정다은
                            <button
                                aria-label="정다은 참여자 제거"
                                className="text-[14px] leading-[14px] text-[#94A3B8]"
                                type="button"
                            >
                                ×
                            </button>
                        </span>
                    </div>

                    <div className="relative mt-2 w-full">
                        <label
                            className="flex h-[39px] w-full items-center gap-1.5 rounded-[8px] border border-[#D7E8DB] px-3"
                            htmlFor="workspace-member-search"
                        >
                            <span className="text-[14px] leading-[21px] text-[#94A3B8]">@</span>
                            <input
                                className="w-full text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                id="workspace-member-search"
                                name="memberSearch"
                                onBlur={() => setIsMemberListOpen(false)}
                                onFocus={() => setIsMemberListOpen(true)}
                                placeholder="이름으로 검색"
                            />
                        </label>

                        {isMemberListOpen && (
                            <div className="absolute top-full left-0 z-10 mt-0.5 max-h-[280px] w-full overflow-y-auto rounded-[8px] bg-white py-1 shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                                {members.map((member) => (
                                    <WorkspaceAttends member={member} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    disabled={ispending}
                    className="mt-3.5 h-10 w-full rounded-[8px] bg-[#0F172A]/40 text-[13px] leading-[19.5px] font-medium text-white"
                    type="submit"
                >
                    워크스페이스 생성
                </button>
            </form>
        </div>
    );
}
