export interface ApprovalApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}


export interface ApprovalPageData<T> {
    content: T[];
    page: number;
    size: number;
    hasNext: boolean;
}

export type ApprovalDocumentStatus =
    | "IN_PROGRESS"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";

export type ApprovalLineStatus =
    | "WAITING"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

export type ApprovalContentType = "TEXT" | "FILE";
export type ApprovalDecision = "APPROVE" | "REJECT";
export type ApprovalSummaryStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface ApprovalTemplateLineData {
    stepOrder: number;
    approverId: number;
    approverName: string;
}

export interface ApprovalTemplateListData {
    id: number;
    name: string;
    createdAt: string;
    lines: ApprovalTemplateLineData[];
}

export interface ApprovalTemplateDetailData extends ApprovalTemplateListData {
    creatorId: number;
}

export interface ApprovalTemplateRequest {
    name: string;
    approverIds: number[];
}

export interface CreateApprovalTemplateData {
    templateId: number;
}

export type ApprovalTemplateListResponse = ApprovalApiResponse<ApprovalPageData<ApprovalTemplateListData>>;

export type ApprovalTemplateDetailResponse = ApprovalApiResponse<ApprovalTemplateDetailData>;

export type CreateApprovalTemplateResponse = ApprovalApiResponse<CreateApprovalTemplateData>;

export interface CreateApprovalRequest {
    templateId: number;
    title: string;
    contentType: ApprovalContentType;
    text?: string;
    fileIds?: number[];
    approverIds?: number[];
    leaveStartDate?: string;
    leaveEndDate?: string;
}

export interface CreateApprovalData {
    documentId: number;
}

export type CreateApprovalResponse = ApprovalApiResponse<CreateApprovalData>;

export type ResubmitApprovalResponse = ApprovalApiResponse<CreateApprovalData>;

export interface ApprovalListData {
    id: number;
    title: string;
    templateName: string;
    creatorName: string;
    status: ApprovalDocumentStatus;
    currentApproverStepOrder: number | null;
    currentApproverName: string | null;
    createdAt: string;
}

export interface ReceivedApprovalListData extends ApprovalListData {
    myStepOrder: number;
    myLineStatus: ApprovalLineStatus;
}

export type ApprovalListResponse = ApprovalApiResponse<ApprovalPageData<ApprovalListData>>;

export type ReceivedApprovalListResponse = ApprovalApiResponse<ApprovalPageData<ReceivedApprovalListData>>;

export interface ApprovalAttachmentData {
    fileId: number;
    aiSummary: string | null;
    summaryStatus: ApprovalSummaryStatus;
    summarizedAt: string | null;
}

export interface ApprovalLineData {
    lineId: number;
    stepOrder: number;
    approverId: number;
    approverName: string;
    status: ApprovalLineStatus;
    comment: string | null;
    decidedAt: string | null;
}

export interface ApprovalDetailData {
    id: number;
    templateId: number;
    templateName: string;
    title: string;
    contentType: ApprovalContentType;
    text: string | null;
    attachments: ApprovalAttachmentData[];
    creatorId: number;
    creatorName: string;
    status: ApprovalDocumentStatus;
    createdAt: string;
    lines: ApprovalLineData[];
}

export type ApprovalDetailResponse = ApprovalApiResponse<ApprovalDetailData>;

export interface ChangeApprovalLinesRequest {
    approverIds: number[];
}

export interface DecideApprovalRequest {
    decision: ApprovalDecision;
    comment?: string;
}

export interface ApprovalPendingCountData {
    count: number;
}

export type ApprovalPendingCountResponse = ApprovalApiResponse<ApprovalPendingCountData>;

export type SummarizeApprovalAttachmentResponse = ApprovalApiResponse<ApprovalAttachmentData>;

export interface ApprovalAttachmentDownloadUrlData {
    downloadUrl: string;
}

export type ApprovalAttachmentDownloadUrlResponse =
    ApprovalApiResponse<ApprovalAttachmentDownloadUrlData>;
