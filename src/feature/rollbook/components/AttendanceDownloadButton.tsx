"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { exportLectureAttendanceAction } from "../actions";

export default function AttendanceDownloadButton({
    date,
    lectureId,
}: {
    date: string;
    lectureId: number;
}) {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadAttendance = async () => {
        if (isDownloading) return;

        setIsDownloading(true);
        const result = await exportLectureAttendanceAction(lectureId, date);

        if (!result.success || !result.data) {
            toast.error(result.message);
            setIsDownloading(false);
            return;
        }

        const binary = window.atob(result.data.file);
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        const blob = new Blob([bytes], { type: result.data.mimeType });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = result.data.fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);

        toast.success(result.message);
        setIsDownloading(false);
    };

    return (
        <button
            aria-label="출결부 다운로드"
            className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#DCE8E2] bg-white px-3 text-[13px] leading-[19.5px] font-medium text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDownloading}
            onClick={() => void downloadAttendance()}
            type="button"
        >
            <Download aria-hidden="true" className="size-[13px]" strokeWidth={1.5} />
            {isDownloading ? "다운로드 중" : "다운로드"}
        </button>
    );
}
