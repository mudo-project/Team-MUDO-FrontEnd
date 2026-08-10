'use client'

import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { ApprovalTemplateLineData, ApprovalTemplateListData } from "../type";
import { getApprovalTemplateListAction } from "../actions";
import { getUserListAction } from "@/feature/auth/actoins";
import { ChevronDown, Plus } from "lucide-react";

interface TemplateDatas {
    templates: ApprovalTemplateListData[];
    users: UserListResponse[];
    isLoading: boolean;
    error: string;
}


interface Props {
    setSelectedTemplateId: Dispatch<SetStateAction<string>>;
    setApprovalLines: Dispatch<SetStateAction<ApprovalTemplateLineData[]>>;
    setHasChangedApprovalLine: Dispatch<SetStateAction<boolean>>;
    approvalLines: ApprovalTemplateLineData[];
    selectedTemplateId: string;
    templateDatas: TemplateDatas,
    setTemplateDatas: Dispatch<SetStateAction<TemplateDatas>>;
    isMounted: RefObject<boolean>;
}

export default function ApprovalLine({ setSelectedTemplateId, setApprovalLines, setHasChangedApprovalLine, approvalLines, selectedTemplateId, templateDatas, setTemplateDatas, isMounted }: Props) {

    useEffect(() => {
        isMounted.current = true;
        let cancelled = false;

        const loadInitialData = async () => {

            const templateResponse = await getApprovalTemplateListAction();
            const userResponse = await getUserListAction();

            if (cancelled) return;

            if (!templateResponse.success) {
                setTemplateDatas({ ...templateDatas, error: templateResponse.message })
            } else {
                const templateList = templateResponse.data?.content ?? [];
                setTemplateDatas((prev) => ({ ...prev, templates: templateList }));
                setSelectedTemplateId(
                    templateList[0] ? String(templateList[0].id) : "",
                );
            }

            if (userResponse.success) {
                const userList = userResponse.data ?? []
                setTemplateDatas((prev) => ({ ...prev, users: userList }));
            }

            setTemplateDatas((prev) => ({ ...prev, isLoading: false }));
        };

        loadInitialData();

        return () => {
            cancelled = true;
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const loadTemplateDetail = () => {
            const selectedTemplate = templateDatas.templates.filter((template) => {
                return template.id === Number(selectedTemplateId)
            })

            const lines = selectedTemplate[0].lines.sort(
                (a, b) => a.stepOrder - b.stepOrder,
            );
            setApprovalLines(lines);
            setHasChangedApprovalLine(false);
        };

        if (templateDatas.templates.length > 0 && selectedTemplateId) {
            loadTemplateDetail();
        }
    }, [selectedTemplateId, templateDatas]);

    const approverIds = approvalLines.map(({ approverId }) => approverId);

    const availableUser = templateDatas.users.find(
        ({ userId }) => !approverIds.includes(userId),
    );

    // 결재 라인 변경
    const addApprovalLine = () => {
        if (!availableUser) return;

        setApprovalLines((current) => [
            ...current,
            {
                stepOrder: current.length + 1,
                approverId: availableUser.userId,
                approverName: availableUser.name,
            },
        ]);
        setHasChangedApprovalLine(true);
    };

    const removeApprovalLine = (stepOrder: number) => {
        if (approvalLines.length === 1) return;

        setApprovalLines((current) =>
            current
                .filter((line) => line.stepOrder !== stepOrder)
                .map((line, index) => ({ ...line, stepOrder: index + 1 })),
        );
        setHasChangedApprovalLine(true);
    };

    const changeApprover = (stepOrder: number, userId: number) => {
        const user = templateDatas.users.find(({ userId: id }) => id === userId);
        if (!user) return;

        setApprovalLines((current) =>
            current.map((line) =>
                line.stepOrder === stepOrder
                    ? {
                        ...line,
                        approverId: user.userId,
                        approverName: user.name,
                    }
                    : line,
            ),
        );
        setHasChangedApprovalLine(true);
    };

    return (
        <>
            <div className="mt-4 w-full">
                <label className="block pb-1.5 text-[12px] font-medium leading-[18px] text-[#6B7280]" htmlFor="approval-template">
                    양식 선택 <span className="text-[#C0483F]">*</span>
                </label>
                <div className="relative flex h-[37px] items-center rounded-[8px] border border-[#D7E8DB] bg-white">
                    <select
                        className="h-full w-full appearance-none bg-transparent px-3 pr-9 text-[13px] text-[#0F172A] focus:outline-none"
                        disabled={templateDatas.isLoading || templateDatas.templates.length === 0}
                        id="approval-template"
                        onChange={(event) => setSelectedTemplateId(event.target.value)}
                        value={selectedTemplateId}
                    >
                        {templateDatas.templates.length === 0 && <option value="">선택 가능한 양식이 없습니다</option>}
                        {templateDatas.templates.map((template) => (
                            <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 text-[#0F172A]" strokeWidth={2} />
                </div>
            </div>
            <div className="mt-4 w-full">
                <p className="text-[12px] font-medium leading-[18px] text-[#6B7280]">
                    결재 라인 <span className="font-normal text-[#C0C8D0]">(수정 가능)</span>
                </p>
                <div className="pt-1.5">
                    {templateDatas.isLoading && <p className="py-2 text-[11px] text-[#B0B8C1]">결재선을 불러오는 중입니다.</p>}
                    {!templateDatas.isLoading && approvalLines.map((line) => (
                        <div className="mb-1.5 flex h-[30px] items-center gap-2" key={`${line.stepOrder}-${line.approverId}`}>
                            <span className="w-7 shrink-0 text-[11px] text-[#B0B8C1]">{line.stepOrder}차</span>
                            <div className="relative flex h-[30px] w-full items-center rounded-[7px] border border-[#D7E8DB] bg-white">
                                <select
                                    aria-label={`${line.stepOrder}차 결재자`}
                                    className="h-full w-full appearance-none bg-transparent px-3 pr-8 text-[12px] text-[#0F172A] focus:outline-none"
                                    onChange={(event) => changeApprover(line.stepOrder, Number(event.target.value))}
                                    value={line.approverId}
                                >
                                    {!templateDatas.users.some(({ userId }) => userId === line.approverId) && (
                                        <option value={line.approverId}>{line.approverName}</option>
                                    )}
                                    {templateDatas.users.map((user) => (
                                        <option disabled={approverIds.includes(user.userId) && user.userId !== line.approverId} key={user.userId} value={user.userId}>
                                            {user.name} ({user.username})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 size-3 text-[#0F172A]" strokeWidth={2} />
                            </div>
                            <button aria-label={`${line.stepOrder}차 결재자 삭제`} className="text-[14px] text-[#C0C8D0]" onClick={() => removeApprovalLine(line.stepOrder)} type="button">×</button>
                        </div>
                    ))}
                    <button
                        className="flex h-8 w-full items-center gap-1.5 rounded-[7px] border border-dashed border-[#D7E8DB] px-2.5 text-[12px] text-[#B0B8C1] disabled:opacity-40"
                        disabled={!availableUser || templateDatas.isLoading}
                        onClick={addApprovalLine}
                        type="button"
                    >
                        <Plus className="size-3.5" strokeWidth={1.5} />
                        결재자 추가
                    </button>
                </div>
            </div>
        </>
    )
}