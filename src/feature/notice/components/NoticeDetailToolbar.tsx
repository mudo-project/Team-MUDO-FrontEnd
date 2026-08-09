"use client";

import { Pin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteNoticeAction, pinNoticeAction, unpinNoticeAction } from "../actions";
import NoticeEditForm from "./NoticeEditForm";

export default function NoticeDetailToolbar({ notice }: { notice: NoticeDetailData }) {
    const router = useRouter();
    const [pinned, setPinned] = useState(notice.pinned);
    const [syncedPinned, setSyncedPinned] = useState(notice.pinned);
    const [isPinning, startPinTransition] = useTransition();
    const [isDeleting, startDeleteTransition] = useTransition();

    if (notice.pinned !== syncedPinned) {
        setSyncedPinned(notice.pinned);
        setPinned(notice.pinned);
    }

    const togglePinned = () => {
        startPinTransition(async () => {
            const result = pinned ? await unpinNoticeAction(notice.id) : await pinNoticeAction(notice.id);

            if (result.success) {
                setPinned((prev) => !prev);
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        });
    };

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const result = await deleteNoticeAction(notice.id);

            if (result.success) {
                toast.success(result.message);
                router.push("/notice");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="flex min-h-[25px] items-center">
            {pinned && (
                <span className="flex items-center gap-1 rounded-full bg-[#EEF7F0] px-2.5 py-1 text-[11px] font-semibold text-[#558563]">
                    <Pin className="size-3" strokeWidth={2} />
                    고정
                </span>
            )}
            <div className="ml-auto flex items-center gap-3 text-[#94A3B8]">
                <button
                    aria-label={pinned ? "상단 고정 해제" : "상단 고정"}
                    aria-pressed={pinned}
                    className={`hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${pinned ? "text-[#4D9560]" : ""}`}
                    disabled={isPinning}
                    onClick={togglePinned}
                    type="button"
                >
                    <Pin className="size-4" strokeWidth={1.6} />
                </button>
                <NoticeEditForm notice={notice} />
                <button
                    aria-label="공지 삭제"
                    className="hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    type="button"
                >
                    <Trash2 className="size-4" strokeWidth={1.6} />
                </button>
            </div>
        </div>
    );
}
