"use client";

import {
    changeApprovalLinesAction,
} from "@/feature/approval/actions";
import {
    ApprovalDetailData,
    ApprovalTemplateLineData,
    ApprovalTemplateListData,
} from "@/feature/approval/type";
import { ChevronDown, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";
import { getUserListAction } from "@/feature/auth/actoins";

interface EditApprovalModalProps {
    closeModal: () => void;
    documentId: number;
    approval: ApprovalDetailData;
}

interface TemplateDatas {
    templates: ApprovalTemplateListData[];
    users: UserListResponse[];
    isLoading: boolean;
    error: string;
}


export default function EditApprovalModal({
    closeModal,
    documentId,
    approval
}: EditApprovalModalProps) {
    const router = useRouter();
    const isMounted = useRef(true);

    const [templateDatas, setTemplateDatas] = useState<TemplateDatas>({
        templates: [],
        users: [],
        isLoading: true,
        error: ''
    });
    const [approvalLines, setApprovalLines] = useState<ApprovalTemplateLineData[]>(approval.lines);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        isMounted.current = true;
        let cancelled = false;

        const loadInitialData = async () => {

            const userResponse = await getUserListAction();

            if (cancelled) return;

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

    const approverIds = approvalLines.map(({ approverId }) => approverId);
    const availableUser = templateDatas.users.find(
        ({ userId }) => !approverIds.includes(userId),
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError("");

        const response = await changeApprovalLinesAction(documentId, {
            approverIds: approvalLines.map(({ approverId }) => approverId),
        });

        setIsSubmitting(false);

        if (!response.success) {
            setError(response.message);
            return;
        }

        toast.success(response.message);
        closeModal();
        router.refresh();
    };

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
    };

    const removeApprovalLine = (stepOrder: number) => {
        if (approvalLines.length === 1) return;

        setApprovalLines((current) =>
            current
                .filter((line) => line.stepOrder !== stepOrder)
                .map((line, index) => ({ ...line, stepOrder: index + 1 })),
        );
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
    };



    return (
        <div
            className="fixed top-0 left-0 z-999 h-screen w-screen bg-[#162236]/35"
            onClick={closeModal}
        >
            <form
                className="fixed top-1/2 left-1/2 z-1000 max-h-[85vh] w-5/6 max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[14px] bg-white p-6 shadow-[0_8px_40px_rgba(22,34,54,0.18)] scrollbar-hide md:w-3/5 lg:w-[560px] lg:p-7"
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="flex items-center">
                    <h2 className="text-[15px] font-bold leading-[22.5px] text-[#0F172A] lg:text-[18px] lg:leading-[27px]">
                        결재 라인 수정
                    </h2>
                    <button
                        aria-label="결재 라인 수정 모달 닫기"
                        className="ml-auto flex size-[22px] items-center justify-center text-[#C0C8D0]"
                        onClick={closeModal}
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.5} />
                    </button>
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

                {(templateDatas.error || error) && (
                    <p className="mt-3 text-[12px] text-red-500" role="alert">
                        {templateDatas.error || error}
                    </p>
                )}

                <button
                    className="mt-4 h-10 w-full rounded-[8px] bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white disabled:opacity-40"
                    disabled={isSubmitting || templateDatas.isLoading || approvalLines.length === 0}
                    type="submit"
                >
                    {isSubmitting ? "수정 중..." : "수정하기"}
                </button>
            </form>
        </div>
    );
}
