"use server";

import {
    changeOnboardingDataImportDraft,
    confirmOnboardingDataImport,
    createOnboardingDataImport,
    getOnboardingDataImportDraft,
    getOnboardingDataImportResult,
} from "@/service/initial.service";
import {
    DataImportCreateData,
    DataImportDraftData,
    DataImportResultData,
} from "./type";

export interface InitialActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

const fileNames = ["studentFile", "lectureFile", "enrollmentFile"];
const supportedExtensions = ["csv", "xlsx"];
const getActionErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;
const isValidImportId = (importId: number) => Number.isInteger(importId) && importId > 0;

export const createOnboardingDataImportAction = async (
    formData: FormData,
): Promise<InitialActionResult<DataImportCreateData>> => {
    const files = fileNames
        .map((name) => formData.get(name))
        .filter((value): value is File => value instanceof File && value.size > 0);

    if (files.length === 0) {
        return { success: false, message: "업로드할 파일이 필요합니다." };
    }

    if (files.some((file) => !supportedExtensions.includes(file.name.split(".").pop()?.toLowerCase() ?? ""))) {
        return { success: false, message: "지원하지 않는 파일 형식입니다." };
    }

    try {
        const response = await createOnboardingDataImport(formData);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "가져오기 작업 생성에 실패했습니다."),
        };
    }
};

export const getOnboardingDataImportDraftAction = async (
    importId: number,
): Promise<InitialActionResult<DataImportDraftData>> => {
    if (!isValidImportId(importId)) return { success: false, message: "가져오기 작업 번호가 올바르지 않습니다." };

    try {
        const response = await getOnboardingDataImportDraft(importId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "가져오기 초안 조회에 실패했습니다."),
        };
    }
};

export const changeOnboardingDataImportDraftAction = async (
    importId: number,
    payload: DataImportDraftData,
): Promise<InitialActionResult> => {
    if (!isValidImportId(importId)) return { success: false, message: "가져오기 작업 번호가 올바르지 않습니다." };

    try {
        await changeOnboardingDataImportDraft(importId, payload);
        return { success: true, message: "가져오기 초안을 저장했습니다." };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "가져오기 초안 수정에 실패했습니다."),
        };
    }
};

export const confirmOnboardingDataImportAction = async (
    importId: number,
): Promise<InitialActionResult<DataImportResultData>> => {
    if (!isValidImportId(importId)) return { success: false, message: "가져오기 작업 번호가 올바르지 않습니다." };

    try {
        const response = await confirmOnboardingDataImport(importId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "가져오기 확정에 실패했습니다."),
        };
    }
};

export const getOnboardingDataImportResultAction = async (
    importId: number,
): Promise<InitialActionResult<DataImportResultData>> => {
    if (!isValidImportId(importId)) return { success: false, message: "가져오기 작업 번호가 올바르지 않습니다." };

    try {
        const response = await getOnboardingDataImportResult(importId);
        return { success: true, message: response.message, data: response.data };
    } catch (error) {
        return {
            success: false,
            message: getActionErrorMessage(error, "가져오기 결과 조회에 실패했습니다."),
        };
    }
};
