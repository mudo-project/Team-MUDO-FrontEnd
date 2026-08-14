"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getSharedFolderRootStatusAction, recreateSharedFolderRootAction } from "../actions";
import SharedFolderCreateGoogleModal from "./SharedFolderCreateGoogleModal";
import SharedFolderCreateNewFolderModal from "./SharedFolderCreateNewFolderModal";
import SharedFolderDeleteCheckModal from "./SharedFolderDeleteCheckModal";
import SharedFolderEditNameModal from "./SharedFolderEditNameModal";
import SharedFolderList from "./SharedFolderList";
import SharedFolderListHeader from "./SharedFolderListHeader";
import SharedFolderMoveModal from "./SharedFolderMoveModal";
import SharedFolderOpenNewTabModal from "./SharedFolderOpenNewTabModal";
import SharedFolderPath from "./SharedFolderPath";
import SharedFolderToolbar from "./SharedFolderToolbar";
import type { SharedFolderCreateOption } from "./SharedFolderCreateMenu";

type SharedFolderFilter = "ALL" | "FOLDER" | "FILE";
type SharedFolderGoogleFileType = Extract<SharedFolderCreateOption, "GOOGLE_DOCS" | "GOOGLE_SHEETS" | "GOOGLE_SLIDES">;

const SHARED_FOLDER_ITEMS: SharedFolderItemData[] = [
  { id: 1, parentId: null, kind: "FOLDER", name: "공지사항212", modifierName: "김서준", modifiedAt: "2026.08.13 18:00", size: "-" },
  { id: 2, parentId: null, kind: "FOLDER", name: "상담기록", modifierName: "김서준", modifiedAt: "2026.08.10 09:00", size: "-" },
  { id: 3, parentId: null, kind: "FOLDER", name: "수업자료", modifierName: "이수민", modifiedAt: "2026.08.11 09:00", size: "-" },
  { id: 4, parentId: null, kind: "FOLDER", name: "행정서류", modifierName: "박지현", modifiedAt: "2026.08.09 09:00", size: "-" },
  { id: 5, parentId: null, kind: "FILE", fileType: "UPLOADED", name: "2026 학사일정.pdf", modifierName: "박지현", modifiedAt: "2026.08.08 09:00", size: "1.2MB" },
  { id: 6, parentId: null, kind: "FILE", fileType: "GOOGLE_DOCS", name: "구글 독스", modifierName: "김서준", modifiedAt: "2026.08.13 17:57", size: "-" },
  { id: 7, parentId: null, kind: "FILE", fileType: "GOOGLE_SHEETS", name: "구글 시트", modifierName: "김서준", modifiedAt: "2026.08.13 17:58", size: "-" },
  { id: 8, parentId: null, kind: "FILE", fileType: "GOOGLE_SHEETS", name: "출석부", modifierName: "김서준", modifiedAt: "2026.08.13 18:05", size: "-" },
  { id: 9, parentId: null, kind: "FILE", fileType: "GOOGLE_SLIDES", name: "학원 소개자료", modifierName: "김서준", modifiedAt: "2026.08.07 09:00", size: "-" },
];

function getDescendantIds(folderId: number, items: SharedFolderItemData[]): number[] {
  const childIds = items.filter((item) => item.parentId === folderId).map((item) => item.id);
  return childIds.flatMap((childId) => [childId, ...getDescendantIds(childId, items)]);
}

export default function SharedFolderBoard() {
  const [rootStatus, setRootStatus] = useState<"loading" | "ready" | "not-ready">("loading");
  const [isRecreatingRoot, setIsRecreatingRoot] = useState(false);
  const [recreateRootError, setRecreateRootError] = useState<string | null>(null);

  const [items, setItems] = useState(SHARED_FOLDER_ITEMS);
  const [filter, setFilter] = useState<SharedFolderFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [openItemMenuId, setOpenItemMenuId] = useState<number | null>(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [googleFileType, setGoogleFileType] = useState<SharedFolderGoogleFileType | null>(null);
  const [newTabFileName, setNewTabFileName] = useState<string | null>(null);
  const [renamingItemId, setRenamingItemId] = useState<number | null>(null);
  const [movingItemId, setMovingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const nextItemId = useRef(Math.max(...SHARED_FOLDER_ITEMS.map((item) => item.id)) + 1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let ignore = false;

    getSharedFolderRootStatusAction()
      .then((data) => {
        if (!ignore) setRootStatus(data.ready ? "ready" : "not-ready");
      })
      .catch(() => {
        if (!ignore) setRootStatus("not-ready");
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRecreateRoot = async () => {
    setIsRecreatingRoot(true);
    setRecreateRootError(null);

    try {
      const result = await recreateSharedFolderRootAction();

      if (result.success) {
        setRootStatus("ready");
      } else {
        setRecreateRootError(result.message);
      }
    } finally {
      setIsRecreatingRoot(false);
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (!event.target.closest("[data-shared-folder-create-control]")) {
        setIsCreateMenuOpen(false);
      }

      if (!event.target.closest("[data-shared-folder-item-menu-control]")) {
        setOpenItemMenuId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const currentFolderItems = useMemo(
    () => items.filter((item) => item.parentId === currentFolderId),
    [currentFolderId, items],
  );

  const filteredItems = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return currentFolderItems.filter((item) => {
      const matchesFilter = filter === "ALL" || item.kind === filter;

      if (!matchesFilter) {
        return false;
      }

      return normalizedSearchQuery.length === 0
        ? true
        : item.kind === "FILE" && item.name.toLowerCase().includes(normalizedSearchQuery);
    });
  }, [currentFolderItems, filter, searchQuery]);

  const createItem = (item: Omit<SharedFolderItemData, "id">) => {
    const itemId = nextItemId.current++;
    setItems((currentItems) => [...currentItems, { ...item, id: itemId }]);
    return itemId;
  };

  const currentPath = useMemo(() => {
    const path: SharedFolderItemData[] = [];
    let folderId = currentFolderId;

    while (folderId !== null) {
      const folder = items.find((item) => item.id === folderId && item.kind === "FOLDER");
      if (!folder) break;
      path.unshift(folder);
      folderId = folder.parentId;
    }

    return path;
  }, [currentFolderId, items]);

  const getModifiedAt = () => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");

    return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const getFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const handleFilterChange = (nextFilter: SharedFolderFilter) => {
    setFilter(nextFilter);
    setOpenItemMenuId(null);
  };

  const handleSearchQueryChange = (nextSearchQuery: string) => {
    setSearchQuery(nextSearchQuery);
    setOpenItemMenuId(null);
  };

  const handleCreateMenuToggle = () => {
    setIsCreateMenuOpen((current) => !current);
    setOpenItemMenuId(null);
  };

  const handleItemMenuToggle = (itemId: number) => {
    setOpenItemMenuId((current) => (current === itemId ? null : itemId));
    setIsCreateMenuOpen(false);
  };

  const handleCreateMenuSelect = (option: SharedFolderCreateOption) => {
    setIsCreateMenuOpen(false);

    if (option === "FOLDER") {
      setIsNewFolderModalOpen(true);
      return;
    }

    if (option !== "UPLOAD") {
      setGoogleFileType(option);
    }
  };

  const handleGoogleFileCreate = (fileName: string) => {
    if (!googleFileType) {
      return;
    }

    createItem({
      parentId: currentFolderId,
      kind: "FILE",
      fileType: googleFileType,
      name: fileName,
      modifierName: "김서준",
      modifiedAt: getModifiedAt(),
      size: "-",
    });
    setGoogleFileType(null);
    setNewTabFileName(fileName);
  };

  const handleNewFolderCreate = (folderName: string) => {
    const folderId = createItem({
      parentId: currentFolderId,
      kind: "FOLDER",
      name: folderName,
      modifierName: "김서준",
      modifiedAt: getModifiedAt(),
      size: "-",
    });
    setIsNewFolderModalOpen(false);
    setCurrentFolderId(folderId);
    setFilter("ALL");
    setSearchQuery("");
  };

  const handleFileSelect = (file: File) => {
    createItem({
      parentId: currentFolderId,
      kind: "FILE",
      fileType: "UPLOADED",
      name: file.name,
      modifierName: "김서준",
      modifiedAt: getModifiedAt(),
      size: getFileSize(file.size),
    });
  };

  const handleRename = (name: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === renamingItemId ? { ...item, name, modifiedAt: getModifiedAt() } : item,
      ),
    );
    setRenamingItemId(null);
  };

  const handleFolderOpen = (folderId: number) => {
    setCurrentFolderId(folderId);
    setFilter("ALL");
    setSearchQuery("");
    setOpenItemMenuId(null);
  };

  const handleMove = (destinationFolderId: number | null) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === movingItemId ? { ...item, parentId: destinationFolderId, modifiedAt: getModifiedAt() } : item,
      ),
    );
    setMovingItemId(null);
  };

  const handleDelete = () => {
    if (deletingItemId === null) return;

    const deletingItem = items.find((item) => item.id === deletingItemId);
    const deletingIds = new Set([
      deletingItemId,
      ...(deletingItem?.kind === "FOLDER" ? getDescendantIds(deletingItemId, items) : []),
    ]);
    setItems((currentItems) => currentItems.filter((item) => !deletingIds.has(item.id)));
    setDeletingItemId(null);
  };

  const renamingItem = items.find((item) => item.id === renamingItemId);
  const movingItem = items.find((item) => item.id === movingItemId);
  const deletingItem = items.find((item) => item.id === deletingItemId);
  const movingItemDescendantIds = movingItem?.kind === "FOLDER" ? getDescendantIds(movingItem.id, items) : [];
  const movableFolders = items.filter(
    (item) => item.kind === "FOLDER" && item.id !== movingItemId && !movingItemDescendantIds.includes(item.id),
  );
  const deletingItemDescendantCount = deletingItem?.kind === "FOLDER" ? getDescendantIds(deletingItem.id, items).length : 0;

  if (rootStatus === "loading") {
    return (
      <main className="mx-auto flex h-[calc(100dvh-3.25rem)] w-full max-w-[1200px] items-center justify-center px-5 py-6">
        <p className="text-[13px] text-[#94A3B8]">공유폴더를 불러오는 중...</p>
      </main>
    );
  }

  if (rootStatus === "not-ready") {
    return (
      <main className="mx-auto flex h-[calc(100dvh-3.25rem)] w-full max-w-[1200px] flex-col items-center justify-center gap-3 px-5 py-6 text-center">
        <p className="text-[13px] font-medium text-[#0F172A]">공유폴더를 사용할 수 없습니다.</p>
        <p className="text-[12px] text-[#94A3B8]">공유파일 시스템 루트가 아직 생성되지 않았거나 사용할 수 없는 상태입니다.</p>
        {recreateRootError && <p className="text-[12px] text-[#C65A50]">{recreateRootError}</p>}
        <button
          className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isRecreatingRoot}
          type="button"
          onClick={handleRecreateRoot}
        >
          {isRecreatingRoot ? "다시 만드는 중..." : "다시 만들기"}
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[calc(100dvh-3.25rem)] min-h-0 w-full max-w-[1200px] flex-col overflow-hidden px-5 py-6">
      <SharedFolderToolbar
        filter={filter}
        isCreateMenuOpen={isCreateMenuOpen}
        searchQuery={searchQuery}
        onCreateMenuSelect={handleCreateMenuSelect}
        onCreateMenuToggle={handleCreateMenuToggle}
        onFileUploadRequest={() => fileInputRef.current?.click()}
        onFilterChange={handleFilterChange}
        onSearchQueryChange={handleSearchQueryChange}
      />

      <section aria-label="공유폴더 목록" className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
        <SharedFolderPath
          path={currentPath}
          onNavigate={(folderId) => {
            setCurrentFolderId(folderId);
            setFilter("ALL");
            setSearchQuery("");
          }}
        />
        <SharedFolderListHeader />
        <SharedFolderList
          items={filteredItems}
          isFolderEmpty={currentFolderItems.length === 0}
          openItemMenuId={openItemMenuId}
          onDelete={(itemId) => {
            setOpenItemMenuId(null);
            setDeletingItemId(itemId);
          }}
          onFileUploadRequest={() => fileInputRef.current?.click()}
          onFolderCreateRequest={() => setIsNewFolderModalOpen(true)}
          onFolderOpen={handleFolderOpen}
          onItemMove={(itemId) => {
            setOpenItemMenuId(null);
            setMovingItemId(itemId);
          }}
          onItemRename={(itemId) => {
            setOpenItemMenuId(null);
            setRenamingItemId(itemId);
          }}
          onItemMenuSelect={() => setOpenItemMenuId(null)}
          onItemMenuToggle={handleItemMenuToggle}
        />
      </section>

      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            handleFileSelect(file);
          }

          event.target.value = "";
        }}
      />

      {isNewFolderModalOpen && (
        <SharedFolderCreateNewFolderModal
          currentPath={["공유파일 루트", ...currentPath.map((folder) => folder.name)].join(" / ")}
          onClose={() => setIsNewFolderModalOpen(false)}
          onCreate={handleNewFolderCreate}
        />
      )}

      {googleFileType && (
        <SharedFolderCreateGoogleModal
          fileType={googleFileType}
          onClose={() => setGoogleFileType(null)}
          onCreate={handleGoogleFileCreate}
        />
      )}

      {newTabFileName && (
        <SharedFolderOpenNewTabModal
          fileName={newTabFileName}
          onClose={() => setNewTabFileName(null)}
          onConfirm={() => setNewTabFileName(null)}
        />
      )}

      {renamingItem && (
        <SharedFolderEditNameModal
          currentName={renamingItem.name}
          onClose={() => setRenamingItemId(null)}
          onRename={handleRename}
        />
      )}

      {movingItem && (
        <SharedFolderMoveModal
          folders={movableFolders}
          item={movingItem}
          onClose={() => setMovingItemId(null)}
          onMove={handleMove}
        />
      )}

      {deletingItem && (
        <SharedFolderDeleteCheckModal
          descendantCount={deletingItemDescendantCount}
          item={deletingItem}
          onClose={() => setDeletingItemId(null)}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
