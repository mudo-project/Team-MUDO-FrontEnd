import { fetchWithAuth } from "@/lib/fetch";
import { getErrorMessage } from "@/lib/stateError";
import {
    DataImportConfirmResponse,
    DataImportCreateResponse,
    DataImportDraftData,
    DataImportDraftResponse,
    DataImportResultResponse,
} from "@/feature/Initial/type";

const getImportPath = (importId: number, suffix: string) =>
    `/api/data-imports/onboarding/${importId}/${suffix}`;

export const createOnboardingDataImport = async (
    formData: FormData,
): Promise<DataImportCreateResponse> => {
    const response = await fetchWithAuth("/api/data-imports/onboarding/files", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "가져오기 작업 생성에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getOnboardingDataImportDraft = async (
    importId: number,
): Promise<DataImportDraftResponse> => {
    const response = await fetchWithAuth(getImportPath(importId, "draft"));

    if (!response.ok) {
        const message = await getErrorMessage(response, "가져오기 초안 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const changeOnboardingDataImportDraft = async (
    importId: number,
    payload: DataImportDraftData,
): Promise<void> => {
    const response = await fetchWithAuth(getImportPath(importId, "draft"), {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "가져오기 초안 수정에 실패했습니다.");
        throw new Error(message);
    }
};

export const confirmOnboardingDataImport = async (
    importId: number,
): Promise<DataImportConfirmResponse> => {
    const response = await fetchWithAuth(getImportPath(importId, "confirm"), {
        method: "POST",
    });

    if (!response.ok) {
        const message = await getErrorMessage(response, "가져오기 확정에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};

export const getOnboardingDataImportResult = async (
    importId: number,
): Promise<DataImportResultResponse> => {
    const response = await fetchWithAuth(getImportPath(importId, "result"));

    if (!response.ok) {
        const message = await getErrorMessage(response, "가져오기 결과 조회에 실패했습니다.");
        throw new Error(message);
    }

    return response.json();
};
