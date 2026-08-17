import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createStudentAction } from "../../actions";
import CreateStudentModal from "./CreateStudentModal";
import { toast } from "sonner";

const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock("../../actions", () => ({
    createStudentAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedCreateStudentAction = createStudentAction as jest.MockedFunction<
    typeof createStudentAction
>;

const submitForm = () => {
    fireEvent.submit(
        screen.getByRole("button", { name: "등록" }).closest("form")!,
    );
};

describe("CreateStudentModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("이름을 입력하지 않고 제출하면 에러 메시지를 노출한다", async () => {
        render(<CreateStudentModal closeModal={jest.fn()} />);

        submitForm();

        expect(await screen.findByText("이름을 입력해주세요.")).toBeInTheDocument();
        expect(mockedCreateStudentAction).not.toHaveBeenCalled();
    });

    it("연락처 형식이 올바르지 않으면 에러 메시지를 노출한다", async () => {
        render(<CreateStudentModal closeModal={jest.fn()} />);

        fireEvent.change(screen.getByPlaceholderText("홍길동"), {
            target: { value: "홍길동" },
        });
        fireEvent.change(screen.getAllByPlaceholderText("010-0000-0000")[0], {
            target: { value: "01012345678" },
        });

        submitForm();

        expect(
            await screen.findByText("전화번호 형식이 맞지 않습니다. (예: 010-1234-5678)"),
        ).toBeInTheDocument();
        expect(mockedCreateStudentAction).not.toHaveBeenCalled();
    });

    it("입력값이 유효하면 createStudentAction을 호출하고 성공 시 모달을 닫는다", async () => {
        mockedCreateStudentAction.mockResolvedValue({
            success: true,
            message: "등록했습니다.",
            data: { studentId: 1 },
        });
        const closeModal = jest.fn();
        render(<CreateStudentModal closeModal={closeModal} />);

        fireEvent.change(screen.getByPlaceholderText("홍길동"), {
            target: { value: "홍길동" },
        });

        submitForm();

        await waitFor(() => {
            expect(mockedCreateStudentAction).toHaveBeenCalledWith({
                name: "홍길동",
                grade: "MIDDLE_1",
                school: undefined,
                phone: undefined,
                parentPhone: undefined,
                note: undefined,
            });
        });
        expect(toast.success).toHaveBeenCalledWith("등록했습니다.");
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it("createStudentAction이 실패하면 에러 토스트를 표시하고 모달을 유지한다", async () => {
        mockedCreateStudentAction.mockResolvedValue({
            success: false,
            message: "학생 등록에 실패했습니다.",
        });
        const closeModal = jest.fn();
        render(<CreateStudentModal closeModal={closeModal} />);

        fireEvent.change(screen.getByPlaceholderText("홍길동"), {
            target: { value: "홍길동" },
        });

        submitForm();

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("학생 등록에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
    });
});
