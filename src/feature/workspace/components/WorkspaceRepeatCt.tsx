"use client";

import { useQuery } from "@tanstack/react-query";
import { getWorkspaceRecurringTemplateListAction } from "../actions";
import WorkTemplateItem from "./WorkTemplateItem";

interface WorkspaceRepeatCtProps {
    workspaceId: string;
}

export default function WorkspaceRepeatCt({ workspaceId }: WorkspaceRepeatCtProps) {
    const {
        data: templateData,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["workspace-recurring-templates", workspaceId],
        queryFn: () => getWorkspaceRecurringTemplateListAction(Number(workspaceId)),
    });

    const templates = templateData?.data?.content ?? [];

    return (
        <main className="min-h-[calc(100vh-112px)] w-full bg-[#FCFDFE] p-2 text-[#202A3C] sm:p-2.5 md:p-4 lg:p-6">
            <div className="text-[10px] leading-[19.2px] text-[#AEB6C3] md:text-[11px] lg:text-[12px]">
                <p>
                    반복 주기와 업무 제목을 미리 등록해두면 주기 도래 시 자동으로 상태
                    <strong className="ml-1 font-bold text-[#4F5868]">대기</strong>
                    로 업무가 생성됩니다.
                </p>
                <p className="text-[#C2C8D1]">아래 &apos;지금 생성&apos; 버튼으로 즉시 테스트할 수 있습니다.</p>
            </div>

            {isPending && <p className="mt-5 text-[12px] text-[#AEB6C3]">반복 업무를 불러오는 중입니다.</p>}

            {(isError || (templateData && !templateData.success)) && (
                <p className="mt-5 text-[12px] text-red-500">
                    {templateData?.message ?? "반복 업무 템플릿 목록을 불러오지 못했습니다."}
                </p>
            )}

            {!isPending && !isError && templateData?.success && (
                <section className="mt-3 space-y-2 sm:mt-4 md:space-y-2.5 lg:mt-5">
                    {templates.length > 0 ? (
                        templates.map((template) => (
                            <WorkTemplateItem key={template.templateId} template={template} workspaceId={workspaceId} />
                        ))
                    ) : (
                        <p className="text-[12px] text-[#AEB6C3]">등록된 반복 업무가 없습니다.</p>
                    )}
                </section>
            )}
        </main>
    );
}
