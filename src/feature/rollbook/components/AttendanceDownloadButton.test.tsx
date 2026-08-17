import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { exportLectureAttendanceAction } from "../actions";
import AttendanceDownloadButton from "./AttendanceDownloadButton";

jest.mock("../actions", () => ({
    exportLectureAttendanceAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}));

const mockedExportLectureAttendanceAction =
    exportLectureAttendanceAction as jest.MockedFunction<typeof exportLectureAttendanceAction>;

describe("AttendanceDownloadButton", () => {
    beforeEach(() => {
        Object.defineProperty(URL, "createObjectURL", {
            configurable: true,
            value: jest.fn(() => "blob:test"),
        });
        Object.defineProperty(URL, "revokeObjectURL", {
            configurable: true,
            value: jest.fn(),
        });
        jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("다운로드에 성공하면 파일을 내려받고 성공 메시지를 노출한다", async () => {
        mockedExportLectureAttendanceAction.mockResolvedValue({
            success: true,
            message: "출결부 엑셀 다운로드에 성공했습니다.",
            data: {
                file: "dGVzdA==",
                fileName: "attendance_7_2026-08-16.xlsx",
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });

        render(<AttendanceDownloadButton date="2026-08-16" lectureId={7} />);

        fireEvent.click(screen.getByRole("button", { name: "출결부 다운로드" }));

        await waitFor(() => {
            expect(mockedExportLectureAttendanceAction).toHaveBeenCalledWith(7, "2026-08-16");
        });
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("출결부 엑셀 다운로드에 성공했습니다.");
        });
        expect(screen.getByRole("button", { name: "출결부 다운로드" })).toBeEnabled();
    });

    it("다운로드에 실패하면 실패 메시지를 노출하고 버튼을 다시 활성화한다", async () => {
        mockedExportLectureAttendanceAction.mockResolvedValue({
            success: false,
            message: "출결부 엑셀 다운로드에 실패했습니다.",
        });

        render(<AttendanceDownloadButton date="2026-08-16" lectureId={7} />);

        fireEvent.click(screen.getByRole("button", { name: "출결부 다운로드" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("출결부 엑셀 다운로드에 실패했습니다.");
        });
        expect(screen.getByRole("button", { name: "출결부 다운로드" })).toBeEnabled();
    });

    it("다운로드가 진행되는 동안 버튼이 비활성화된다", async () => {
        let resolveAction: (value: Awaited<ReturnType<typeof exportLectureAttendanceAction>>) => void =
            () => {};
        mockedExportLectureAttendanceAction.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveAction = resolve;
                }),
        );

        render(<AttendanceDownloadButton date="2026-08-16" lectureId={7} />);

        fireEvent.click(screen.getByRole("button", { name: "출결부 다운로드" }));

        expect(await screen.findByText("다운로드 중")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "출결부 다운로드" })).toBeDisabled();

        resolveAction({ success: false, message: "실패" });

        await waitFor(() => {
            expect(screen.getByText("다운로드")).toBeInTheDocument();
        });
    });
});
