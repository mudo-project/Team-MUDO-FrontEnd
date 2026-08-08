import {
    ApprovalDetailResponse,
    ApprovalListResponse,
    ApprovalPendingCountResponse,
    ApprovalTemplateDetailResponse,
    ApprovalTemplateListResponse,
    ApprovalTemplateRequest,
    ChangeApprovalLinesRequest,
    CreateApprovalRequest,
    CreateApprovalResponse,
    CreateApprovalTemplateResponse,
    DecideApprovalRequest,
    ReceivedApprovalListResponse,
    ResubmitApprovalResponse,
    SummarizeApprovalAttachmentResponse,
} from "@/feature/approval/type";
import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

const getPageQuery = (page: number = 0) => new URLSearchParams({ page: String(page) }).toString();

export const getApprovalTemplateList = async (page?: number): Promise<ApprovalTemplateListResponse> => {
    const response = await fetchWithAuth(`/api/approval-templates?${getPageQuery(page)}`,);
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 템플릿 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getApprovalTemplateDetail = async (
    templateId: number,
): Promise<ApprovalTemplateDetailResponse> => {
    const response = await fetchWithAuth(`/api/approval-templates/${templateId}`);
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 템플릿 상세 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const createApprovalTemplate = async (
    payload: ApprovalTemplateRequest,
): Promise<CreateApprovalTemplateResponse> => {
    const response = await fetchWithAuth("/api/approval-templates", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 템플릿 생성에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const changeApprovalTemplate = async (
    templateId: number,
    payload: ApprovalTemplateRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/approval-templates/${templateId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 템플릿 수정에 실패했습니다.");
        throw new Error(message);
    }
};

export const deleteApprovalTemplate = async (templateId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/approval-templates/${templateId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 템플릿 삭제에 실패했습니다.");
        throw new Error(message);
    }
};

export const createApproval = async (
    payload: CreateApprovalRequest,
): Promise<CreateApprovalResponse> => {
    const response = await fetchWithAuth("/api/approvals", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 신청에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getAllApprovalList = async (page?: number): Promise<ApprovalListResponse> => {
    const response = await fetchWithAuth(
        `/api/approvals?${getPageQuery(page)}`,
    );
    if (!response.ok) {
        const message = await getErrorMessage(response, "전체 결재 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getSubmittedApprovalList = async (page?: number): Promise<ApprovalListResponse> => {
    const response = await fetchWithAuth(
        `/api/approvals/me/submitted?${getPageQuery(page)}`,
    );
    if (!response.ok) {
        const message = await getErrorMessage(response, "내가 신청한 결재 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getReceivedApprovalList = async (page?: number): Promise<ReceivedApprovalListResponse> => {
    const response = await fetchWithAuth(
        `/api/approvals/me?${getPageQuery(page)}`,
    );
    if (!response.ok) {
        const message = await getErrorMessage(response, "내게 온 결재 목록 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getApprovalHistory = async (page?: number): Promise<ReceivedApprovalListResponse> => {
    const response = await fetchWithAuth(
        `/api/approvals/me/history?${getPageQuery(page)}`,
    );
    if (!response.ok) {
        const message = await getErrorMessage(response, "내 결재 이력 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const hideApprovalHistory = async (documentId: number): Promise<void> => {
    const response = await fetchWithAuth(
        `/api/approvals/me/history/${documentId}`,
        { method: "DELETE" },
    );
    if (!response.ok) {
        const message = await getErrorMessage(response, "내 결재 이력 삭제에 실패했습니다.");
        throw new Error(message);
    }
};

export const getApprovalDetail = async (
    documentId: number,
): Promise<ApprovalDetailResponse> => {
    const response = await fetchWithAuth(`/api/approvals/${documentId}`);
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 상세 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const changeApprovalLines = async (
    documentId: number,
    payload: ChangeApprovalLinesRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/approvals/${documentId}/lines`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재선 수정에 실패했습니다.");
        throw new Error(message);
    }
};

export const decideApproval = async (
    documentId: number,
    payload: DecideApprovalRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/approvals/${documentId}/decide`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 승인/반려에 실패했습니다.");
        throw new Error(message);
    }
};

export const cancelApproval = async (documentId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/approvals/${documentId}/cancel`, {
        method: "POST",
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 신청 취소에 실패했습니다.");
        throw new Error(message);
    }
};

export const resubmitApproval = async (
    documentId: number,
): Promise<ResubmitApprovalResponse> => {
    const response = await fetchWithAuth(`/api/approvals/${documentId}/resubmit`, {
        method: "POST",
    });
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 재상신에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getApprovalPendingCount = async (): Promise<ApprovalPendingCountResponse> => {
    const response = await fetchWithAuth("/api/approvals/me/pending-count");
    if (!response.ok) {
        const message = await getErrorMessage(response, "결재 대기 건수 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const summarizeApprovalAttachment = async (
    documentId: number,
    fileId: number,
): Promise<SummarizeApprovalAttachmentResponse> => {
    const response = await fetchWithAuth(
        `/api/approvals/${documentId}/attachments/${fileId}/summarize`,
        { method: "POST" },
    );
    if (!response.ok) {
        const message = await getErrorMessage(response, "첨부파일 요약 생성에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};
