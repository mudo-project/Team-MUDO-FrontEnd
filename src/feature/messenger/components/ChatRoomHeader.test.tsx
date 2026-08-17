import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getChatRoomMembersAction } from "../actions";
import ChatRoomHeader from "./ChatRoomHeader";
import { MessengerMobileNavProvider } from "./MessengerMobileNavContext";

jest.mock("../actions", () => ({
    getChatRoomMembersAction: jest.fn(),
}));

const mockedGetChatRoomMembersAction = getChatRoomMembersAction as jest.MockedFunction<typeof getChatRoomMembersAction>;

function renderWithProvider(ui: React.ReactElement) {
    return render(<MessengerMobileNavProvider>{ui}</MessengerMobileNavProvider>);
}

const members: MessengerRoomMemberData[] = [
    { userId: 1, name: "로그인 사용자", lastReadAt: null },
    { userId: 2, name: "김지수", lastReadAt: null },
];

describe("ChatRoomHeader", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("평시에는 채팅방 제목과 참여자 수를 노출한다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        renderWithProvider(
            <ChatRoomHeader
                roomId={1}
                roomName="1반 공지방"
                isSearchOpen={false}
                searchQuery=""
                onToggleSearch={jest.fn()}
                onSearchQueryChange={jest.fn()}
            />
        );

        expect(screen.getByRole("heading", { name: "1반 공지방" })).toBeInTheDocument();
        expect(await screen.findByText("참여자 2명")).toBeInTheDocument();
    });

    it("검색 모드면 검색 입력창을 노출하고 제목은 노출하지 않는다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        renderWithProvider(
            <ChatRoomHeader
                roomId={1}
                roomName="1반 공지방"
                isSearchOpen
                searchQuery="안녕"
                onToggleSearch={jest.fn()}
                onSearchQueryChange={jest.fn()}
            />
        );

        expect(screen.getByLabelText("채팅방 내 메시지 검색")).toHaveValue("안녕");
        expect(screen.queryByRole("heading", { name: "1반 공지방" })).not.toBeInTheDocument();
        await waitFor(() => expect(getChatRoomMembersAction).toHaveBeenCalledWith(1));
    });

    it("검색 아이콘을 클릭하면 검색 토글 콜백을 호출한다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        const onToggleSearch = jest.fn();
        renderWithProvider(
            <ChatRoomHeader
                roomId={1}
                roomName="1반 공지방"
                isSearchOpen={false}
                searchQuery=""
                onToggleSearch={onToggleSearch}
                onSearchQueryChange={jest.fn()}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "대화 검색" }));

        expect(onToggleSearch).toHaveBeenCalled();
        await waitFor(() => expect(getChatRoomMembersAction).toHaveBeenCalledWith(1));
    });

    it("참여자 아이콘을 클릭하면 참여자 목록이 열리고, 닫기 버튼으로 닫힌다", async () => {
        mockedGetChatRoomMembersAction.mockResolvedValue(members);
        renderWithProvider(
            <ChatRoomHeader
                roomId={1}
                roomName="1반 공지방"
                isSearchOpen={false}
                searchQuery=""
                onToggleSearch={jest.fn()}
                onSearchQueryChange={jest.fn()}
            />
        );

        await screen.findByText("참여자 2명");
        fireEvent.click(screen.getByRole("button", { name: "참여자 목록 확인" }));

        expect(screen.getByRole("button", { name: "참여자 목록 닫기" })).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "참여자 목록 닫기" }));

        expect(screen.queryByRole("button", { name: "참여자 목록 닫기" })).not.toBeInTheDocument();
    });
});
