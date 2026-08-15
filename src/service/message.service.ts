import {
    ChangeMessageTemplateRequest,
    CreateMessageTemplateRequest,
    CreateMessageTemplateResponse,
    MessageTemplateListResponse,
} from "@/feature/message/type";
import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";

export const getMessageTemplateList = async (): Promise<MessageTemplateListResponse> => {
    const response = await fetchWithAuth("/api/rollcall/message-templates");

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "문자 템플릿 목록 조회에 실패했습니다."));
    }

    return response.json();
};

export const createMessageTemplate = async (
    payload: CreateMessageTemplateRequest,
): Promise<CreateMessageTemplateResponse> => {
    const response = await fetchWithAuth("/api/rollcall/message-templates", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "문자 템플릿 생성에 실패했습니다."));
    }

    return response.json();
};

export const changeMessageTemplate = async (
    templateId: number,
    payload: ChangeMessageTemplateRequest,
): Promise<void> => {
    const response = await fetchWithAuth(`/api/rollcall/message-templates/${templateId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "문자 템플릿 수정에 실패했습니다."));
    }
};

export const deleteMessageTemplate = async (templateId: number): Promise<void> => {
    const response = await fetchWithAuth(`/api/rollcall/message-templates/${templateId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "문자 템플릿 삭제에 실패했습니다."));
    }
};
