import { format } from "date-fns";
import { Paperclip } from "lucide-react";
import Link from "next/link";

export default function NoticeList({ notices, keyword }: { notices: NoticeListItemData[]; keyword?: string }) {
    if (notices.length === 0) {
        return (
            <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                {keyword ? "검색 결과가 없습니다" : "등록된 공지가 없습니다"}
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
            {notices.map((notice) => (
                <div
                    className="border-b border-[#E5EEE7] last:border-b-0"
                    key={notice.id}
                >
                    <Link
                        className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_68px_50px] items-center gap-3 px-6 hover:cursor-pointer"
                        href={`/notice/${notice.id}`}
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            {notice.pinned
                                ?
                                <span aria-label="중요 공지" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4D9560]" />
                                :
                                <span className="w-1.5 shrink-0" />
                            }
                            {notice.pinned &&
                                <span className="rounded-md bg-[#12182B] px-1.5 py-1 text-[9px] font-semibold text-white">중요</span>
                            }
                            <span
                                className={`min-w-0 text-[13px]
                                    ${notice.pinned
                                    ?
                                    "font-semibold text-[#172033]"
                                    :
                                    "text-[#64748B]"
                                    }
                                `}>
                                    {notice.title}
                            </span>
                            {notice.hasAttachment && <Paperclip className="ml-auto h-3.5 w-3.5 shrink-0 text-[#64748B]" strokeWidth={1.6} />}
                        </div>
                        <span className="text-[11px] text-[#64748B]">{notice.authorName}</span>
                        <time className="text-right text-[11px] text-[#64748B]">{format(new Date(notice.createdAt), "MM.dd")}</time>
                    </Link>
                </div>
            ))}
        </div>
    );
}
