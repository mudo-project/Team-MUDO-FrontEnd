"use server";

import {
    ChangeMessageTemplateRequest,
    CreateMessageTemplateData,
    CreateMessageTemplateRequest,
    MessageTemplateData,
    MessageTemplateStatus,
} from "@/feature/message/type";
import {
    changeMessageTemplate,
    createMessageTemplate,
    deleteMessageTemplate,
    getMessageTemplateList,
} from "@/service/message.service";

export interface MessageActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const messageTemplateStatuses: MessageTemplateStatus[] = ["PRESENT", "ABSENT", "LATE", "ONLINE", "ETC"];
const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0;
const getActionErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

export const getMessageTemplateListAction = async (): Promise<MessageActionResult<MessageTemplateData[]>> => {
    try {
        const response = await getMessageTemplateList();
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "문자 템플릿 목록 조회에 실패했습니다.") };
    }
};

export const createMessageTemplateAction = async (
    payload: CreateMessageTemplateRequest,
): Promise<MessageActionResult<CreateMessageTemplateData>> => {
    if (!payload.name.trim() || !payload.content.trim()) {
        return { success: false, message: "템플릿 이름과 문자 내용을 입력해주세요." };
    }
    if (!messageTemplateStatuses.includes(payload.status)) {
        return { success: false, message: "출결 상태가 올바르지 않습니다." };
    }

    try {
        const response = await createMessageTemplate(payload);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "문자 템플릿 생성에 실패했습니다.") };
    }
};

export const changeMessageTemplateAction = async (
    templateId: number,
    payload: ChangeMessageTemplateRequest,
): Promise<MessageActionResult> => {
    if (!isPositiveInteger(templateId)) return { success: false, message: "문자 템플릿 번호가 올바르지 않습니다." };
    if (!payload.name.trim() || !payload.content.trim()) {
        return { success: false, message: "템플릿 이름과 문자 내용을 입력해주세요." };
    }

    try {
        await changeMessageTemplate(templateId, payload);
        return { success: true, message: "문자 템플릿 수정에 성공했습니다." };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "문자 템플릿 수정에 실패했습니다.") };
    }
};

export const deleteMessageTemplateAction = async (templateId: number): Promise<MessageActionResult> => {
    if (!isPositiveInteger(templateId)) return { success: false, message: "문자 템플릿 번호가 올바르지 않습니다." };

    try {
        await deleteMessageTemplate(templateId);
        return { success: true, message: "문자 템플릿 삭제에 성공했습니다." };
    } catch (error) {
        return { success: false, message: getActionErrorMessage(error, "문자 템플릿 삭제에 실패했습니다.") };
    }
};
