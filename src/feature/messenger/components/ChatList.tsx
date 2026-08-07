import ChatListItem, { Conversation } from "./ChatListItem";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const conversations: Conversation[] = [
    { name: "전체 공지", preview: "설 연휴 근무 일정 공지합니다.", time: "오전 10:23", unread: 2, initials: "전체", active: true },
    { name: "수학팀", preview: "이민준: 내일 수업 자료 공유해요", time: "어제", initials: "수학" },
    { name: "박서연", preview: "연간 처리 됐나요?", time: "어제", unread: 1, initials: "박서" },
    { name: "행정팀", preview: "정다은: 청구서 발송 완료했습니다", time: "월요일", initials: "행정" },
    { name: "강도현", preview: "알겠습니다!", time: "월요일", initials: "강도" },
];

export default function ChatList() {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto" aria-label="채팅방">
            {conversations.map((conversation) => (
                <ChatListItem conversation={conversation} key={conversation.name} />
            ))}
        </div>
    );
}
