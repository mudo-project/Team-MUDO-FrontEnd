import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { createChatRoomAction, searchUsersAction } from "../actions";
import ChatCreateModal from "./ChatCreateModal";

const push = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock("../actions", () => ({
    createChatRoomAction: jest.fn(),
    searchUsersAction: jest.fn(),
}));

const mockedSearchUsersAction = searchUsersAction as jest.MockedFunction<typeof searchUsersAction>;
const mockedCreateChatRoomAction = createChatRoomAction as jest.MockedFunction<typeof createChatRoomAction>;

const members: MessengerUserSearchItemData[] = [
    { userId: 1, name: "김지수", username: "jisu" },
    { userId: 2, name: "박민준", username: "minjun" },
];

describe("ChatCreateModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("일치하는 인원이 없으면 안내 문구를 노출한다", async () => {
        mockedSearchUsersAction.mockResolvedValue([]);
        render(<ChatCreateModal onClose={jest.fn()} />);

        expect(await screen.findByText("일치하는 인원이 없습니다")).toBeInTheDocument();
    });

    it("인원을 선택하기 전에는 만들기 버튼이 비활성 상태다", async () => {
        mockedSearchUsersAction.mockResolvedValue(members);
        render(<ChatCreateModal onClose={jest.fn()} />);

        expect(await screen.findByText("김지수")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "만들기" })).toBeDisabled();
    });

    it("인원을 선택하면 만들기 버튼이 활성화되고 생성 액션을 호출한다", async () => {
        mockedSearchUsersAction.mockResolvedValue(members);
        mockedCreateChatRoomAction.mockResolvedValue({ success: true, message: "채팅방이 생성되었습니다.", chatRoomId: 10 });
        const onClose = jest.fn();
        render(<ChatCreateModal onClose={onClose} />);

        fireEvent.click(await screen.findByText("김지수"));
        expect(screen.getByRole("button", { name: "만들기" })).not.toBeDisabled();

        fireEvent.click(screen.getByRole("button", { name: "만들기" }));

        await waitFor(() => {
            expect(createChatRoomAction).toHaveBeenCalledWith([1], undefined);
        });
        expect(toast.success).toHaveBeenCalledWith("채팅방이 생성되었습니다.");
        expect(onClose).toHaveBeenCalled();
        expect(push).toHaveBeenCalledWith("/messenger/10");
    });

    it("생성에 실패하면 에러 토스트를 노출하고 모달을 유지한다", async () => {
        mockedSearchUsersAction.mockResolvedValue(members);
        mockedCreateChatRoomAction.mockResolvedValue({ success: false, message: "채팅방 생성에 실패하였습니다." });
        const onClose = jest.fn();
        render(<ChatCreateModal onClose={onClose} />);

        fireEvent.click(await screen.findByText("김지수"));
        fireEvent.click(screen.getByRole("button", { name: "만들기" }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("채팅방 생성에 실패하였습니다.");
        });
        expect(onClose).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });

    it("취소를 클릭하면 onClose가 호출된다", async () => {
        mockedSearchUsersAction.mockResolvedValue(members);
        const onClose = jest.fn();
        render(<ChatCreateModal onClose={onClose} />);

        fireEvent.click(await screen.findByRole("button", { name: "취소" }));

        expect(onClose).toHaveBeenCalled();
    });
});
