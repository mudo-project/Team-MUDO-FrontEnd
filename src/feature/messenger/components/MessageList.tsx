import MessageItem from "./MessageItem";
import { ChatMessage } from "../data";

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
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
