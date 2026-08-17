import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { deleteLectureAction } from "../actions";
import LectureDeleteButton from "./LectureDeleteButton";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("../actions", () => ({
    deleteLectureAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push, refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockedDeleteLectureAction = deleteLectureAction as jest.Mock;

afterEach(() => {
    jest.clearAllMocks();
});

describe("LectureDeleteButton", () => {
    it("삭제 버튼을 클릭하면 확인 모달이 열린다", () => {
        render(<LectureDeleteButton closeModal={jest.fn()} lectureId={1} />);

        fireEvent.click(screen.getByLabelText("강의 삭제"));

        expect(screen.getByText("삭제하시겠습니까?")).toBeInTheDocument();
    });

    it("확인 모달에서 확인을 누르고 삭제에 성공하면 토스트를 띄우고 모달을 닫은 뒤 목록을 새로고침한다", async () => {
        mockedDeleteLectureAction.mockResolvedValue({ success: true, message: "강의 삭제에 성공했습니다." });
        const closeModal = jest.fn();
        render(<LectureDeleteButton closeModal={closeModal} lectureId={1} />);

        fireEvent.click(screen.getByLabelText("강의 삭제"));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("강의 삭제에 성공했습니다."));
        expect(mockedDeleteLectureAction).toHaveBeenCalledWith(1);
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("삭제하시겠습니까?")).not.toBeInTheDocument();
    });

    it("삭제에 실패하면 오류 토스트를 띄우고 확인 모달을 유지한다", async () => {
        mockedDeleteLectureAction.mockResolvedValue({ success: false, message: "강의 삭제에 실패했습니다." });
        const closeModal = jest.fn();
        render(<LectureDeleteButton closeModal={closeModal} lectureId={1} />);

        fireEvent.click(screen.getByLabelText("강의 삭제"));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("강의 삭제에 실패했습니다."));
        expect(closeModal).not.toHaveBeenCalled();
        expect(refresh).not.toHaveBeenCalled();
        expect(screen.getByText("삭제하시겠습니까?")).toBeInTheDocument();
    });

    it("삭제 처리 중에는 삭제 버튼이 비활성화된다", async () => {
        let resolveDelete: (value: { success: boolean; message: string }) => void = () => {};
        mockedDeleteLectureAction.mockImplementation(
            () => new Promise((resolve) => { resolveDelete = resolve; }),
        );
        render(<LectureDeleteButton closeModal={jest.fn()} lectureId={1} />);

        fireEvent.click(screen.getByLabelText("강의 삭제"));
        fireEvent.click(screen.getByRole("button", { name: "확인" }));

        await waitFor(() => expect(screen.getByLabelText("강의 삭제")).toBeDisabled());

        await act(async () => {
            resolveDelete({ success: true, message: "강의 삭제에 성공했습니다." });
        });
    });
});
