import {
    changeOnboardingDataImportDraft,
    confirmOnboardingDataImport,
    createOnboardingDataImport,
    getOnboardingDataImportDraft,
    getOnboardingDataImportResult,
} from "../../service/initial.service";
import {
    changeOnboardingDataImportDraftAction,
    confirmOnboardingDataImportAction,
    createOnboardingDataImportAction,
    getOnboardingDataImportDraftAction,
    getOnboardingDataImportResultAction,
} from "./actions";

jest.mock("../../service/initial.service", () => ({
    changeOnboardingDataImportDraft: jest.fn(),
    confirmOnboardingDataImport: jest.fn(),
    createOnboardingDataImport: jest.fn(),
    getOnboardingDataImportDraft: jest.fn(),
    getOnboardingDataImportResult: jest.fn(),
}));

const mockedCreateOnboardingDataImport = createOnboardingDataImport as jest.MockedFunction<
    typeof createOnboardingDataImport
>;
const mockedGetOnboardingDataImportDraft = getOnboardingDataImportDraft as jest.MockedFunction<
    typeof getOnboardingDataImportDraft
>;
const mockedChangeOnboardingDataImportDraft = changeOnboardingDataImportDraft as jest.MockedFunction<
    typeof changeOnboardingDataImportDraft
>;
const mockedConfirmOnboardingDataImport = confirmOnboardingDataImport as jest.MockedFunction<
    typeof confirmOnboardingDataImport
>;
const mockedGetOnboardingDataImportResult = getOnboardingDataImportResult as jest.MockedFunction<
    typeof getOnboardingDataImportResult
>;

const buildFormData = (files: Record<string, File | undefined>) => {
    const formData = new FormData();
    Object.entries(files).forEach(([name, file]) => {
        if (file) formData.set(name, file);
    });
    return formData;
};

describe("createOnboardingDataImportAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("업로드할 파일이 없으면 실패 결과를 반환한다", async () => {
        const result = await createOnboardingDataImportAction(buildFormData({}));

        expect(result).toEqual({ success: false, message: "업로드할 파일이 필요합니다." });
        expect(mockedCreateOnboardingDataImport).not.toHaveBeenCalled();
    });

    it("빈 파일만 있으면 실패 결과를 반환한다", async () => {
        const emptyFile = new File([], "students.csv");
        const result = await createOnboardingDataImportAction(
            buildFormData({ studentFile: emptyFile }),
        );

        expect(result).toEqual({ success: false, message: "업로드할 파일이 필요합니다." });
    });

    it("지원하지 않는 파일 형식이면 실패 결과를 반환한다", async () => {
        const file = new File(["content"], "students.txt");
        const result = await createOnboardingDataImportAction(
            buildFormData({ studentFile: file }),
        );

        expect(result).toEqual({ success: false, message: "지원하지 않는 파일 형식입니다." });
        expect(mockedCreateOnboardingDataImport).not.toHaveBeenCalled();
    });

    it("csv, xlsx 파일이 있으면 service를 호출하고 성공 결과를 반환한다", async () => {
        mockedCreateOnboardingDataImport.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "분석했습니다.",
            data: { importId: 1 },
        });
        const formData = buildFormData({
            studentFile: new File(["content"], "students.csv"),
            lectureFile: new File(["content"], "lectures.xlsx"),
        });

        const result = await createOnboardingDataImportAction(formData);

        expect(mockedCreateOnboardingDataImport).toHaveBeenCalledWith(formData);
        expect(result).toEqual({
            success: true,
            message: "분석했습니다.",
            data: { importId: 1 },
        });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedCreateOnboardingDataImport.mockRejectedValue(new Error("가져오기 작업 생성에 실패했습니다."));
        const formData = buildFormData({ studentFile: new File(["content"], "students.csv") });

        const result = await createOnboardingDataImportAction(formData);

        expect(result).toEqual({ success: false, message: "가져오기 작업 생성에 실패했습니다." });
    });
});

describe("getOnboardingDataImportDraftAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("importId가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await getOnboardingDataImportDraftAction(0);

        expect(result).toEqual({ success: false, message: "가져오기 작업 번호가 올바르지 않습니다." });
        expect(mockedGetOnboardingDataImportDraft).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const draftData = { students: [], lectures: [], enrollments: [] };
        mockedGetOnboardingDataImportDraft.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: draftData,
        });

        const result = await getOnboardingDataImportDraftAction(1);

        expect(mockedGetOnboardingDataImportDraft).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "조회했습니다.", data: draftData });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetOnboardingDataImportDraft.mockRejectedValue(new Error("가져오기 초안 조회에 실패했습니다."));

        const result = await getOnboardingDataImportDraftAction(1);

        expect(result).toEqual({ success: false, message: "가져오기 초안 조회에 실패했습니다." });
    });
});

describe("changeOnboardingDataImportDraftAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const payload = { students: [], lectures: [], enrollments: [] };

    it("importId가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await changeOnboardingDataImportDraftAction(-1, payload);

        expect(result).toEqual({ success: false, message: "가져오기 작업 번호가 올바르지 않습니다." });
        expect(mockedChangeOnboardingDataImportDraft).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        mockedChangeOnboardingDataImportDraft.mockResolvedValue(undefined);

        const result = await changeOnboardingDataImportDraftAction(1, payload);

        expect(mockedChangeOnboardingDataImportDraft).toHaveBeenCalledWith(1, payload);
        expect(result).toEqual({ success: true, message: "가져오기 초안을 저장했습니다." });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedChangeOnboardingDataImportDraft.mockRejectedValue(new Error("가져오기 초안 수정에 실패했습니다."));

        const result = await changeOnboardingDataImportDraftAction(1, payload);

        expect(result).toEqual({ success: false, message: "가져오기 초안 수정에 실패했습니다." });
    });
});

describe("confirmOnboardingDataImportAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("importId가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await confirmOnboardingDataImportAction(0);

        expect(result).toEqual({ success: false, message: "가져오기 작업 번호가 올바르지 않습니다." });
        expect(mockedConfirmOnboardingDataImport).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const resultData = { createdStudents: 1, createdLectures: 1, createdEnrollments: 1, skippedRows: 0, failedRows: 0 };
        mockedConfirmOnboardingDataImport.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "확정했습니다.",
            data: resultData,
        });

        const result = await confirmOnboardingDataImportAction(1);

        expect(mockedConfirmOnboardingDataImport).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "확정했습니다.", data: resultData });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedConfirmOnboardingDataImport.mockRejectedValue(new Error("가져오기 확정에 실패했습니다."));

        const result = await confirmOnboardingDataImportAction(1);

        expect(result).toEqual({ success: false, message: "가져오기 확정에 실패했습니다." });
    });
});

describe("getOnboardingDataImportResultAction", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("importId가 양의 정수가 아니면 실패 결과를 반환한다", async () => {
        const result = await getOnboardingDataImportResultAction(0);

        expect(result).toEqual({ success: false, message: "가져오기 작업 번호가 올바르지 않습니다." });
        expect(mockedGetOnboardingDataImportResult).not.toHaveBeenCalled();
    });

    it("service 호출이 성공하면 성공 결과를 반환한다", async () => {
        const resultData = { createdStudents: 2, createdLectures: 1, createdEnrollments: 2, skippedRows: 1, failedRows: 0 };
        mockedGetOnboardingDataImportResult.mockResolvedValue({
            status: 200,
            code: "OK",
            message: "조회했습니다.",
            data: resultData,
        });

        const result = await getOnboardingDataImportResultAction(1);

        expect(mockedGetOnboardingDataImportResult).toHaveBeenCalledWith(1);
        expect(result).toEqual({ success: true, message: "조회했습니다.", data: resultData });
    });

    it("service 호출이 실패하면 에러 메시지를 담아 실패 결과를 반환한다", async () => {
        mockedGetOnboardingDataImportResult.mockRejectedValue(new Error("가져오기 결과 조회에 실패했습니다."));

        const result = await getOnboardingDataImportResultAction(1);

        expect(result).toEqual({ success: false, message: "가져오기 결과 조회에 실패했습니다." });
    });
});
