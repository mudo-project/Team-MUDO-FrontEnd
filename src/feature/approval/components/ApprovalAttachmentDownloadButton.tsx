"use client";

import { getApprovalAttachmentDownloadUrlAction } from "../actions";
import { Download } from "lucide-react";
import { useState } from "react";

interface ApprovalAttachmentDownloadButtonProps {
    documentId: number;
    fileId: number;
}

export default function ApprovalAttachmentDownloadButton({
    documentId,
    fileId,
}: ApprovalAttachmentDownloadButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setError("");

        const response = await getApprovalAttachmentDownloadUrlAction(
            documentId,
            fileId,
        );

        setIsLoading(false);

        if (!response.success || !response.data) {
            setError(response.message);
            return;
        }

        window.open(response.data.downloadUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div>
            <button
                className="flex items-center gap-1 text-left text-[12px] text-[#3D4A5A] underline disabled:opacity-40"
                disabled={isLoading}
                onClick={handleDownload}
                type="button"
            >
                <Download className="size-3" strokeWidth={1.5} />
                {isLoading ? "다운로드 URL을 불러오는 중입니다." : `첨부파일 #${fileId}`}
            </button>
            {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
        </div>
    );
}
