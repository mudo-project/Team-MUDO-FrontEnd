import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
    getLectureClassroomsAction,
    getLectureListAction,
    getLectureSubjectsAction,
    getLectureTeachersAction,
    getLectureTermsAction,
} from "../../../lecture/actions";
import { createStudentEnrollmentAction } from "../../actions";
import AddStudentLectureModal from "./AddStudentLectureModal";
import { toast } from "sonner";

jest.mock("../../actions", () => ({
    createStudentEnrollmentAction: jest.fn(),
}));

jest.mock("../../../lecture/actions", () => ({
    getLectureClassroomsAction: jest.fn(),
    getLectureListAction: jest.fn(),
    getLectureSubjectsAction: jest.fn(),
    getLectureTeachersAction: jest.fn(),
    getLectureTermsAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
    },
}));

const mockedCreateStudentEnrollmentAction = createStudentEnrollmentAction as jest.MockedFunction<
    typeof createStudentEnrollmentAction
>;
const mockedGetLectureListAction = getLectureListAction as jest.MockedFunction<
    typeof getLectureListAction
>;
const mockedGetLectureTeachersAction = getLectureTeachersAction as jest.MockedFunction<
    typeof getLectureTeachersAction
>;
const mockedGetLectureSubjectsAction = getLectureSubjectsAction as jest.MockedFunction<
    typeof getLectureSubjectsAction
>;
const mockedGetLectureClassroomsAction = getLectureClassroomsAction as jest.MockedFunction<
    typeof getLectureClassroomsAction
>;
const mockedGetLectureTermsAction = getLectureTermsAction as jest.MockedFunction<
    typeof getLectureTermsAction
>;

const lecture = {
    id: 1,
    name: "수학 클리닉",
    classType: "CLASS" as const,
    grade: "MIDDLE_1" as const,
    termName: "2026-1학기",
    subjectName: "수학",
    teacherId: 1,
    teacherName: "김선생",
    classroomCode: "A101",
    classroomName: "A반",
    schedules: [],
    studentCount: 5,
};

const renderModal = () =>
    render(
        <AddStudentLectureModal
            closeModal={jest.fn()}
            enrolledLectureIds={[]}
            refreshStudent={jest.fn()}
            studentId={1}
            studentName="홍길동"
        />,
    );

describe("AddStudentLectureModal", () => {
    beforeEach(() => {
        mockedGetLectureTeachersAction.mockResolvedValue({ success: true, message: "", data: [] });
        mockedGetLectureSubjectsAction.mockResolvedValue({ success: true, message: "", data: [] });
        mockedGetLectureClassroomsAction.mockResolvedValue({ success: true, message: "", data: [] });
        mockedGetLectureTermsAction.mockResolvedValue({ success: true, message: "", data: [] });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("조회한 강의 목록을 표시한다", async () => {
        mockedGetLectureListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [lecture], page: 0, size: 100, hasNext: false },
        });

        renderModal();

        expect(await screen.findByText("수학 클리닉")).toBeInTheDocument();
    });

    it("강의 목록이 비어있으면 안내 문구를 표시한다", async () => {
        mockedGetLectureListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [], page: 0, size: 100, hasNext: false },
        });

        renderModal();

        expect(await screen.findByText("조회된 강의가 없습니다.")).toBeInTheDocument();
    });

    it("강의 목록 조회에 실패하면 에러 메시지를 표시한다", async () => {
        mockedGetLectureListAction.mockResolvedValue({
            success: false,
            message: "강의 목록 조회에 실패했습니다.",
        });

        renderModal();

        expect(await screen.findByText("강의 목록 조회에 실패했습니다.")).toBeInTheDocument();
    });

    it("강의를 선택해 등록하면 성공 시 안내 토스트를 표시하고 모달을 닫는다", async () => {
        mockedGetLectureListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [lecture], page: 0, size: 100, hasNext: false },
        });
        mockedCreateStudentEnrollmentAction.mockResolvedValue({
            success: true,
            message: "등록했습니다.",
            data: { enrollmentId: 1 },
        });

        renderModal();

        fireEvent.click(await screen.findByRole("radio", { hidden: true }));
        fireEvent.submit(screen.getByRole("button", { name: "등록" }).closest("form")!);

        await waitFor(() => {
            expect(mockedCreateStudentEnrollmentAction).toHaveBeenCalledWith(
                1,
                expect.anything(),
                expect.any(FormData),
            );
        });
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("등록했습니다.");
        });
    });

    it("등록에 실패하면 에러 메시지를 표시한다", async () => {
        mockedGetLectureListAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { content: [lecture], page: 0, size: 100, hasNext: false },
        });
        mockedCreateStudentEnrollmentAction.mockResolvedValue({
            success: false,
            message: "학생 또는 강의 번호가 올바르지 않습니다.",
        });

        renderModal();

        fireEvent.click(await screen.findByRole("radio", { hidden: true }));
        fireEvent.submit(screen.getByRole("button", { name: "등록" }).closest("form")!);

        expect(
            await screen.findByText("학생 또는 강의 번호가 올바르지 않습니다."),
        ).toBeInTheDocument();
    });
});
