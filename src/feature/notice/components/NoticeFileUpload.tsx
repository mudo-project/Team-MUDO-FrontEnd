"use client";

import { Upload, X } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { formatFileSize, getFileExtension } from "@/lib/file";

type AttachedFile = {
    file: File;
    previewUrl: string;
};

export type ExistingFile = {
    id?: number;
    name: string;
    size?: string;
};

export default function NoticeFileUpload({
    initialFiles,
    disabled = false,
    onFilesChange,
    onExistingFilesChange,
}: {
    initialFiles?: ExistingFile[];
    disabled?: boolean;
    onFilesChange?: (files: File[]) => void;
    onExistingFilesChange?: (files: ExistingFile[]) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachedFilesRef = useRef<AttachedFile[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const [existingFiles, setExistingFiles] = useState<ExistingFile[]>(initialFiles ?? []);

    useEffect(() => {
        attachedFilesRef.current = attachedFiles;
        onFilesChange?.(attachedFiles.map((item) => item.file));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attachedFiles]);

    useEffect(() => {
        onExistingFilesChange?.(existingFiles);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingFiles]);

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

    const removeExistingFile = (name: string) => {
        setExistingFiles((prev) => prev.filter((item) => item.name !== name));
    };

    const previewFile = (previewUrl: string) => {
        window.open(previewUrl, "_blank");
    };

    return (
        <div className="mt-4 w-full">
            <p className="pb-1.5 text-[13px] font-medium text-[#0F172A]">첨부</p>
            <label className={`flex h-[90px] w-full flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed border-[#D7E8DB] bg-[#FAFBFC] text-center ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                <Upload className="size-[18px] text-[#64748B]" strokeWidth={1.5} />
                <span className="text-[12px] font-medium text-[#0F172A]">
                    사진·파일을 끌어다 놓거나 클릭해 첨부
                </span>
                <span className="text-[11px] text-[#64748B]">
                    PDF, 이미지, 문서 · 개당 최대 20MB
                </span>
                <input
                    className="hidden"
                    disabled={disabled}
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    type="file"
                />
            </label>

            {(existingFiles.length > 0 || attachedFiles.length > 0) && (
                <div className="mt-2 flex flex-col gap-2">
                    {existingFiles.map((file) => (
                        <div
                            className="flex h-[50px] w-full items-center gap-2.5 rounded-[8px] border border-[#D7E8DB] bg-[#FCFCFC] px-3"
                            key={file.name}
                        >
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-[#EEF2FF] text-[9px] font-bold text-[#3B4A66]">
                                {getFileExtension(file.name)}
                            </span>
                            <span className="w-full min-w-0">
                                <strong className="block truncate text-[13px] font-normal text-[#0F172A]">
                                    {file.name}
                                </strong>
                                {file.size && (
                                    <span className="block text-[11px] text-[#64748B]">
                                        {file.size}
                                    </span>
                                )}
                            </span>
                            <button
                                aria-label={`${file.name} 삭제`}
                                className="shrink-0 text-[#C0C8D0] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={disabled}
                                onClick={() => removeExistingFile(file.name)}
                                type="button"
                            >
                                <X className="size-3.5" strokeWidth={1.5} />
                            </button>
                        </div>
                    ))}
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
                                className="shrink-0 text-[#C0C8D0] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={disabled}
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
