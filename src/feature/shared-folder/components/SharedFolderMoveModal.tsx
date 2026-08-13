"use client";

import { useState } from "react";
import { Folder, House } from "lucide-react";

type SharedFolderMoveModalProps = {
  folders: SharedFolderItemData[];
  item: SharedFolderItemData;
  onClose: () => void;
  onMove: (destinationFolderId: number | null) => void;
};

type FolderRow = {
  depth: number;
  folder: SharedFolderItemData;
};

function flattenFolders(folders: SharedFolderItemData[], parentId: number | null, depth = 0): FolderRow[] {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .flatMap((folder) => [
      { depth, folder },
      ...flattenFolders(folders, folder.id, depth + 1),
    ]);
}

export default function SharedFolderMoveModal({ folders, item, onClose, onMove }: SharedFolderMoveModalProps) {
  const [destinationFolderId, setDestinationFolderId] = useState<number | null>(item.parentId);
  const folderRows = flattenFolders(folders, null);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" onClick={onClose}>
      <section
        aria-labelledby="shared-folder-move-title"
        className="w-[440px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="shared-folder-move-title" className="text-[16px] font-bold text-[#0F172A]">이동</h2>
        <p className="mt-1 text-[12px] text-[#94A3B8]">
          &quot;{item.name}&quot;을(를) 이동할 위치를 선택하세요.
        </p>

        <div className="mt-4 max-h-[220px] overflow-y-auto rounded-lg border border-[#DCE9DF] p-1 text-[12px]">
          <button
            aria-pressed={destinationFolderId === null}
            className={`flex h-9 w-full items-center gap-2 rounded-md px-3 text-left ${destinationFolderId === null ? "bg-[#E8F2EA] text-[#245B35]" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
            type="button"
            onClick={() => setDestinationFolderId(null)}
          >
            <House className="size-3.5" strokeWidth={1.8} />
            공유파일 루트
            {item.parentId === null && <span className="text-[10px] text-[#94A3B8]">(현재 위치)</span>}
          </button>

          {folderRows.map(({ depth, folder }) => (
            <button
              key={folder.id}
              aria-pressed={destinationFolderId === folder.id}
              className={`flex h-9 w-full items-center gap-2 rounded-md pr-3 text-left ${destinationFolderId === folder.id ? "bg-[#E8F2EA] text-[#245B35]" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
              style={{ paddingLeft: `${12 + depth * 16}px` }}
              type="button"
              onClick={() => setDestinationFolderId(folder.id)}
            >
              <Folder className="size-3.5" strokeWidth={1.8} />
              <span className="truncate">{folder.name}</span>
              {item.parentId === folder.id && <span className="text-[10px] text-[#94A3B8]">(현재 위치)</span>}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#6B7280]" type="button" onClick={onClose}>
            취소
          </button>
          <button
            className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={destinationFolderId === item.parentId}
            type="button"
            onClick={() => onMove(destinationFolderId)}
          >
            이동
          </button>
        </div>
      </section>
    </div>
  );
}
