import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { FeedItem, formatFeedDateDivider, isSameDay } from "../utils";

type MessageListProps = {
    feed: FeedItem[];
    currentUserId: number | null;
    roomId: number;
    onMessagesChange: () => void;
    onTaskCardsChange: () => void;
};

export default function MessageList({ feed, currentUserId, roomId, onMessagesChange, onTaskCardsChange }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: "end" });
    }, [feed]);

    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-10 py-4">
            <div className="mx-auto flex w-full max-w-[754px] flex-col gap-3">
                {feed.map((item, index) => {
                    const showDateDivider = index === 0 || !isSameDay(item.createdAt, feed[index - 1].createdAt);

                    return (
                        <div className="contents" key={`${item.kind}-${item.id}`}>
                            {showDateDivider && (
                                <div className="my-2 flex justify-center">
                                    <span className="rounded-full bg-[#F1F3F5] px-3 py-1 text-[10px] font-medium text-[#64748B]">
                                        {formatFeedDateDivider(item.createdAt)}
                                    </span>
                                </div>
                            )}
                            <MessageItem
                                item={item}
                                currentUserId={currentUserId}
                                roomId={roomId}
                                onMessagesChange={onMessagesChange}
                                onTaskCardsChange={onTaskCardsChange}
                            />
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
