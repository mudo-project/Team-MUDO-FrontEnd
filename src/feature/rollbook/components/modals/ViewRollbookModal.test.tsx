import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    changeLectureAttendanceAction,
    exportLectureAttendanceAction,
    getLectureAttendanceAction,
} from "../../actions";
import ViewRollbookModal from "./ViewRollbookModal";
import { toast } from "sonner";

jest.mock("../../actions", () => ({
    changeLectureAttendanceAction: jest.fn(),
    exportLectureAttendanceAction: jest.fn(),
    getLectureAttendanceAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: { success: jest.fn() },
}));

const mockedGetLectureAttendanceAction =
    getLectureAttendanceAction as jest.MockedFunction<
        typeof getLectureAttendanceAction
    >;
const mockedChangeLectureAttendanceAction =
    changeLectureAttendanceAction as jest.MockedFunction<
        typeof changeLectureAttendanceAction
    >;
const mockedExportLectureAttendanceAction =
    exportLectureAttendanceAction as jest.MockedFunction<
        typeof exportLectureAttendanceAction
    >;

const attendanceResult = {
    success: true as const,
    message: "조회했습니다.",
    data: {
        lectureId: 7,
        lectureName: "API 수학 정규반",
        date: "2026-08-15",
        entries: [
            {
                studentId: 1,
                studentName: "김민수",
                grade: "HIGH_1" as const,
                parentPhone: "010-1111-2222",
                status: "PRESENT" as const,
                note: null,
            },
            {
                studentId: 2,
                studentName: "이지은",
                grade: "HIGH_1" as const,
                parentPhone: "010-3333-4444",
                status: "ABSENT" as const,
                note: "병원",
            },
            {
                studentId: 3,
                studentName: "박준호",
                grade: "HIGH_1" as const,
                parentPhone: "010-5555-6666",
                status: null,
                note: null,
            },
        ],
        summary: {
            total: 3,
            present: 1,
            absent: 1,
            late: 0,
            online: 0,
            etc: 0,
        },
    },
};

const renderModal = () =>
    render(
        <ViewRollbookModal
            closeModal={jest.fn()}
            {...({ lectureId: 7 } as { lectureId: number })}
        />,
    );

describe("ViewRollbookModal", () => {
    beforeEach(() => {
        mockedGetLectureAttendanceAction.mockResolvedValue(attendanceResult);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("오늘 날짜의 출결을 조회해 화면에 표시한다", async () => {
        renderModal();

        expect(await screen.findByText("API 수학 정규반")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2026-08-15")).toBeInTheDocument();
        expect(screen.getByText("010-1111-2222")).toBeInTheDocument();
        expect(mockedGetLectureAttendanceAction).toHaveBeenCalledWith(
            7,
            "2026-08-15",
        );
    });

    it("날짜를 변경하면 해당 날짜 출결을 다시 조회한다", async () => {
        renderModal();
        const dateInput = await screen.findByLabelText("출결 날짜");

        fireEvent.change(dateInput, { target: { value: "2026-08-16" } });

        await waitFor(() => {
            expect(mockedGetLectureAttendanceAction).toHaveBeenCalledWith(
                7,
                "2026-08-16",
            );
        });
    });

    it("다운로드 버튼을 누르면 현재 강의와 날짜로 출결부를 내보낸다", async () => {
        mockedExportLectureAttendanceAction.mockResolvedValue({
            success: true,
            message: "출결부 엑셀 다운로드에 성공했습니다.",
            data: {
                file: "dGVzdA==",
                fileName: "attendance_7_2026-08-15.xlsx",
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
        Object.defineProperty(URL, "createObjectURL", {
            configurable: true,
            value: jest.fn(() => "blob:test"),
        });
        Object.defineProperty(URL, "revokeObjectURL", {
            configurable: true,
            value: jest.fn(),
        });
        jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation();

        renderModal();
        await screen.findByText("API 수학 정규반");
        fireEvent.click(screen.getByRole("button", { name: "출결부 다운로드" }));

        await waitFor(() => {
            expect(mockedExportLectureAttendanceAction).toHaveBeenCalledWith(
                7,
                "2026-08-15",
            );
        });
    });

    it("원본과 달라진 학생만 저장한다", async () => {
        mockedChangeLectureAttendanceAction.mockResolvedValue({
            success: true,
            message: "출결 저장에 성공했습니다.",
        });
        renderModal();

        fireEvent.change(await screen.findByLabelText("김민수 출결 상태"), {
            target: { value: "LATE" },
        });
        fireEvent.change(screen.getByLabelText("이지은 비고"), {
            target: { value: "독감" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        await waitFor(() => {
            expect(mockedChangeLectureAttendanceAction).toHaveBeenCalledWith(
                7,
                "2026-08-15",
                {
                    entries: [
                        { studentId: 1, status: "LATE", note: null },
                        { studentId: 2, status: "ABSENT", note: "독감" },
                    ],
                },
            );
        });
        expect(toast.success).toHaveBeenCalledWith("출결 저장에 성공했습니다.");
        await waitFor(() => {
            expect(mockedGetLectureAttendanceAction).toHaveBeenCalledTimes(2);
        });
    });

    it("값을 원본으로 되돌리면 저장 대상에서 제외한다", async () => {
        renderModal();
        const statusSelect = await screen.findByLabelText("김민수 출결 상태");

        fireEvent.change(statusSelect, { target: { value: "LATE" } });
        expect(screen.getByRole("button", { name: "저장" })).toBeEnabled();

        fireEvent.change(statusSelect, { target: { value: "PRESENT" } });

        expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
    });

    it("저장 실패 시 오류와 변경 값을 유지한다", async () => {
        mockedChangeLectureAttendanceAction.mockResolvedValue({
            success: false,
            message: "출결 저장에 실패했습니다.",
        });
        renderModal();

        const statusSelect = await screen.findByLabelText("김민수 출결 상태");
        fireEvent.change(statusSelect, { target: { value: "ETC" } });
        fireEvent.change(screen.getByLabelText("김민수 비고"), {
            target: { value: "개인 사유" },
        });
        fireEvent.click(screen.getByRole("button", { name: "저장" }));

        expect(
            await screen.findByText("출결 저장에 실패했습니다."),
        ).toHaveAttribute("role", "alert");
        expect(statusSelect).toHaveValue("ETC");
        expect(screen.getByLabelText("김민수 비고")).toHaveValue("개인 사유");
    });
});
