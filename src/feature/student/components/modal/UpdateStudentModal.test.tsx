import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { updateStudentAction } from "../../actions";
import UpdateStudentModal from "./UpdateStudentModal";
import { StudentDetailData } from "../../type";
import { toast } from "sonner";

const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock("../../actions", () => ({
    updateStudentAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedUpdateStudentAction = updateStudentAction as jest.MockedFunction<
    typeof updateStudentAction
>;

const student: StudentDetailData = {
    studentId: 1,
    name: "홍길동",
    grade: "MIDDLE_1",
    school: "서울중학교",
    phone: "010-1234-5678",
    parentPhone: "010-2345-6789",
    note: "특이사항 없음",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-01",
    enrollments: [],
};

const submitForm = () => {
    fireEvent.submit(
        screen.getByRole("button", { name: "저장" }).closest("form")!,
    );
};

describe("UpdateStudentModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("기존 학생 정보를 입력값에 미리 채워서 표시한다", () => {
        render(
            <UpdateStudentModal
                closeModal={jest.fn()}
                onUpdated={jest.fn()}
                student={student}
                studentId={1}
            />,
        );

        expect(screen.getByDisplayValue("홍길동")).toBeInTheDocument();
        expect(screen.getByDisplayValue("서울중학교")).toBeInTheDocument();
        expect(screen.getByDisplayValue("010-1234-5678")).toBeInTheDocument();
    });

    it("이름을 지우고 제출하면 에러 메시지를 노출한다", async () => {
        render(
            <UpdateStudentModal
                closeModal={jest.fn()}
                onUpdated={jest.fn()}
                student={student}
                studentId={1}
            />,
        );

        fireEvent.change(screen.getByDisplayValue("홍길동"), { target: { value: "" } });
        submitForm();

        expect(await screen.findByText("이름을 입력해주세요.")).toBeInTheDocument();
        expect(mockedUpdateStudentAction).not.toHaveBeenCalled();
    });

    it("입력값이 유효하면 updateStudentAction을 호출하고 성공 시 콜백을 실행한다", async () => {
        mockedUpdateStudentAction.mockResolvedValue({
            success: true,
            message: "학생 정보 수정에 성공했습니다.",
        });
        const closeModal = jest.fn();
        const onUpdated = jest.fn();
        render(
            <UpdateStudentModal
                closeModal={closeModal}
                onUpdated={onUpdated}
                student={student}
                studentId={1}
            />,
        );

        fireEvent.change(screen.getByDisplayValue("홍길동"), { target: { value: "김철수" } });
        submitForm();

        await waitFor(() => {
            expect(mockedUpdateStudentAction).toHaveBeenCalledWith(1, {
                name: "김철수",
                grade: "MIDDLE_1",
                school: "서울중학교",
                phone: "010-1234-5678",
                parentPhone: "010-2345-6789",
                note: "특이사항 없음",
            });
        });
        expect(toast.success).toHaveBeenCalledWith("학생 정보 수정에 성공했습니다.");
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(onUpdated).toHaveBeenCalledTimes(1);
        expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it("updateStudentAction이 실패하면 에러 토스트를 표시하고 모달을 유지한다", async () => {
        mockedUpdateStudentAction.mockResolvedValue({
            success: false,
            message: "학생 정보 수정에 실패했습니다.",
        });
        const closeModal = jest.fn();
        render(
            <UpdateStudentModal
                closeModal={closeModal}
                onUpdated={jest.fn()}
                student={student}
                studentId={1}
            />,
        );

        submitForm();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("학생 정보 수정에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
    });
});
