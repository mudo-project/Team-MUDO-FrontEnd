import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { endStudentEnrollmentAction, getStudentDetailAction } from "../../actions";
import ViewStudentModal from "./ViewStudentModal";
import { StudentDetailData } from "../../type";
import { toast } from "sonner";

jest.mock("../../actions", () => ({
    endStudentEnrollmentAction: jest.fn(),
    getStudentDetailAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("../StudentUpdateButton", () => function MockStudentUpdateButton() {
    return <button type="button">학생 수정</button>;
});

jest.mock("../StudentDeleteButton", () => function MockStudentDeleteButton() {
    return <button type="button">학생 삭제</button>;
});

jest.mock("./AddStudentLectureModal", () => function MockAddStudentLectureModal() {
    return <div data-testid="mock-add-student-lecture-modal" />;
});

const mockedGetStudentDetailAction = getStudentDetailAction as jest.MockedFunction<
    typeof getStudentDetailAction
>;
const mockedEndStudentEnrollmentAction = endStudentEnrollmentAction as jest.MockedFunction<
    typeof endStudentEnrollmentAction
>;

const studentDetail: StudentDetailData = {
    studentId: 1,
    name: "홍길동",
    grade: "MIDDLE_1",
    school: "서울중학교",
    phone: "010-1234-5678",
    parentPhone: "010-2345-6789",
    note: "특이사항 없음",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
    enrollments: [
        {
            enrollmentId: 10,
            lectureId: 1,
            lectureName: "수학 클리닉",
            teacherName: "김선생",
            scheduleText: "월 10:00-11:00",
            priceType: "PER_MONTH",
            priceAmount: 100000,
            enrolledAt: "2026-08-01",
        },
    ],
};

describe("ViewStudentModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("조회한 학생 상세 정보를 표시한다", async () => {
        mockedGetStudentDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: studentDetail,
        });

        render(<ViewStudentModal closeModal={jest.fn()} studentId={1} />);

        expect(await screen.findByText("홍길동")).toBeInTheDocument();
        expect(screen.getByText("수학 클리닉")).toBeInTheDocument();
    });

    it("학생 조회에 실패하면 에러 메시지를 표시한다", async () => {
        mockedGetStudentDetailAction.mockResolvedValue({
            success: false,
            message: "학생 상세 조회에 실패했습니다.",
        });

        render(<ViewStudentModal closeModal={jest.fn()} studentId={1} />);

        expect(
            await screen.findByText(/학생 상세 조회에 실패했습니다\./),
        ).toBeInTheDocument();
    });

    it("수강 중인 강의가 없으면 안내 문구를 표시한다", async () => {
        mockedGetStudentDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: { ...studentDetail, enrollments: [] },
        });

        render(<ViewStudentModal closeModal={jest.fn()} studentId={1} />);

        expect(
            await screen.findByText("수강 중인 강의가 없습니다."),
        ).toBeInTheDocument();
    });

    it("수강 종료 버튼을 클릭하고 확인하면 수강을 종료하고 목록을 새로고침한다", async () => {
        mockedGetStudentDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: studentDetail,
        });
        mockedEndStudentEnrollmentAction.mockResolvedValue({
            success: true,
            message: "학생 수강 종료에 성공했습니다.",
        });

        render(<ViewStudentModal closeModal={jest.fn()} studentId={1} />);

        fireEvent.click(await screen.findByRole("button", { name: "수강 종료" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(mockedEndStudentEnrollmentAction).toHaveBeenCalledWith(1, 10);
        });
        expect(toast.success).toHaveBeenCalledWith("학생 수강 종료에 성공했습니다.");
        expect(mockedGetStudentDetailAction).toHaveBeenCalledTimes(2);
    });

    it("수강 등록 버튼을 클릭하면 강의 등록 모달을 표시한다", async () => {
        mockedGetStudentDetailAction.mockResolvedValue({
            success: true,
            message: "조회했습니다.",
            data: studentDetail,
        });

        render(<ViewStudentModal closeModal={jest.fn()} studentId={1} />);

        fireEvent.click(await screen.findByRole("button", { name: /수강 등록/ }));

        expect(screen.getByTestId("mock-add-student-lecture-modal")).toBeInTheDocument();
    });
});
