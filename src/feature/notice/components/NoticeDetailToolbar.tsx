"use client";

import { Pin, Trash2 } from "lucide-react";
import { useState } from "react";
import { DummyNotice } from "@/feature/notice/dummyNotices";
import NoticeEditForm from "./NoticeEditForm";

export default function NoticeDetailToolbar({ notice }: { notice: DummyNotice }) {
    const [pinned, setPinned] = useState(!!notice.important);

    const togglePinned = () => {
        setPinned((prev) => !prev);
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
                    className={`hover:cursor-pointer ${pinned ? "text-[#4D9560]" : ""}`}
                    onClick={togglePinned}
                    type="button"
                >
                    <Pin className="size-4" strokeWidth={1.6} />
                </button>
                <NoticeEditForm notice={notice} />
                <button aria-label="공지 삭제" className="hover:cursor-pointer" type="button">
                    <Trash2 className="size-4" strokeWidth={1.6} />
                </button>
            </div>
        </div>
    );
}
