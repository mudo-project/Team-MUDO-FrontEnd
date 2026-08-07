import ChatRoomHeader from "./ChatRoomHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatRoom() {
    return (
        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#FCFCFC]" aria-label="전체 공지 대화">
            <ChatRoomHeader />
            <MessageList />
            <MessageInput />
        </section>
    );
}
