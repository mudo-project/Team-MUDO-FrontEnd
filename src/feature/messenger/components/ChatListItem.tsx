import Avatar from "./Avatar";

export type Conversation = {
    name: string;
    preview: string;
    time: string;
    unread?: number;
    initials: string;
    active?: boolean;
};

export default function ChatListItem({ conversation }: { conversation: Conversation }) {
    return (
        <button
            className={
                `flex w-full items-center gap-2.5 px-3 py-3 text-left
                ${conversation.active
                    ? "bg-[#EEF3F0]"
                    : "bg-white hover:bg-[#F7F9F7]"
                }
                `
            }
            type="button"
        >
            <Avatar initials={conversation.initials} />
            <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                    <strong className="truncate text-[12px] font-semibold text-[#0F172A]">{conversation.name}</strong>
                    <span className="shrink-0 text-[9px] text-[#64748B]">{conversation.time}</span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                    <span className="truncate text-[10px] text-[#64748B]">{conversation.preview}</span>
                    {conversation.unread
                        ?
                        <span className="ml-auto flex size-4 shrink-0 items-center justify-center rounded-full bg-[#2C8D50] text-[8px] font-semibold text-white">
                            {conversation.unread}
                        </span>
                        :
                        null
                    }
                </span>
            </span>
        </button>
    );
}
