"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Folder } from "lucide-react";
import { getSharedFolderContentListAction } from "../actions";
import { getSharedFolderItemKind } from "../sharedFolderFormat";

type SharedFolderMoveModalProps = {
  isSubmitting: boolean;
  item: SharedFolderDriveItemData;
  rootId: string | null;
  onClose: () => void;
  onMove: (destinationFolderId: string) => void;
};

type BrowsePathEntry = {
  id: string;
  name: string;
};

export default function SharedFolderMoveModal({ isSubmitting, item, rootId, onClose, onMove }: SharedFolderMoveModalProps) {
  const [browsePath, setBrowsePath] = useState<BrowsePathEntry[]>([]);
  const [folders, setFolders] = useState<SharedFolderDriveItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const browsingFolderId = browsePath.at(-1)?.id;

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await getSharedFolderContentListAction({ parentId: browsingFolderId, size: 100 });

        if (!ignore) {
          setFolders(
            data.items.filter((candidate) => candidate.id !== item.id && getSharedFolderItemKind(candidate) === "FOLDER"),
          );
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error instanceof Error ? error.message : "폴더 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [browsingFolderId, item.id]);

  const destinationName = browsePath.at(-1)?.name ?? "공유파일 루트";
  const destinationFolderId = browsingFolderId ?? rootId ?? undefined;
  const canMoveHere = destinationFolderId !== undefined;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" onClick={onClose}>
      <section
        aria-labelledby="shared-folder-move-title"
        className="w-[440px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="shared-folder-move-title" className="text-[16px] font-bold text-[#0F172A]">이동</h2>
        <p className="mt-1 text-[12px] text-[#94A3B8]">
          &quot;{item.name}&quot;을(를) 이동할 폴더로 들어가서 선택하세요.
        </p>

        <nav aria-label="이동 위치 탐색" className="mt-3 flex items-center gap-1 overflow-x-auto text-[11px] text-[#64748B]">
          <button className="shrink-0" type="button" onClick={() => setBrowsePath([])}>
            공유파일 루트
          </button>
          {browsePath.map((entry, index) => (
            <span key={entry.id} className="flex shrink-0 items-center gap-1">
              <ChevronRight className="size-3" strokeWidth={1.8} />
              <button type="button" onClick={() => setBrowsePath(browsePath.slice(0, index + 1))}>
                {entry.name}
              </button>
            </span>
          ))}
        </nav>

        <div className="mt-3 max-h-[220px] overflow-y-auto rounded-lg border border-[#DCE9DF] p-1 text-[12px]">
          {isLoading && <p className="px-3 py-4 text-center text-[#94A3B8]">불러오는 중...</p>}
          {!isLoading && loadError && <p className="px-3 py-4 text-center text-[#C65A50]">{loadError}</p>}
          {!isLoading && !loadError && folders.length === 0 && (
            <p className="px-3 py-4 text-center text-[#94A3B8]">하위 폴더가 없습니다.</p>
          )}
          {!isLoading && !loadError && folders.map((folder) => (
            <button
              key={folder.id}
              className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-[#64748B] hover:bg-[#F8FAFC]"
              type="button"
              onClick={() => setBrowsePath([...browsePath, { id: folder.id, name: folder.name }])}
            >
              <Folder className="size-3.5" strokeWidth={1.8} />
              <span className="min-w-0 flex-1 truncate">{folder.name}</span>
              <ChevronRight className="size-3.5 shrink-0" strokeWidth={1.8} />
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[11px] text-[#94A3B8]">이동 위치: {destinationName}</p>
          <div className="flex shrink-0 gap-2">
            <button className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#6B7280]" type="button" onClick={onClose}>
              취소
            </button>
            <button
              className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canMoveHere || isSubmitting}
              type="button"
              onClick={() => destinationFolderId && onMove(destinationFolderId)}
            >
              {isSubmitting ? "이동 중..." : "이동"}
            </button>
          </div>
        </div>
        {!canMoveHere && (
          <p className="mt-1.5 text-[11px] text-[#94A3B8]">이동할 하위 폴더로 들어간 뒤 이동할 수 있습니다.</p>
        )}
      </section>
    </div>
  );
}
