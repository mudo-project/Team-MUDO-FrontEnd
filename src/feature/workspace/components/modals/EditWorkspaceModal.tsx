"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    changeWorkspaceNameAction,
    getWorkspaceDetailAction,
} from "../../actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface EditWorkspaceModalProps {
    closeModal: () => void;
    workspaceId: string;
}

export default function EditWorkspaceModal({
    closeModal,
    workspaceId,
}: EditWorkspaceModalProps) {
    const queryClient = useQueryClient();
    const [changeError, setChangeError] = useState("");
    const {
        data: workspaceData,
        isPending: workspacePending,
        isError: workspaceError,
    } = useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: () => getWorkspaceDetailAction(Number(workspaceId)),
    });
    const changeWorkspaceMutation = useMutation({
        mutationFn: (formData: FormData) =>
            changeWorkspaceNameAction(
                Number(workspaceId),
                { success: false, message: "" },
                formData,
            ),
        onSuccess: (result) => {
            if (!result.success) {
                setChangeError(result.message);
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });
            void queryClient.invalidateQueries({
                queryKey: ["workspace-list", "MINE"],
            });
            closeModal();
            toast.success(result.message);
        },
        onError: (error) => {
            setChangeError(error.message);
        },
    });

    const workspaceDetailError = workspaceError
        ? "워크스페이스 상세 조회에 실패했습니다."
        : !workspacePending && !workspaceData?.success
          ? workspaceData?.message
          : "";

    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30"
            onClick={closeModal}
        >
            <form
                className="fixed top-1/2 left-1/2 z-1000 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]"
                onClick={(event) => event.stopPropagation()}
                onSubmit={(event) => {
                    event.preventDefault();
                    setChangeError("");
                    changeWorkspaceMutation.mutate(
                        new FormData(event.currentTarget),
                    );
                }}
            >
                <div className="flex w-full items-center">
                    <h2 className="text-[15px] leading-[22.5px] font-bold text-[#0F172A]">
                        워크스페이스 수정
                    </h2>
                    <button
                        aria-label="워크스페이스 수정 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#94A3B8]"
                        onClick={closeModal}
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
                        className="mt-1.5 h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none disabled:bg-[#F7F9F8]"
                        defaultValue={workspaceData?.data?.name}
                        disabled={workspacePending || Boolean(workspaceDetailError)}
                        id="workspace-name"
                        key={workspaceData?.data?.workspaceId}
                        name="name"
                        placeholder="워크스페이스 이름"
                        required
                    />
                </div>
                {workspaceDetailError && (
                    <p className="mt-3 text-[12px] text-red-500" role="alert">
                        {workspaceDetailError}
                    </p>
                )}
                {changeError && (
                    <p className="mt-3 text-[12px] text-red-500" role="alert">
                        {changeError}
                    </p>
                )}

                <button
                    className="mt-3.5 h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] leading-[19.5px] font-medium text-white disabled:bg-[#0F172A]/40"
                    disabled={
                        changeWorkspaceMutation.isPending ||
                        Boolean(workspaceDetailError) ||
                        workspacePending
                    }
                    type="submit"
                >
                    {changeWorkspaceMutation.isPending
                        ? "수정 중..."
                        : "워크스페이스 수정"}
                </button>
            </form>
        </div>
    );
}
