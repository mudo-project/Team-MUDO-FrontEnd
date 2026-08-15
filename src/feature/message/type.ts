export type MessageTemplateStatus = "PRESENT" | "ABSENT" | "LATE" | "ONLINE" | "ETC";

export interface MessageApiResponse<T> {
    status: number;
    code: string;
    message: string;
    data: T;
}

export interface MessageTemplateData {
    id: number;
    name: string;
    status: MessageTemplateStatus;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export type MessageTemplateListResponse = MessageApiResponse<MessageTemplateData[]>;

export interface CreateMessageTemplateRequest {
    name: string;
    status: MessageTemplateStatus;
    content: string;
}

export interface CreateMessageTemplateData {
    templateId: number;
}

export type CreateMessageTemplateResponse = MessageApiResponse<CreateMessageTemplateData>;

export interface ChangeMessageTemplateRequest {
    name: string;
    content: string;
}
