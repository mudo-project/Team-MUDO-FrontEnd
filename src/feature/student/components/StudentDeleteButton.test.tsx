import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteStudentAction } from "../actions";
import StudentDeleteButton from "./StudentDeleteButton";
import { toast } from "sonner";

const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock("../actions", () => ({
    deleteStudentAction: jest.fn(),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedDeleteStudentAction = deleteStudentAction as jest.MockedFunction<
    typeof deleteStudentAction
>;

describe("StudentDeleteButton", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("삭제 버튼을 클릭하면 확인 모달을 표시한다", () => {
        render(<StudentDeleteButton closeModal={jest.fn()} studentId={1} />);

        fireEvent.click(screen.getByRole("button", { name: "학생 삭제" }));

        expect(screen.getByText("원생 삭제")).toBeInTheDocument();
        expect(screen.getByText("삭제하시겠습니까?")).toBeInTheDocument();
    });

    it("확인을 클릭하면 삭제에 성공 시 토스트를 표시하고 모달을 닫는다", async () => {
        mockedDeleteStudentAction.mockResolvedValue({
            success: true,
            message: "학생 삭제에 성공했습니다.",
        });
        const closeModal = jest.fn();
        render(<StudentDeleteButton closeModal={closeModal} studentId={1} />);

        fireEvent.click(screen.getByRole("button", { name: "학생 삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(mockedDeleteStudentAction).toHaveBeenCalledWith(1);
        });
        expect(toast.success).toHaveBeenCalledWith("학생 삭제에 성공했습니다.");
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(mockRefresh).toHaveBeenCalledTimes(1);
    });

    it("삭제에 실패하면 에러 토스트를 표시하고 모달을 유지한다", async () => {
        mockedDeleteStudentAction.mockResolvedValue({
            success: false,
            message: "학생 삭제에 실패했습니다.",
        });
        const closeModal = jest.fn();
        render(<StudentDeleteButton closeModal={closeModal} studentId={1} />);

        fireEvent.click(screen.getByRole("button", { name: "학생 삭제" }));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("학생 삭제에 실패했습니다.");
        });
        expect(closeModal).not.toHaveBeenCalled();
        expect(screen.getByText("원생 삭제")).toBeInTheDocument();
    });
});
