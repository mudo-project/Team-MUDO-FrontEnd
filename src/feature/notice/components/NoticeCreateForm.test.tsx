import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { createNoticeAction } from "../actions";
import NoticeCreateForm from "./NoticeCreateForm";

const refresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    createNoticeAction: jest.fn(),
}));

const mockedCreateNoticeAction = createNoticeAction as jest.MockedFunction<typeof createNoticeAction>;

const openModal = () => {
    render(<NoticeCreateForm />);
    fireEvent.click(screen.getByRole("button", { name: "공지 작성" }));
};

describe("NoticeCreateForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("제목과 내용을 입력하지 않고 등록하면 에러 메시지를 노출한다", async () => {
        openModal();

        fireEvent.click(screen.getByRole("button", { name: "등록" }));

        expect(await screen.findByText("제목을 입력하세요")).toBeInTheDocument();
        expect(await screen.findByText("내용을 입력하세요")).toBeInTheDocument();
        expect(createNoticeAction).not.toHaveBeenCalled();
    });

    it("필수값을 입력하고 등록하면 등록 액션을 호출하고 모달을 닫는다", async () => {
        mockedCreateNoticeAction.mockResolvedValue({ success: true, message: "공지사항이 등록되었습니다." });
        openModal();

        fireEvent.change(screen.getByLabelText("제목 *"), { target: { value: "공지 제목" } });
        fireEvent.change(screen.getByLabelText("내용 *"), { target: { value: "공지 내용" } });
        fireEvent.click(screen.getByRole("button", { name: "등록" }));

        await waitFor(() => {
            expect(createNoticeAction).toHaveBeenCalledWith("공지 제목", "공지 내용", false);
        });
        expect(toast.success).toHaveBeenCalledWith("공지사항이 등록되었습니다.");
        expect(refresh).toHaveBeenCalled();
        expect(screen.queryByRole("heading", { name: "공지 작성" })).not.toBeInTheDocument();
    });

    it("등록에 실패하면 에러 토스트를 노출하고 모달을 유지한다", async () => {
        mockedCreateNoticeAction.mockResolvedValue({ success: false, message: "공지사항 작성에 실패하였습니다." });
        openModal();

        fireEvent.change(screen.getByLabelText("제목 *"), { target: { value: "공지 제목" } });
        fireEvent.change(screen.getByLabelText("내용 *"), { target: { value: "공지 내용" } });
        fireEvent.click(screen.getByRole("button", { name: "등록" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("공지사항 작성에 실패하였습니다.");
        });
        expect(screen.getByRole("heading", { name: "공지 작성" })).toBeInTheDocument();
        expect(refresh).not.toHaveBeenCalled();
    });

    it("취소를 클릭하면 모달이 닫힌다", () => {
        openModal();

        fireEvent.click(screen.getByRole("button", { name: "취소" }));

        expect(screen.queryByRole("heading", { name: "공지 작성" })).not.toBeInTheDocument();
    });
});
