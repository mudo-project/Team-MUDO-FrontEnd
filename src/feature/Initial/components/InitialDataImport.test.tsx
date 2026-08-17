import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    changeOnboardingDataImportDraftAction,
    confirmOnboardingDataImportAction,
    createOnboardingDataImportAction,
    getOnboardingDataImportDraftAction,
    getOnboardingDataImportResultAction,
} from "../actions";
import InitialDataImport from "./InitialDataImport";
import { toast } from "sonner";

jest.mock("../actions", () => ({
    changeOnboardingDataImportDraftAction: jest.fn(),
    confirmOnboardingDataImportAction: jest.fn(),
    createOnboardingDataImportAction: jest.fn(),
    getOnboardingDataImportDraftAction: jest.fn(),
    getOnboardingDataImportResultAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
    },
}));

jest.mock("./InitialFileUploadForm", () => function MockInitialFileUploadForm(
    { error, isPending, onSubmit }: { error: string; isPending: boolean; onSubmit: (formData: FormData) => void },
) {
    return (
        <div data-testid="mock-upload-form">
            <button disabled={isPending} onClick={() => onSubmit(new FormData())} type="button">
                업로드
            </button>
            {error && <p role="alert">{error}</p>}
        </div>
    );
});

jest.mock("./StudentDraftSection", () => function MockStudentDraftSection(
    { rows, onToggle }: { rows: { rowId: string }[]; onToggle: (rowId: string) => void },
) {
    return (
        <div data-testid="mock-student-draft-section">
            {rows.map((row) => (
                <button key={row.rowId} onClick={() => onToggle(row.rowId)} type="button">
                    토글-{row.rowId}
                </button>
            ))}
        </div>
    );
});

jest.mock("./LectureDraftSection", () => function MockLectureDraftSection() {
    return <div data-testid="mock-lecture-draft-section" />;
});

jest.mock("./EnrollmentDraftSection", () => function MockEnrollmentDraftSection() {
    return <div data-testid="mock-enrollment-draft-section" />;
});

jest.mock("./InitialImportResult", () => function MockInitialImportResult(
    { result }: { result: { createdStudents: number } },
) {
    return <div data-testid="mock-import-result">생성 학생 {result.createdStudents}</div>;
});

const mockedCreateOnboardingDataImportAction = createOnboardingDataImportAction as jest.MockedFunction<
    typeof createOnboardingDataImportAction
>;
const mockedGetOnboardingDataImportDraftAction = getOnboardingDataImportDraftAction as jest.MockedFunction<
    typeof getOnboardingDataImportDraftAction
>;
const mockedChangeOnboardingDataImportDraftAction = changeOnboardingDataImportDraftAction as jest.MockedFunction<
    typeof changeOnboardingDataImportDraftAction
>;
const mockedConfirmOnboardingDataImportAction = confirmOnboardingDataImportAction as jest.MockedFunction<
    typeof confirmOnboardingDataImportAction
>;
const mockedGetOnboardingDataImportResultAction = getOnboardingDataImportResultAction as jest.MockedFunction<
    typeof getOnboardingDataImportResultAction
>;

const buildStudentRow = (
    overrides: Partial<{ selected: boolean; status: "READY" | "NEEDS_REVIEW" | "DUPLICATE_SUSPECTED" | "ERROR" }> = {},
) => ({
    rowId: "s1",
    selected: false,
    status: "READY" as const,
    messages: [] as string[],
    name: "홍길동",
    grade: "MIDDLE_1",
    school: "서울중학교",
    phone: "010-1234-5678",
    parentPhone: "010-2345-6789",
    note: "",
    ...overrides,
});

describe("InitialDataImport", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("초기 화면에는 파일 업로드 폼을 표시한다", () => {
        render(<InitialDataImport />);

        expect(screen.getByTestId("mock-upload-form")).toBeInTheDocument();
        expect(screen.queryByTestId("mock-student-draft-section")).not.toBeInTheDocument();
    });

    it("파일 업로드와 초안 조회가 성공하면 초안 화면으로 전환된다", async () => {
        mockedCreateOnboardingDataImportAction.mockResolvedValue({
            success: true,
            message: "분석했습니다.",
            data: { importId: 1 },
        });
        mockedGetOnboardingDataImportDraftAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { students: [], lectures: [], enrollments: [] },
        });

        render(<InitialDataImport />);

        fireEvent.click(screen.getByRole("button", { name: "업로드" }));

        expect(await screen.findByTestId("mock-student-draft-section")).toBeInTheDocument();
        expect(toast.success).toHaveBeenCalledWith("분석했습니다.");
    });

    it("파일 업로드가 실패하면 에러 메시지를 표시하고 업로드 화면을 유지한다", async () => {
        mockedCreateOnboardingDataImportAction.mockResolvedValue({
            success: false,
            message: "지원하지 않는 파일 형식입니다.",
        });

        render(<InitialDataImport />);

        fireEvent.click(screen.getByRole("button", { name: "업로드" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("지원하지 않는 파일 형식입니다.");
        expect(mockedGetOnboardingDataImportDraftAction).not.toHaveBeenCalled();
        expect(screen.queryByTestId("mock-student-draft-section")).not.toBeInTheDocument();
    });

    it("초안 조회가 실패하면 에러 메시지를 표시하고 업로드 화면을 유지한다", async () => {
        mockedCreateOnboardingDataImportAction.mockResolvedValue({
            success: true,
            message: "분석했습니다.",
            data: { importId: 1 },
        });
        mockedGetOnboardingDataImportDraftAction.mockResolvedValue({
            success: false,
            message: "가져오기 초안 조회에 실패했습니다.",
        });

        render(<InitialDataImport />);

        fireEvent.click(screen.getByRole("button", { name: "업로드" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("가져오기 초안 조회에 실패했습니다.");
        expect(screen.queryByTestId("mock-student-draft-section")).not.toBeInTheDocument();
    });

    it("선택한 행 중 등록 가능 상태가 아닌 항목이 있으면 확정을 막고 에러 메시지를 표시한다", async () => {
        mockedCreateOnboardingDataImportAction.mockResolvedValue({
            success: true,
            message: "분석했습니다.",
            data: { importId: 1 },
        });
        mockedGetOnboardingDataImportDraftAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: {
                students: [buildStudentRow({ selected: true, status: "NEEDS_REVIEW" })],
                lectures: [],
                enrollments: [],
            },
        });

        render(<InitialDataImport />);
        fireEvent.click(screen.getByRole("button", { name: "업로드" }));
        await screen.findByTestId("mock-student-draft-section");

        fireEvent.click(screen.getByRole("button", { name: "선택 항목 확정" }));

        expect(
            await screen.findByText("등록 가능한 상태가 아닌 선택 행을 제외해주세요."),
        ).toBeInTheDocument();
        expect(mockedChangeOnboardingDataImportDraftAction).not.toHaveBeenCalled();
        expect(mockedConfirmOnboardingDataImportAction).not.toHaveBeenCalled();
    });

    it("모든 선택 항목이 등록 가능하면 초안을 저장하고 확정한 뒤 결과 화면을 표시한다", async () => {
        mockedCreateOnboardingDataImportAction.mockResolvedValue({
            success: true,
            message: "분석했습니다.",
            data: { importId: 1 },
        });
        const draftData = {
            students: [buildStudentRow({ selected: true, status: "READY" })],
            lectures: [],
            enrollments: [],
        };
        mockedGetOnboardingDataImportDraftAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: draftData,
        });
        mockedChangeOnboardingDataImportDraftAction.mockResolvedValue({
            success: true,
            message: "가져오기 초안을 저장했습니다.",
        });
        mockedConfirmOnboardingDataImportAction.mockResolvedValue({
            success: true,
            message: "확정했습니다.",
            data: { createdStudents: 1, createdLectures: 0, createdEnrollments: 0, skippedRows: 0, failedRows: 0 },
        });
        mockedGetOnboardingDataImportResultAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { createdStudents: 1, createdLectures: 0, createdEnrollments: 0, skippedRows: 0, failedRows: 0 },
        });

        render(<InitialDataImport />);
        fireEvent.click(screen.getByRole("button", { name: "업로드" }));
        await screen.findByTestId("mock-student-draft-section");

        fireEvent.click(screen.getByRole("button", { name: "선택 항목 확정" }));

        await waitFor(() => {
            expect(mockedChangeOnboardingDataImportDraftAction).toHaveBeenCalledWith(1, draftData);
        });
        await waitFor(() => {
            expect(mockedConfirmOnboardingDataImportAction).toHaveBeenCalledWith(1);
        });
        expect(await screen.findByTestId("mock-import-result")).toHaveTextContent("생성 학생 1");
        expect(toast.success).toHaveBeenCalledWith("확정했습니다.");
    });

    it("확정에 실패하면 에러 메시지를 표시하고 결과 화면으로 전환하지 않는다", async () => {
        mockedCreateOnboardingDataImportAction.mockResolvedValue({
            success: true,
            message: "분석했습니다.",
            data: { importId: 1 },
        });
        mockedGetOnboardingDataImportDraftAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: {
                students: [buildStudentRow({ selected: true, status: "READY" })],
                lectures: [],
                enrollments: [],
            },
        });
        mockedChangeOnboardingDataImportDraftAction.mockResolvedValue({
            success: true,
            message: "가져오기 초안을 저장했습니다.",
        });
        mockedConfirmOnboardingDataImportAction.mockResolvedValue({
            success: false,
            message: "가져오기 확정에 실패했습니다.",
        });

        render(<InitialDataImport />);
        fireEvent.click(screen.getByRole("button", { name: "업로드" }));
        await screen.findByTestId("mock-student-draft-section");

        fireEvent.click(screen.getByRole("button", { name: "선택 항목 확정" }));

        expect(await screen.findByText("가져오기 확정에 실패했습니다.")).toBeInTheDocument();
        expect(screen.queryByTestId("mock-import-result")).not.toBeInTheDocument();
        expect(mockedGetOnboardingDataImportResultAction).not.toHaveBeenCalled();
    });
});
