import { format } from "date-fns";
import { ArrowLeft, ChevronDown, ChevronUp, Download } from "lucide-react";
import Link from "next/link";
import { getFileExtension } from "@/lib/file";
import { getNoticeDetailAction, getNoticeListAction } from "../actions";
import NoticeDetailToolbar from "./NoticeDetailToolbar";

export default async function NoticeDetail({ id }: { id: string }) {
    const noticeId = Number(id);

    let notice: NoticeDetailData;
    try {
        notice = await getNoticeDetailAction(noticeId);
    } catch {
        return (
            <div className="rounded-xl border border-[#DCE9DF] bg-white p-6 text-center text-[13px] text-[#64748B]">
                공지를 찾을 수 없습니다.
            </div>
        );
    }

    const noticeList = await getNoticeListAction({ size: 100 });
    const index = noticeList.content.findIndex((item) => item.id === noticeId);
    const prevNotice = index > 0 ? noticeList.content[index - 1] : undefined;
    const nextNotice = index !== -1 && index < noticeList.content.length - 1 ? noticeList.content[index + 1] : undefined;

    return (
        <div>
            <Link className="flex items-center gap-1.5 text-[13px] font-medium text-[#0F172A] hover:cursor-pointer" href="/notice">
                <ArrowLeft className="size-3.5" strokeWidth={2} />
                목록으로
            </Link>

            <section className="mt-4 max-h-[calc(100dvh-260px)] overflow-y-auto rounded-xl border border-[#DCE9DF] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                <NoticeDetailToolbar notice={notice} />

                <h1 className="mt-3 text-[20px] font-bold text-[#0F172A]">{notice.title}</h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[11px] font-semibold text-white">
                        {notice.authorName.slice(0, 1)}
                    </span>
                    <span>{notice.authorRole} {notice.authorName}</span>
                    <span>·</span>
                    <span>{format(new Date(notice.createdAt), "yyyy.MM.dd HH:mm")}</span>
                    <span>·</span>
                    <span>조회 {notice.viewCount}</span>
                    <span>·</span>
                    <span>읽음 {notice.readerCount}/{notice.totalRecipientCount}</span>
                </div>

                <hr className="mt-4 border-[#E5EEE7]" />

                <div className="mt-4 whitespace-pre-line text-[13px] leading-6 text-[#172033]">
                    {notice.content}
                </div>

                {notice.attachments.length > 0 && (
                    <>
                        <hr className="mt-4 border-[#E5EEE7]" />
                        <div className="mt-4">
                            <p className="text-[12px] font-medium text-[#64748B]">파일 {notice.attachments.length}</p>
                            <div className="mt-2 flex flex-col gap-2">
                                {notice.attachments.map((attachment) =>
                                    attachment.fileType.startsWith("image/") ? (
                                        <a
                                            className="block w-fit"
                                            href={attachment.fileUrl}
                                            key={attachment.id}
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            <img
                                                alt={attachment.fileName}
                                                className="max-h-60 max-w-full rounded-[8px] border border-[#D7E8DB]"
                                                src={attachment.fileUrl}
                                            />
                                        </a>
                                    ) : (
                                        <div
                                            className="flex h-[58px] w-full items-center gap-2.5 rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] px-3"
                                            key={attachment.id}
                                        >
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-[#EEF2FF] text-[9px] font-bold text-[#3B4A66]">
                                                {getFileExtension(attachment.fileName)}
                                            </span>
                                            <span className="w-full min-w-0">
                                                <strong className="block truncate text-[13px] font-normal text-[#0F172A]">
                                                    {attachment.fileName}
                                                </strong>
                                            </span>
                                            <a
                                                aria-label={`${attachment.fileName} 다운로드`}
                                                className="shrink-0 text-[#64748B] hover:cursor-pointer"
                                                href={attachment.fileUrl}
                                                rel="noreferrer"
                                                target="_blank"
                                            >
                                                <Download className="size-4" strokeWidth={1.6} />
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </section>

            <div className="mt-3 flex flex-col gap-2">
                {prevNotice ? (
                    <Link
                        className="flex h-[46px] items-center gap-2 rounded-[8px] border border-[#DCE9DF] bg-white px-4 text-[13px] hover:cursor-pointer"
                        href={`/notice/${prevNotice.id}`}
                    >
                        <ChevronUp className="size-3.5 shrink-0 text-[#94A3B8]" strokeWidth={2} />
                        <span className="shrink-0 text-[#94A3B8]">이전</span>
                        <span className="min-w-0 flex-1 truncate text-[#0F172A]">{prevNotice.title}</span>
                    </Link>
                ) : (
                    <div className="flex h-[46px] items-center gap-2 rounded-[8px] border border-[#DCE9DF] bg-white px-4 text-[13px] text-[#94A3B8]">
                        <ChevronUp className="size-3.5 shrink-0" strokeWidth={2} />
                        <span>이전</span>
                        <span>이전 공지가 없습니다</span>
                    </div>
                )}

                {nextNotice ? (
                    <Link
                        className="flex h-[46px] items-center gap-2 rounded-[8px] border border-[#DCE9DF] bg-white px-4 text-[13px] hover:cursor-pointer"
                        href={`/notice/${nextNotice.id}`}
                    >
                        <ChevronDown className="size-3.5 shrink-0 text-[#94A3B8]" strokeWidth={2} />
                        <span className="shrink-0 text-[#94A3B8]">다음</span>
                        <span className="min-w-0 flex-1 truncate text-[#0F172A]">{nextNotice.title}</span>
                    </Link>
                ) : (
                    <div className="flex h-[46px] items-center gap-2 rounded-[8px] border border-[#DCE9DF] bg-white px-4 text-[13px] text-[#94A3B8]">
                        <ChevronDown className="size-3.5 shrink-0" strokeWidth={2} />
                        <span>다음</span>
                        <span>다음 공지가 없습니다</span>
                    </div>
                )}
            </div>
        </div>
    );
}
