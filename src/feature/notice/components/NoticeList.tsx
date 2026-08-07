import { Paperclip } from "lucide-react";
import Link from "next/link";
import { dummyNotices } from "@/feature/notice/dummyNotices";

export default function NoticeList() {
    return (
        <div className="overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
            {dummyNotices.map((notice) => (
                <div
                    className="border-b border-[#E5EEE7] last:border-b-0"
                    key={notice.id}
                >
                    <Link
                        className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_68px_50px] items-center gap-3 px-6 hover:cursor-pointer"
                        href={`/notice/${notice.id}`}
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            {notice.important
                                ?
                                <span aria-label="중요 공지" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4D9560]" />
                                :
                                <span className="w-1.5 shrink-0" />
                            }
                            {notice.important &&
                                <span className="rounded-md bg-[#12182B] px-1.5 py-1 text-[9px] font-semibold text-white">중요</span>
                            }
                            <span
                                className={`min-w-0 text-[13px]
                                    ${notice.important
                                    ?
                                    "font-semibold text-[#172033]"
                                    :
                                    "text-[#64748B]"
                                    }
                                `}>
                                    {notice.title}
                            </span>
                            {notice.attachment && <Paperclip className="ml-auto h-3.5 w-3.5 shrink-0 text-[#64748B]" strokeWidth={1.6} />}
                        </div>
                        <span className="text-[11px] text-[#64748B]">{notice.author}</span>
                        <time className="text-right text-[11px] text-[#64748B]">{notice.date}</time>
                    </Link>
                </div>
            ))}
        </div>
    );
}
