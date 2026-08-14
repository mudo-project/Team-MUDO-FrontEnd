"use client";

import { X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserListAction } from "@/feature/auth/actions";
import { addWorkspaceMembersAction, removeWorkspaceMemberAction } from "../../actions";
import WorkspaceAttends from "../WorkspaceAttends";
import WorkspaceAttendItem from "../WorkspaceAttendItem";
import { WorkspaceMemberData } from "../../type";

interface AddWorkspaceAttendModalProps {
    closeModal: () => void;
    workspaceId: string;
    currentMembers: WorkspaceMemberData[] | undefined
}

export default function AddWorkspaceAttendModal({
    closeModal,
    workspaceId,
    currentMembers
}: AddWorkspaceAttendModalProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isMemberListOpen, setIsMemberListOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [members, setMembers] = useState<UserListResponse[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<UserListResponse[]>([]);
    const [searchError, setSearchError] = useState("");
    const actionWithId = addWorkspaceMembersAction.bind(
        null,
        Number(workspaceId),
    );
    const [state, formAction, isPending] = useActionState(actionWithId, {
        success: false,
        message: "",
        data: undefined,
    });

    const removeMemberMutation = useMutation({
        mutationFn: (userId: number) =>
            removeWorkspaceMemberAction(Number(workspaceId), userId),
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.message);
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });
            toast.success(result.message);
        },
        onError: (error) => {
            toast.error(error.message);
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

    useEffect(() => {
        if (!state.success) return;

        toast.success(state.message);
        closeModal();
        router.refresh();
    }, [state, closeModal, router]);

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

    const removeCurrentMember = (userId: number) => {
        removeMemberMutation.mutate(userId);
    };

    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30"
            onClick={closeModal}
        >
            <form
                action={formAction}
                className="fixed top-1/2 left-1/2 z-1000 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex w-full items-center">
                    <h2 className="text-[15px] leading-[22.5px] font-bold text-[#0F172A]">
                        워크스페이스 참여자
                    </h2>
                    <button
                        aria-label="워크스페이스 참여자 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#94A3B8]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>


                <div className="mt-5">
                    <p className="text-[12px] leading-[18px] font-medium text-[#6B7280]">
                        현재 참여자
                    </p>
                    <p className="text-[10px] leading-[18px] font-base text-[#0F172A]/40">
                        x 표시를 누르면 참여자가 제거됩니다.
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {currentMembers?.map((member) => (
                            <WorkspaceAttendItem
                                key={member.userId}
                                member={{ ...member, username: '' }}
                                removeMember={removeCurrentMember}
                                disabled={removeMemberMutation.isPending}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-5">
                    <p className="text-[12px] leading-[18px] font-medium text-[#6B7280]">
                        참여자 추가
                    </p>

                    {selectedMembers.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {selectedMembers.map((member) => (
                                <WorkspaceAttendItem
                                    key={member.userId}
                                    member={member}
                                    removeMember={removeMember}
                                />
                            ))}
                        </div>
                    )}

                    <div className="relative mt-2 w-full">
                        <label
                            className="flex h-[39px] w-full items-center gap-1.5 rounded-[8px] border border-[#D7E8DB] px-3"
                            htmlFor="workspace-member-search"
                        >
                            <span className="text-[14px] leading-[21px] text-[#94A3B8]">
                                @
                            </span>
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
                                    <p className="px-3 py-2.5 text-[12px] text-red-500">
                                        {searchError}
                                    </p>
                                )}
                                {!searchError &&
                                    members.length === 0 && (
                                        <p className="px-3 py-2.5 text-[12px] text-[#64748B]">
                                            검색 결과가 없습니다.
                                        </p>
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

                {!state.success && state.message && (
                    <p className="mt-3 text-[12px] text-red-500" role="alert">
                        {state.message}
                    </p>
                )}

                <button
                    className="mt-3.5 h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] leading-[19.5px] font-medium text-white disabled:bg-[#0F172A]/40"
                    disabled={isPending || selectedMembers.length === 0}
                    type="submit"
                >
                    {isPending ? "추가 중..." : "참여자 추가"}
                </button>
            </form>
        </div>
    );
}
