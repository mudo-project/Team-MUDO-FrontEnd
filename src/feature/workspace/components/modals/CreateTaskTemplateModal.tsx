'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createWorkspaceRecurringTemplateAction } from "../../actions";

export default function CreateTaskTemplateModal({ closeModal, workspaceId }: { closeModal: () => void, workspaceId: string }) {

    const queryClient = useQueryClient();
    const [error, setError] = useState<string>('')

    const createMutation = useMutation({
        mutationFn: ((formData: FormData) => (
            createWorkspaceRecurringTemplateAction(Number(workspaceId), formData)
        )),
        onSuccess: (result) => {
            if (!result.success) {
                setError(result.message)
                return;
            }

            void queryClient.invalidateQueries({
                queryKey: ["workspace-recurring-templates", workspaceId]
            });

            closeModal();
            toast.success(result.message)
        },
    });

    return (
        <div className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/30"
            onClick={closeModal}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    createMutation.mutate(new FormData(event.currentTarget));
                }}
                onClick={(e) => e.stopPropagation()}
                className="fixed top-1/2 left-1/2 z-1000 w-[90%] sm:w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-5 sm:p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]">
                <div className="flex w-full items-center">
                    <h2 className="text-[15px] leading-[22.5px] font-bold text-[#0F172A]">
                        반복 템플릿 추가
                    </h2>
                    <button
                        aria-label="반복 템플릿 추가 모달 닫기"
                        className="ml-auto flex size-3.5 items-center justify-center text-[#C0C8D0]"
                        type="button"
                        onClick={closeModal}
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-5">
                    <label
                        className="block pb-1.5 text-[12px] leading-[18px] font-medium text-[#6B7280]"
                        htmlFor="task-template-title"
                    >
                        업무 제목
                    </label>
                    <input
                        className="h-[37px] w-full rounded-[8px] border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] placeholder:text-[#0F172A]/50 focus:outline-none"
                        id="task-template-title"
                        name="title"
                        placeholder="예: 주간 출결 현황 정리"
                        type="text"
                    />
                </div>

                <div className="mt-3.5">
                    <label
                        className="block pb-1.5 text-[12px] leading-[18px] font-medium text-[#6B7280]"
                        htmlFor="task-template-cycle"
                    >
                        반복 주기
                    </label>
                    <div className="relative">
                        <select
                            className="h-[35px] w-full appearance-none rounded-[8px] border border-[#D7E8DB] bg-white px-4 pr-10 text-[13px] text-[#0F172A] focus:outline-none"
                            defaultValue="WEEKLY1"
                            name="repeat"
                            id="task-template-cycle"
                        >
                            <option value="WEEKLY1">매주 월요일</option>
                            <option value="WEEKLY2">매주 화요일</option>
                            <option value="WEEKLY3">매주 수요일</option>
                            <option value="WEEKLY4">매주 목요일</option>
                            <option value="WEEKLY5">매주 금요일</option>
                            <option value="WEEKLY6">매주 토요일</option>
                            <option value="WEEKLY7">매주 일요일</option>
                            <option value="MONTHLY">매월 1일</option>
                        </select>
                        <ChevronDown
                            className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-[#0F172A]"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                <div className="mt-3.5 rounded-[8px] bg-[#F7F8FA] px-3 py-2.5 text-[12px] leading-[18px] text-[#B0B8C1]">
                    설정된 주기가 도래하면 이 제목의 업무가 상태{" "}
                    <strong className="font-bold text-[#0F172A]">대기</strong>로 자동
                    등록됩니다.
                </div>
                {error &&
                    <div className="mt-4 rounded-[8px] bg-[#FFF0F3] px-3 py-3 text-[12px] leading-6 text-[#D45D76]">
                        {error}
                    </div>
                }

                <button
                    className="mt-3.5 h-10 w-full rounded-[8px] bg-[#1D2639] text-[13px] leading-[19.5px] font-medium text-white"
                    type="submit"
                >
                    템플릿 저장
                </button>
            </form>
        </div>
    );
}
