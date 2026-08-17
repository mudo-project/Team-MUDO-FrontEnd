"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceTaskAction } from "../../actions";
import { toast } from "sonner";
import { useState } from "react";

export default function EditTaskDueModal({ closeModal, workspaceId }: { closeModal: () => void, workspaceId: string }) {

    const queryClient = useQueryClient();
    const [error, setError] = useState<string>('')

    const createMutation = useMutation({
        mutationFn: ((formData: FormData) => (
            createWorkspaceTaskAction(Number(workspaceId), formData)
        )),
        onSuccess: (result) => {
            if (!result.success) {
                setError(result.message)
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace", workspaceId],
            });

            closeModal();
            toast.success(result.message)
        },
    });


    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#202A3C]/30"
            onClick={closeModal}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    createMutation.mutate(new FormData(event.currentTarget));
                }}
                className="fixed top-1/2 left-1/2 z-1000 w-[90%] sm:w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(32,42,60,0.18)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center">
                    <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#202A3C]">업무 기한 재설정</h2>
                    <button
                        className="ml-auto px-1 text-[22px] font-light leading-none text-[#B7BEC9]"
                        type="button"
                        onClick={closeModal}
                        aria-label="업무 등록 모달 닫기"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-4">
                    <label className="block text-[13px] font-medium text-[#697386]" htmlFor="work-due-date">
                        기한
                    </label>
                    <input
                        className="mt-2 h-10 w-full rounded-[8px] border border-[#DCE1E7] px-3 text-[13px] text-[#202A3C] focus:border-[#9DA7B5] focus:outline-none"
                        id="work-due-date"
                        name="dueDate"
                        type="date"
                    />
                </div>

                <div className="mt-4 rounded-[8px] bg-[#F7F8FA] px-3 py-3 text-[12px] leading-6 text-[#A1AAB8]">
                    업무 상태를 바꾸려면 기한을 변경해야합니다.
                </div>
                {error &&
                    <div className="mt-4 rounded-[8px] bg-[#FFF0F3] px-3 py-3 text-[12px] leading-6 text-[#D45D76]">
                        {error}
                    </div>
                }


                <button
                    className="mt-4 h-11 w-full rounded-[8px] bg-[#A9ADB5] text-[14px] font-semibold text-white"
                    type="submit"
                >
                    업무 상태 변경
                </button>
            </form>
        </div>
    );
}
