"use client";

import { Upload, X } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type AttachedFile = {
    file: File;
    previewUrl: string;
};

// 업로드한 파일 크기 확인
function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 파일명에서 확장자 추출
function getFileExtension(fileName: string) {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}

export default function NoticeFileUpload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachedFilesRef = useRef<AttachedFile[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

    useEffect(() => {
        attachedFilesRef.current = attachedFiles;
    }, [attachedFiles]);

    useEffect(() => {
        return () => {
            attachedFilesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        };
    }, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

        const newFiles = Array.from(selectedFiles).map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setAttachedFiles((prev) => [...prev, ...newFiles]);
        event.target.value = "";
    };

    const removeFile = (previewUrl: string) => {
        setAttachedFiles((prev) => {
            const target = prev.find((item) => item.previewUrl === previewUrl);
            if (target) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((item) => item.previewUrl !== previewUrl);
        });
    };

    const previewFile = (previewUrl: string) => {
        window.open(previewUrl, "_blank");
    };

    return (
        <div className="mt-4 w-full">
            <p className="pb-1.5 text-[13px] font-medium text-[#0F172A]">첨부</p>
            <label className="flex h-[90px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed border-[#D7E8DB] bg-[#FAFBFC] text-center">
                <Upload className="size-[18px] text-[#64748B]" strokeWidth={1.5} />
                <span className="text-[12px] font-medium text-[#0F172A]">
                    사진·파일을 끌어다 놓거나 클릭해 첨부
                </span>
                <span className="text-[11px] text-[#64748B]">
                    PDF, 이미지, 문서 · 개당 최대 20MB
                </span>
                <input
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    type="file"
                />
            </label>

            {attachedFiles.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                    {attachedFiles.map(({ file, previewUrl }) => (
                        <div
                            className="flex h-[50px] w-full items-center gap-2.5 rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] px-3"
                            key={previewUrl}
                        >
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-[#EEF2FF] text-[9px] font-bold text-[#3B4A66]">
                                {getFileExtension(file.name)}
                            </span>
                            <span className="w-full min-w-0">
                                <strong className="block truncate text-[13px] font-normal text-[#0F172A]">
                                    {file.name}
                                </strong>
                                <span className="block text-[11px] text-[#64748B]">
                                    {formatFileSize(file.size)}
                                </span>
                            </span>
                            <button
                                className="shrink-0 text-[12px] text-[#64748B] hover:cursor-pointer"
                                onClick={() => previewFile(previewUrl)}
                                type="button"
                            >
                                미리보기
                            </button>
                            <button
                                aria-label={`${file.name} 삭제`}
                                className="shrink-0 text-[#C0C8D0] hover:cursor-pointer"
                                onClick={() => removeFile(previewUrl)}
                                type="button"
                            >
                                <X className="size-3.5" strokeWidth={1.5} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
