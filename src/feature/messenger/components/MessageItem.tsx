import Avatar from "./Avatar";
import MessageMenu from "./MessageMenu";

export type Message = {
    id: number;
    sender?: string;
    initials?: string;
    time: string;
    text: string;
    own?: boolean;
    readCount?: number;
    deleted?: boolean;
};

export default function MessageItem({ message }: { message: Message }) {
    if (message.deleted) {
        return (
            <p className="py-1 text-center text-[10px] text-[#94A3B8]">삭제된 채팅입니다</p>
        );
    }

    if (message.own) {
        return (
            <article className="group relative ml-auto flex max-w-[620px] flex-col items-end gap-1">
                <div className="rounded-[11px] bg-[#2C8D50] px-3 py-2 text-[11px] leading-[1.5] text-white">
                    {message.text}
                </div>
                <p className="text-[9px] text-[#64748B]">{message.time}</p>
                <MessageMenu />
            </article>
        );
    }

    return (
        <article className="flex max-w-[620px] items-end gap-2">
            <Avatar initials={message.initials ?? ""} />
            <div>
                <p className="mb-1 text-[9px] text-[#64748B]">{message.sender}</p>
                <div className="rounded-[11px] bg-[#E9EDF1] px-3 py-2 text-[11px] leading-[1.5] text-[#1E293B]">
                    {message.text}
                </div>
                <p className="mt-1 flex items-center gap-1 text-[9px] text-[#64748B]">
                    <span>{message.time}</span>
                    {typeof message.readCount === "number" && <span>· 읽음 {message.readCount}</span>}
                </p>
            </div>
        </article>
    );
}
