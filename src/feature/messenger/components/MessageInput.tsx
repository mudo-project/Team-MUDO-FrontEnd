'use client'

import { useRef, useState } from "react";
import { CheckSquare, FileText, Image as ImageIcon, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import TaskCreateModal from "./TaskCreateModal";
import { sendFileMessageAction, sendMessageAction } from "../actions";
import { getFileDownloadUrlAction } from "@/feature/file/actions";
import { uploadFiles } from "@/feature/file/uploadFiles";

type MessageInputProps = {
    roomId: number;
    onMessageSent: () => void;
    onTaskCreated: () => void;
};

export default function MessageInput({ roomId, onMessageSent, onTaskCreated }: MessageInputProps) {
    const [value, setValue] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showMenu = isMenuOpen || value.startsWith("/");

    const handleSelectTask = () => {
        setIsMenuOpen(false);
        setIsTaskCreateOpen(true);
    };

    const handleSelectPhoto = () => {
        setIsMenuOpen(false);
        photoInputRef.current?.click();
    };

    const handleSelectFile = () => {
        setIsMenuOpen(false);
        fileInputRef.current?.click();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!value.trim()) return;

        setValue("");
        await sendMessageAction(roomId, value);
        onMessageSent();
    };

    const handleFileSelected = async (
        event: React.ChangeEvent<HTMLInputElement>,
        messageType: "IMAGE" | "FILE",
    ) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        setIsUploading(true);

        try {
            const { fileIds } = await uploadFiles([file], {});
            const downloadUrl = await getFileDownloadUrlAction(fileIds[0]);

            if (!downloadUrl.success || !downloadUrl.data) {
                toast.error(downloadUrl.message);
                return;
            }

            const result = await sendFileMessageAction(roomId, messageType, downloadUrl.data.downloadUrl, file.name);

            if (result.success) {
                onMessageSent();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "파일 전송에 실패했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <form className="flex h-[70px] shrink-0 items-center gap-3 border-t border-[#D7E8DB] bg-white px-6" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="text-[#64748B] disabled:opacity-40"
                    aria-label="첨부 추가"
                    disabled={isUploading}
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <Plus className="size-4" strokeWidth={1.7} />
                </button>

                <input
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleFileSelected(event, "IMAGE")}
                    ref={photoInputRef}
                    type="file"
                />
                <input
                    className="hidden"
                    onChange={(event) => handleFileSelected(event, "FILE")}
                    ref={fileInputRef}
                    type="file"
                />

                <div className="relative min-w-0 flex-1">
                    {showMenu && (
                        <div className="absolute right-0 bottom-full left-0 mb-2 overflow-hidden rounded-[8px] border border-[#D7E8DB] bg-white shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
                            <button
                                className="flex w-full items-center gap-2.5 border-b border-[#F0F3F1] px-3 py-2 text-left hover:bg-[#F7F9F7]"
                                onClick={handleSelectTask}
                                type="button"
                            >
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#EAF5EE] text-[#2C8D50]">
                                    <CheckSquare className="size-3.5" strokeWidth={1.8} />
                                </span>
                                <span className="text-[11px] font-semibold text-[#2C8D50]">업무지시</span>
                                <span className="ml-auto truncate text-[10px] text-[#94A3B8]">채팅방에 업무 카드 등록</span>
                            </button>
                            <button
                                className="flex w-full items-center gap-2.5 border-b border-[#F0F3F1] px-3 py-2 text-left hover:bg-[#F7F9F7]"
                                onClick={handleSelectPhoto}
                                type="button"
                            >
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#F1F3F5] text-[#64748B]">
                                    <ImageIcon className="size-3.5" strokeWidth={1.8} />
                                </span>
                                <span className="text-[11px] font-medium text-[#0F172A]">사진</span>
                            </button>
                            <button
                                className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#F7F9F7]"
                                onClick={handleSelectFile}
                                type="button"
                            >
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#F1F3F5] text-[#64748B]">
                                    <FileText className="size-3.5" strokeWidth={1.8} />
                                </span>
                                <span className="text-[11px] font-medium text-[#0F172A]">파일</span>
                            </button>
                        </div>
                    )}

                    <label
                        className="sr-only"
                        htmlFor="message"
                    >
                        메시지 입력
                    </label>
                    <input
                        id="message"
                        className="h-11 w-full min-w-0 rounded-[7px] border border-[#D7E8DB] bg-white px-3 text-[11px] outline-none placeholder:text-[#94A3B8]"
                        placeholder="메시지를 입력하세요"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="flex size-9 items-center justify-center text-[#64748B]"
                    aria-label="메시지 전송"
                >
                    <Send className="size-4" strokeWidth={1.7} />
                </button>
            </form>

            {isTaskCreateOpen && (
                <TaskCreateModal
                    roomId={roomId}
                    onClose={() => setIsTaskCreateOpen(false)}
                    onCreated={onTaskCreated}
                />
            )}
        </>
    );
}
