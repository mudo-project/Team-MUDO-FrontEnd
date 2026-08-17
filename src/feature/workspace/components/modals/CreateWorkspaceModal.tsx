"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getUserListAction } from "@/feature/auth/actions";
import { createWorkspaceAction } from "../../actions";
import WorkspaceAttends from "../WorkspaceAttends";
import WorkspaceAttendItem from "../WorkspaceAttendItem";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateWorkspaceModal({ closeModal }: { closeModal: () => void }) {
    const [isMemberListOpen, setIsMemberListOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [members, setMembers] = useState<UserListResponse[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<UserListResponse[]>([]);
    const [searchError, setSearchError] = useState("");
    const [createError, setCreateError] = useState("");
    const queryClient = useQueryClient();
    const createWorkspaceMutation = useMutation({
        mutationFn: (formData: FormData) =>
            createWorkspaceAction({ success: false, message: "" }, formData),
        onSuccess: (result) => {
            if (!result.success) {
                setCreateError(result.message);
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace-list", "MINE"],
            });
            closeModal();
            toast.success(result.message);
        },
        onError: (error) => {
            setCreateError(error.message);
        },
    });


    const isFirstRender = useRef(true);
    useEffect(() => {
        let cancelled = false;

        const fetchUser = async () => {
            setSearchError("");
            const response = await getUserListAction(searchInput.trim());
            if (cancelled) return;


            setMembers(response.data ?? [])
            setSearchError(response.success ? "" : response.message);
        }

        if (isFirstRender.current) {
            fetchUser();
            isFirstRender.current = false;
            return () => {
                cancelled = true;
            };
        }

        const debounceTimer = setTimeout(() => {
            fetchUser();
        }, 500);

        return () => {
            cancelled = true;
            clearTimeout(debounceTimer);
        }
    }, [searchInput]);

    const addMember = (member: UserListResponse) => {
        setSelectedMembers((current) =>
            current.some(({ userId }) => userId === member.userId)
                ? current
                : [...current, member],
        );
    };

    const removeMember = (userId: number) => {
        setSelectedMembers((current) =>
            current.filter((member) => member.userId !== userId),
        );
    };

    return (
        <div onClick={closeModal} className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30">
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={(event) => {
                    event.preventDefault();
                    setCreateError("");
                    createWorkspaceMutation.mutate(
                        new FormData(event.currentTarget),
                    );
                }}
                className="fixed top-1/2 left-1/2 z-1000 flex max-h-[450px] md:max-h-[550px] w-[90%] sm:w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                <header className="flex w-full shrink-0 items-center p-5 pb-0 sm:p-6 sm:pb-0">
                    <h2 className="text-[15px] leading-[22.5px] font-bold text-[#0F172A]">
                        새 워크스페이스 만들기
                    </h2>
                    <button
                        aria-label="새 워크스페이스 만들기 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#94A3B8]"
                        type="button"
                        onClick={closeModal}
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 pt-0 sm:p-6 sm:pt-0">
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
                        name="name"
                        placeholder="예: 2월 학사 운영"
                    />
                </div>

                <div className="mt-3.5">
                    <p className="text-[12px] leading-[18px] font-medium text-[#6B7280]">
                        참여자
                    </p>

                    {selectedMembers.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {selectedMembers.map((member) => (
                                <WorkspaceAttendItem key={member.userId} member={member} removeMember={removeMember} />
                            ))}
                        </div>
                    )}

                    <div className="relative mt-2 w-full">
                        <label
                            className="flex h-[39px] w-full items-center gap-1.5 rounded-[8px] border border-[#D7E8DB] px-3"
                            htmlFor="workspace-member-search"
                        >
                            <span className="text-[14px] leading-[21px] text-[#94A3B8]">@</span>
                            <input
                                className="w-full text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                                id="workspace-member-search"
                                onBlur={() => setIsMemberListOpen(false)}
                                onChange={(event) => setSearchInput(event.target.value)}
                                onFocus={() => setIsMemberListOpen(true)}
                                placeholder="이름으로 검색"
                                type="search"
                                value={searchInput}
                            />
                        </label>

                        {isMemberListOpen && (
                            <div className="absolute top-full left-0 z-10 mt-0.5 max-h-[280px] w-full overflow-y-auto rounded-[8px] bg-white py-1 shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                                {searchError && (
                                    <p className="px-3 py-2.5 text-[12px] text-red-500">{searchError}</p>
                                )}
                                {!searchError && searchInput && members.length === 0 && (
                                    <p className="px-3 py-2.5 text-[12px] text-[#64748B]">검색 결과가 없습니다.</p>
                                )}
                                {members.map((member) => (
                                    <WorkspaceAttends
                                        key={member.userId}
                                        member={member}
                                        onSelect={addMember}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {createError && (
                    <p
                        className={`mt-3 text-[12px] text-red-500`}
                    >
                        {createError}
                    </p>
                )}
                </div>

                <footer className="shrink-0 p-5 pt-3.5 sm:p-6 sm:pt-3.5">
                    <button
                        disabled={createWorkspaceMutation.isPending}
                        className={`h-10 w-full rounded-[8px] ${createWorkspaceMutation.isPending ? 'bg-[#0F172A]/40' : 'bg-[#1D2639]'} text-[13px] leading-[19.5px] font-medium text-white`}
                        type="submit"
                    >
                        {createWorkspaceMutation.isPending ? "생성 중..." : "워크스페이스 생성"}
                    </button>
                </footer>
            </form>
        </div>
    );
}
