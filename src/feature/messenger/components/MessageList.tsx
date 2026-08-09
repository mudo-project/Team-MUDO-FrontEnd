import MessageItem from "./MessageItem";
import { FeedItem } from "../utils";

type MessageListProps = {
    feed: FeedItem[];
    currentUserId: number | null;
    roomId: number;
    onMessagesChange: () => void;
    onTaskCardsChange: () => void;
};

export default function MessageList({ feed, currentUserId, roomId, onMessagesChange, onTaskCardsChange }: MessageListProps) {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-10 py-4">
            <div className="mx-auto flex w-full max-w-[754px] flex-col gap-3">
                {feed.map((item) => (
                    <MessageItem
                        key={`${item.kind}-${item.id}`}
                        item={item}
                        currentUserId={currentUserId}
                        roomId={roomId}
                        onMessagesChange={onMessagesChange}
                        onTaskCardsChange={onTaskCardsChange}
                    />
                ))}
            </div>
        </div>
    );
}
