"use client";

import { createPortal } from "react-dom";
import WorkspaceAttends from "./WorkspaceAttends";

interface WorkspaceMemberSearchResultsProps {
    anchorRect: DOMRect | null;
    error: string;
    isOpen: boolean;
    members: UserListResponse[];
    onSelect: (member: UserListResponse) => void;
    showEmptyMessage: boolean;
}

export default function WorkspaceMemberSearchResults({
    anchorRect,
    error,
    isOpen,
    members,
    onSelect,
    showEmptyMessage,
}: WorkspaceMemberSearchResultsProps) {
    if (!isOpen || !anchorRect) return null;

    return createPortal(
        <div
            className="fixed z-1001 max-h-[280px] overflow-y-auto rounded-[8px] bg-white py-1 shadow-[0_8px_16px_rgba(22,34,54,0.16)]"
            onClick={(event) => event.stopPropagation()}
            style={{ left: anchorRect.left, top: anchorRect.bottom + 2, width: anchorRect.width }}
        >
            {error && <p className="px-3 py-2.5 text-[12px] text-red-500">{error}</p>}
            {!error && showEmptyMessage && (
                <p className="px-3 py-2.5 text-[12px] text-[#64748B]">검색 결과가 없습니다.</p>
            )}
            {members.map((member) => (
                <WorkspaceAttends key={member.userId} member={member} onSelect={onSelect} />
            ))}
        </div>,
        document.body,
    );
}
