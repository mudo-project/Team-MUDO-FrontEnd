"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { getFileDownloadUrlAction } from "@/feature/file/actions";
import { getFileExtension } from "@/lib/file";

export default function NoticeFileList({ attachments }: { attachments: NoticeAttachmentData[] }) {
    const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [errorId, setErrorId] = useState<number | null>(null);

    useEffect(() => {
        attachments
            .filter((attachment) => attachment.fileType.startsWith("image/"))
            .forEach(async (attachment) => {
                const result = await getFileDownloadUrlAction(attachment.id);
                if (result.success && result.data) {
                    setImageUrls((prev) => ({ ...prev, [attachment.id]: result.data!.downloadUrl }));
                }
            });
    }, [attachments]);

    const handleDownload = async (attachment: NoticeAttachmentData) => {
        setDownloadingId(attachment.id);
        setErrorId(null);
        const result = await getFileDownloadUrlAction(attachment.id);
        setDownloadingId(null);

        if (!result.success || !result.data) {
            setErrorId(attachment.id);
            return;
        }

        window.open(result.data.downloadUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="mt-2 flex flex-col gap-2">
            {attachments.map((attachment) =>
                attachment.fileType.startsWith("image/") ? (
                    imageUrls[attachment.id] ? (
                        <a className="block w-fit" href={imageUrls[attachment.id]} key={attachment.id} rel="noreferrer" target="_blank">
                            <img
                                alt={attachment.fileName}
                                className="max-h-60 max-w-full rounded-[8px] border border-[#D7E8DB]"
                                src={imageUrls[attachment.id]}
                            />
                        </a>
                    ) : (
                        <div
                            className="flex h-40 w-40 items-center justify-center rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] text-[11px] text-[#94A3B8]"
                            key={attachment.id}
                        >
                            불러오는 중...
                        </div>
                    )
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
                            {errorId === attachment.id && (
                                <span className="block text-[11px] text-red-500">다운로드 URL 조회에 실패했습니다.</span>
                            )}
                        </span>
                        <button
                            aria-label={`${attachment.fileName} 다운로드`}
                            className="shrink-0 text-[#64748B] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={downloadingId === attachment.id}
                            onClick={() => handleDownload(attachment)}
                            type="button"
                        >
                            <Download className="size-4" strokeWidth={1.6} />
                        </button>
                    </div>
                )
            )}
        </div>
    );
}
