import MessageItem, { Message } from "./MessageItem";

// 임시로 사용할 더미데이터 입니다. 추후 API 연동을 진행하면서 삭제할 예정입니다.
const messages: Message[] = [
    { id: 1, sender: "김지수", initials: "김지", time: "오전 9:00", text: "안녕하세요! 이번 주 토요일은 설 연휴 전 마지막 수업일입니다. 모든 강사분들 수업 준비 잘 부탁드립니다.", readCount: 3 },
    { id: 2, sender: "이민준", initials: "이민", time: "오전 9:15", text: "네, 알겠습니다. 수업 준비 완료했습니다.", readCount: 2 },
    { id: 3, sender: "김지수", initials: "김지", time: "오전 10:23", text: "설 연휴 근무 일정 공지합니다. 1/27(월) ~ 1/29(수) 휴원, 1/30(목)부터 정상 운영입니다.", readCount: 1 },
    { id: 4, own: true, time: "오전 10:30", text: "알겠습니다, 바로 진행하겠습니다!" },
    { id: 5, deleted: true, time: "오전 10:32", text: "" },
];

export default function MessageList() {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-10 py-4">
            <div className="mx-auto flex w-full max-w-[754px] flex-col gap-3">
                {messages.map((message) => (
                    <MessageItem key={message.id} message={message} />
                ))}
            </div>
        </div>
    );
}
