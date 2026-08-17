import { fetchWithAuth } from "../lib/fetch";
import {
    changeOnboardingDataImportDraft,
    confirmOnboardingDataImport,
    createOnboardingDataImport,
    getOnboardingDataImportDraft,
    getOnboardingDataImportResult,
} from "./initial.service";

jest.mock("../lib/fetch", () => ({
    fetchWithAuth: jest.fn(),
}));

const mockedFetchWithAuth = fetchWithAuth as jest.Mock;

const okJsonResponse = (data: unknown) => ({
    ok: true,
    json: () => Promise.resolve(data),
});

const failedJsonResponse = (message: string) => ({
    ok: false,
    headers: { get: () => "application/json" },
    json: () => Promise.resolve({ message }),
});

describe("initial.service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createOnboardingDataImport", () => {
        it("응답이 정상이면 생성된 가져오기 작업 정보를 반환한다", async () => {
            const mockData = { status: 200, code: "OK", message: "분석했습니다.", data: { importId: 1 } };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));
            const formData = new FormData();

            const result = await createOnboardingDataImport(formData);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/data-imports/onboarding/files", {
                method: "POST",
                body: formData,
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("가져오기 작업 생성에 실패했습니다."));

            await expect(createOnboardingDataImport(new FormData())).rejects.toThrow(
                "가져오기 작업 생성에 실패했습니다.",
            );
        });
    });

    describe("getOnboardingDataImportDraft", () => {
        it("응답이 정상이면 초안 정보를 반환한다", async () => {
            const mockData = {
                status: 200,
                code: "OK",
                message: "조회했습니다.",
                data: { students: [], lectures: [], enrollments: [] },
            };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getOnboardingDataImportDraft(1);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/data-imports/onboarding/1/draft");
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("가져오기 초안 조회에 실패했습니다."));

            await expect(getOnboardingDataImportDraft(1)).rejects.toThrow(
                "가져오기 초안 조회에 실패했습니다.",
            );
        });
    });

    describe("changeOnboardingDataImportDraft", () => {
        it("응답이 정상이면 아무 값도 반환하지 않는다", async () => {
            mockedFetchWithAuth.mockResolvedValue({ ok: true });
            const payload = { students: [], lectures: [], enrollments: [] };

            await expect(changeOnboardingDataImportDraft(1, payload)).resolves.toBeUndefined();
            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/data-imports/onboarding/1/draft", {
                method: "PATCH",
                body: JSON.stringify(payload),
            });
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("가져오기 초안 수정에 실패했습니다."));

            await expect(
                changeOnboardingDataImportDraft(1, { students: [], lectures: [], enrollments: [] }),
            ).rejects.toThrow("가져오기 초안 수정에 실패했습니다.");
        });
    });

    describe("confirmOnboardingDataImport", () => {
        it("응답이 정상이면 확정 결과를 반환한다", async () => {
            const mockData = {
                status: 200,
                code: "OK",
                message: "확정했습니다.",
                data: { createdStudents: 1, createdLectures: 1, createdEnrollments: 1, skippedRows: 0, failedRows: 0 },
            };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await confirmOnboardingDataImport(1);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/data-imports/onboarding/1/confirm", {
                method: "POST",
            });
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("가져오기 확정에 실패했습니다."));

            await expect(confirmOnboardingDataImport(1)).rejects.toThrow("가져오기 확정에 실패했습니다.");
        });
    });

    describe("getOnboardingDataImportResult", () => {
        it("응답이 정상이면 결과 정보를 반환한다", async () => {
            const mockData = {
                status: 200,
                code: "OK",
                message: "조회했습니다.",
                data: { createdStudents: 1, createdLectures: 1, createdEnrollments: 1, skippedRows: 0, failedRows: 0 },
            };
            mockedFetchWithAuth.mockResolvedValue(okJsonResponse(mockData));

            const result = await getOnboardingDataImportResult(1);

            expect(mockedFetchWithAuth).toHaveBeenCalledWith("/api/data-imports/onboarding/1/result");
            expect(result).toEqual(mockData);
        });

        it("응답이 실패하면 에러 메시지와 함께 예외를 던진다", async () => {
            mockedFetchWithAuth.mockResolvedValue(failedJsonResponse("가져오기 결과 조회에 실패했습니다."));

            await expect(getOnboardingDataImportResult(1)).rejects.toThrow(
                "가져오기 결과 조회에 실패했습니다.",
            );
        });
    });
});
