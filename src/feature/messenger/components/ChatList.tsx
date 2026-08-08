import ChatListItem from "./ChatListItem";
import { chats } from "../data";

export default function ChatList() {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto" aria-label="채팅방">
            {chats.map((chat) => (
                <ChatListItem chat={chat} key={chat.id} />
            ))}
        </div>
    );
}
