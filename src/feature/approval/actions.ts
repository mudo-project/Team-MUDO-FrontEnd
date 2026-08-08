"use server";

import {
    cancelApproval,
    changeApprovalLines,
    changeApprovalTemplate,
    createApproval,
    createApprovalTemplate,
    decideApproval,
    deleteApprovalTemplate,
    getAllApprovalList,
    getApprovalDetail,
    getApprovalHistory,
    getApprovalPendingCount,
    getApprovalTemplateDetail,
    getApprovalTemplateList,
    getReceivedApprovalList,
    getSubmittedApprovalList,
    hideApprovalHistory,
    resubmitApproval,
    summarizeApprovalAttachment,
} from "@/service/approval.service";
import {
    ApprovalDetailData,
    ApprovalListData,
    ApprovalPageData,
    ApprovalPendingCountData,
    ApprovalTemplateDetailData,
    ApprovalTemplateListData,
    ApprovalTemplateRequest,
    ChangeApprovalLinesRequest,
    CreateApprovalData,
    CreateApprovalRequest,
    CreateApprovalTemplateData,
    DecideApprovalRequest,
    ReceivedApprovalListData,
    ApprovalAttachmentData,
} from "./type";

export interface ApprovalActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0;

const isValidPage = (page: number) => Number.isInteger(page) && page >= 0;

const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const getActionErrorMessage = (error: unknown, fallbackMessage: string) =>
    error instanceof Error ? error.message : fallbackMessage;

export const getApprovalTemplateListAction = async (
    page = 0,
): Promise<ApprovalActionResult<ApprovalPageData<ApprovalTemplateListData>>> => {
    if (!isValidPage(page)) {
        return {
            success: false,
            message: "페이지 번호가 올바르지 않습니다.",
        }
    }

    try {
        const response = await getApprovalTemplateList(page);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 템플릿 목록 조회에 실패했습니다."),
        };
    }
};

export const getApprovalTemplateDetailAction = async (
    templateId: number,
): Promise<ApprovalActionResult<ApprovalTemplateDetailData>> => {
    if (!isPositiveInteger(templateId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        const response = await getApprovalTemplateDetail(templateId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 템플릿 상세 조회에 실패했습니다."),
        };
    }
};

export const createApprovalTemplateAction = async (
    payload: ApprovalTemplateRequest,
): Promise<ApprovalActionResult<CreateApprovalTemplateData>> => {
    const name = payload.name.trim();
    if (!name) {
        return { success: false, message: "템플릿 이름을 입력해 주세요." };
    }
    if (
        payload.approverIds.length === 0 ||
        payload.approverIds.some((id) => !isPositiveInteger(id))
    ) {
        return { success: false, message: "결재자를 한 명 이상 선택해 주세요." };
    }

    try {
        const response = await createApprovalTemplate({ ...payload, name });
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 템플릿 생성에 실패했습니다."),
        };
    }
};

export const changeApprovalTemplateAction = async (
    templateId: number,
    payload: ApprovalTemplateRequest,
): Promise<ApprovalActionResult> => {
    if (!isPositiveInteger(templateId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }
    const name = payload.name.trim();
    if (!name) {
        return { success: false, message: "템플릿 이름을 입력해 주세요." };
    }
    if (
        payload.approverIds.length === 0 ||
        payload.approverIds.some((id) => !isPositiveInteger(id))
    ) {
        return { success: false, message: "결재자를 한 명 이상 선택해 주세요." };
    }

    try {
        await changeApprovalTemplate(templateId, { ...payload, name });
        return { success: true, message: "결재 템플릿을 수정했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 템플릿 수정에 실패했습니다."),
        };
    }
};

export const deleteApprovalTemplateAction = async (
    templateId: number,
): Promise<ApprovalActionResult> => {
    if (!isPositiveInteger(templateId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        await deleteApprovalTemplate(templateId);
        return { success: true, message: "결재 템플릿을 삭제했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 템플릿 삭제에 실패했습니다."),
        };
    }
};

export const createApprovalAction = async (
    payload: CreateApprovalRequest,
): Promise<ApprovalActionResult<CreateApprovalData>> => {
    const title = payload.title.trim();
    const text = payload.text?.trim();
    if (!isPositiveInteger(payload.templateId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }
    if (!title) {
        return { success: false, message: "결재 제목을 입력해 주세요." };
    }
    if (payload.contentType === "TEXT" && !text) {
        return { success: false, message: "결재 내용을 입력해 주세요." };
    }
    if (payload.fileIds?.some((id) => !isPositiveInteger(id))) {
        return { success: false, message: "첨부파일 ID가 올바르지 않습니다." };
    }
    if (payload.approverIds?.some((id) => !isPositiveInteger(id))) {
        return { success: false, message: "결재자 ID가 올바르지 않습니다." };
    }
    const hasStartDate = payload.leaveStartDate !== undefined;
    const hasEndDate = payload.leaveEndDate !== undefined;
    if (
        hasStartDate !== hasEndDate ||
        (payload.leaveStartDate !== undefined && !isValidDate(payload.leaveStartDate)) ||
        (payload.leaveEndDate !== undefined && !isValidDate(payload.leaveEndDate)) ||
        (payload.leaveStartDate !== undefined &&
            payload.leaveEndDate !== undefined &&
            payload.leaveEndDate < payload.leaveStartDate)
    ) {
        return { success: false, message: "휴가 기간이 올바르지 않습니다." };
    }

    try {
        const response = await createApproval({ ...payload, title, text });
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 신청에 실패했습니다."),
        };
    }
};

export const getAllApprovalListAction = async (
    page = 0,
): Promise<ApprovalActionResult<ApprovalPageData<ApprovalListData>>> => {
    if (!isValidPage(page)) {
        return {
            success: false,
            message: "페이지 번호가 올바르지 않습니다.",
        }
    }

    try {
        const response = await getAllApprovalList(page);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "전체 결재 목록 조회에 실패했습니다."),
        };
    }
};

export const getSubmittedApprovalListAction = async (
    page = 0,
): Promise<ApprovalActionResult<ApprovalPageData<ApprovalListData>>> => {
    if (!isValidPage(page)) {
        return {
            success: false,
            message: "페이지 번호가 올바르지 않습니다.",
        }
    }

    try {
        const response = await getSubmittedApprovalList(page);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(
                error,
                "내가 신청한 결재 목록 조회에 실패했습니다.",
            ),
        };
    }
};

export const getReceivedApprovalListAction = async (
    page = 0,
): Promise<ApprovalActionResult<ApprovalPageData<ReceivedApprovalListData>>> => {
    if (!isValidPage(page)) {
        return {
            success: false,
            message: "페이지 번호가 올바르지 않습니다.",
        }
    }

    try {
        const response = await getReceivedApprovalList(page);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "내게 온 결재 목록 조회에 실패했습니다."),
        };
    }
};

export const getApprovalHistoryAction = async (
    page = 0,
): Promise<ApprovalActionResult<ApprovalPageData<ReceivedApprovalListData>>> => {
    if (!isValidPage(page)) {
        return {
            success: false,
            message: "페이지 번호가 올바르지 않습니다.",
        }
    }

    try {
        const response = await getApprovalHistory(page);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "내 결재 이력 조회에 실패했습니다."),
        };
    }
};

export const hideApprovalHistoryAction = async (
    documentId: number,
): Promise<ApprovalActionResult> => {
    if (!isPositiveInteger(documentId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        await hideApprovalHistory(documentId);
        return { success: true, message: "내 결재 이력에서 삭제했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "내 결재 이력 삭제에 실패했습니다."),
        };
    }
};

export const getApprovalDetailAction = async (
    documentId: number,
): Promise<ApprovalActionResult<ApprovalDetailData>> => {
    if (!isPositiveInteger(documentId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        const response = await getApprovalDetail(documentId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 상세 조회에 실패했습니다."),
        };
    }
};

export const changeApprovalLinesAction = async (
    documentId: number,
    payload: ChangeApprovalLinesRequest,
): Promise<ApprovalActionResult> => {
    if (!isPositiveInteger(documentId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }
    if (
        payload.approverIds.length === 0 ||
        payload.approverIds.some((id) => !isPositiveInteger(id))
    ) {
        return { success: false, message: "결재자를 한 명 이상 선택해 주세요." };
    }

    try {
        await changeApprovalLines(documentId, payload);
        return { success: true, message: "결재선을 수정했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재선 수정에 실패했습니다."),
        };
    }
};

export const decideApprovalAction = async (
    documentId: number,
    payload: DecideApprovalRequest,
): Promise<ApprovalActionResult> => {
    if (!isPositiveInteger(documentId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        await decideApproval(documentId, {
            ...payload,
            comment: payload.comment?.trim() || undefined,
        });
        return { success: true, message: "결재를 처리했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 승인/반려에 실패했습니다."),
        };
    }
};

export const cancelApprovalAction = async (
    documentId: number,
): Promise<ApprovalActionResult> => {
    if (!isPositiveInteger(documentId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        await cancelApproval(documentId);
        return { success: true, message: "결재 신청을 취소했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 신청 취소에 실패했습니다."),
        };
    }
};

export const resubmitApprovalAction = async (
    documentId: number,
): Promise<ApprovalActionResult<CreateApprovalData>> => {
    if (!isPositiveInteger(documentId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        const response = await resubmitApproval(documentId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 재상신에 실패했습니다."),
        };
    }
};

export const getApprovalPendingCountAction = async (): Promise<
    ApprovalActionResult<ApprovalPendingCountData>
> => {
    try {
        const response = await getApprovalPendingCount();
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "결재 대기 건수 조회에 실패했습니다."),
        };
    }
};

export const summarizeApprovalAttachmentAction = async (
    documentId: number,
    fileId: number,
): Promise<ApprovalActionResult<ApprovalAttachmentData>> => {
    if (!isPositiveInteger(documentId) || !isPositiveInteger(fileId)) {
        return {
            success: false,
            message: "ID가 올바르지 않습니다.",
        }
    }

    try {
        const response = await summarizeApprovalAttachment(documentId, fileId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "첨부파일 요약 생성에 실패했습니다."),
        };
    }
};
