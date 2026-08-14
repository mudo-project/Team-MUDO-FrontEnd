"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  createSharedFolderFolderAction,
  createSharedFolderGoogleFileAction,
  deleteSharedFolderContentAction,
  getSharedFolderContentListAction,
  getSharedFolderRootStatusAction,
  recreateSharedFolderRootAction,
  updateSharedFolderContentAction,
  uploadSharedFolderFileAction,
} from "../actions";
import { getSharedFolderItemKind } from "../sharedFolderFormat";
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
type SharedFolderGoogleCreateOption = Extract<SharedFolderCreateOption, "GOOGLE_DOCS" | "GOOGLE_SHEETS" | "GOOGLE_SLIDES">;
type SharedFolderPathEntry = { id: string; name: string };

const CREATE_OPTION_TO_GOOGLE_DOC_TYPE: Record<SharedFolderGoogleCreateOption, SharedFolderGoogleDocType> = {
  GOOGLE_DOCS: "DOCS",
  GOOGLE_SHEETS: "SHEETS",
  GOOGLE_SLIDES: "SLIDES",
};

export default function SharedFolderBoard() {
  const [rootStatus, setRootStatus] = useState<"loading" | "ready" | "not-ready">("loading");
  const [isRecreatingRoot, setIsRecreatingRoot] = useState(false);
  const [recreateRootError, setRecreateRootError] = useState<string | null>(null);

  const [path, setPath] = useState<SharedFolderPathEntry[]>([]);
  const [items, setItems] = useState<SharedFolderDriveItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filter, setFilter] = useState<SharedFolderFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [openItemMenuId, setOpenItemMenuId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [googleCreateOption, setGoogleCreateOption] = useState<SharedFolderGoogleCreateOption | null>(null);
  const [newTabFile, setNewTabFile] = useState<{ name: string; viewUrl: string } | null>(null);
  const [renamingItem, setRenamingItem] = useState<SharedFolderDriveItemData | null>(null);
  const [movingItem, setMovingItem] = useState<SharedFolderDriveItemData | null>(null);
  const [deletingItem, setDeletingItem] = useState<SharedFolderDriveItemData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentParentId = path.at(-1)?.id;

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

  // 폴더 이동(마운트·경로 변경) 시 자동 조회 — effect 안에서 곧바로 setState하지 않도록 then/catch/finally 안에서만 상태를 갱신한다.
  useEffect(() => {
    if (rootStatus !== "ready") return;

    let ignore = false;

    getSharedFolderContentListAction({ parentId: currentParentId, size: 100 })
      .then((data) => {
        if (ignore) return;
        setItems(data.items);
        setHasNext(data.hasNext);
        setNextCursor(data.nextCursor);
        setLoadError(null);
      })
      .catch((error) => {
        if (ignore) return;
        setLoadError(error instanceof Error ? error.message : "공유폴더 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [rootStatus, currentParentId]);

  // 생성·수정 후 같은 경로를 다시 조회할 때 사용(이벤트 핸들러에서만 호출).
  const refreshItems = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getSharedFolderContentListAction({ parentId: currentParentId, size: 100 });
      setItems(data.items);
      setHasNext(data.hasNext);
      setNextCursor(data.nextCursor);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "공유폴더 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentParentId]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;

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

  const filteredItems = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const kind = getSharedFolderItemKind(item);
      const matchesFilter = filter === "ALL" || kind === filter;

      if (!matchesFilter) {
        return false;
      }

      return normalizedSearchQuery.length === 0
        ? true
        : kind === "FILE" && item.name.toLowerCase().includes(normalizedSearchQuery);
    });
  }, [items, filter, searchQuery]);

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

  const handleCreateMenuSelect = (option: SharedFolderCreateOption) => {
    setIsCreateMenuOpen(false);

    if (option === "FOLDER") {
      setIsNewFolderModalOpen(true);
      return;
    }

    if (option === "GOOGLE_DOCS" || option === "GOOGLE_SHEETS" || option === "GOOGLE_SLIDES") {
      setGoogleCreateOption(option);
    }
  };

  const handleGoogleFileCreate = async (fileName: string) => {
    if (!googleCreateOption) return;

    setIsSubmitting(true);

    try {
      const result = await createSharedFolderGoogleFileAction({
        parentId: currentParentId,
        name: fileName,
        type: CREATE_OPTION_TO_GOOGLE_DOC_TYPE[googleCreateOption],
      });

      if (result.success && result.data) {
        toast.success(result.message);
        setGoogleCreateOption(null);
        setNewTabFile({ name: result.data.name, viewUrl: result.data.viewUrl });
        await refreshItems();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    const result = await uploadSharedFolderFileAction(currentParentId, file);

    if (result.success) {
      toast.success(result.message);
      await refreshItems();
    } else {
      toast.error(result.message);
    }
  };

  const handleNewFolderCreate = async (folderName: string) => {
    setIsSubmitting(true);

    try {
      const result = await createSharedFolderFolderAction({ parentId: currentParentId, name: folderName });

      if (result.success && result.data) {
        toast.success(result.message);
        setIsNewFolderModalOpen(false);
        setPath((current) => [...current, { id: result.data!.id, name: result.data!.name }]);
        setFilter("ALL");
        setSearchQuery("");
        setIsLoading(true);
        setItems([]);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemMenuToggle = (itemId: string) => {
    setOpenItemMenuId((current) => (current === itemId ? null : itemId));
    setIsCreateMenuOpen(false);
  };

  const handleRenameRequest = (item: SharedFolderDriveItemData) => {
    setOpenItemMenuId(null);
    setRenamingItem(item);
  };

  const handleRename = async (name: string) => {
    if (!renamingItem) return;

    setIsSubmitting(true);

    try {
      const result = await updateSharedFolderContentAction(renamingItem.id, { name });

      if (result.success) {
        toast.success(result.message);
        setRenamingItem(null);
        await refreshItems();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveRequest = (item: SharedFolderDriveItemData) => {
    setOpenItemMenuId(null);
    setMovingItem(item);
  };

  const handleMove = async (destinationFolderId: string) => {
    if (!movingItem) return;

    setIsSubmitting(true);

    try {
      const result = await updateSharedFolderContentAction(movingItem.id, { parentId: destinationFolderId });

      if (result.success) {
        toast.success(result.message);
        setMovingItem(null);
        await refreshItems();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = (item: SharedFolderDriveItemData) => {
    setOpenItemMenuId(null);
    setDeletingItem(item);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setIsSubmitting(true);

    try {
      const result = await deleteSharedFolderContentAction(deletingItem.id);

      if (result.success) {
        toast.success(result.message);
        setDeletingItem(null);
        await refreshItems();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFolderOpen = (item: SharedFolderDriveItemData) => {
    setPath((current) => [...current, { id: item.id, name: item.name }]);
    setFilter("ALL");
    setSearchQuery("");
    setOpenItemMenuId(null);
    setIsLoading(true);
    setItems([]);
  };

  const handlePathNavigate = (index: number) => {
    setPath((current) => (index === -1 ? [] : current.slice(0, index + 1)));
    setFilter("ALL");
    setSearchQuery("");
    setIsLoading(true);
    setItems([]);
  };

  const handleLoadMore = async () => {
    if (!nextCursor) return;

    setIsLoadingMore(true);

    try {
      const data = await getSharedFolderContentListAction({ parentId: currentParentId, size: 100, cursor: nextCursor });
      setItems((current) => [...current, ...data.items]);
      setHasNext(data.hasNext);
      setNextCursor(data.nextCursor);
    } catch {
      // 더 보기 실패는 기존 목록을 유지한 채 다시 시도할 수 있도록 조용히 무시한다.
    } finally {
      setIsLoadingMore(false);
    }
  };

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

  const isFolderEmpty = !isLoading && !loadError && items.length === 0;

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
        <SharedFolderPath path={path} onNavigate={handlePathNavigate} />
        <SharedFolderListHeader />

        {isLoading && (
          <p className="flex min-h-0 flex-1 items-center justify-center px-4 py-10 text-center text-[12px] text-[#94A3B8]">불러오는 중...</p>
        )}

        {!isLoading && loadError && (
          <p className="flex min-h-0 flex-1 items-center justify-center px-4 py-10 text-center text-[12px] text-[#C65A50]">{loadError}</p>
        )}

        {!isLoading && !loadError && (
          <SharedFolderList
            hasNext={hasNext}
            isFolderEmpty={isFolderEmpty}
            isLoadingMore={isLoadingMore}
            items={filteredItems}
            openItemMenuId={openItemMenuId}
            onDelete={handleDeleteRequest}
            onFileUploadRequest={() => fileInputRef.current?.click()}
            onFolderCreateRequest={() => setIsNewFolderModalOpen(true)}
            onFolderOpen={handleFolderOpen}
            onItemMenuSelect={() => setOpenItemMenuId(null)}
            onItemMenuToggle={handleItemMenuToggle}
            onItemMove={handleMoveRequest}
            onItemRename={handleRenameRequest}
            onLoadMore={handleLoadMore}
          />
        )}
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
          currentPath={["공유파일 루트", ...path.map((folder) => folder.name)].join(" / ")}
          isSubmitting={isSubmitting}
          onClose={() => setIsNewFolderModalOpen(false)}
          onCreate={handleNewFolderCreate}
        />
      )}

      {googleCreateOption && (
        <SharedFolderCreateGoogleModal
          fileType={googleCreateOption}
          isSubmitting={isSubmitting}
          onClose={() => setGoogleCreateOption(null)}
          onCreate={handleGoogleFileCreate}
        />
      )}

      {newTabFile && (
        <SharedFolderOpenNewTabModal
          fileName={newTabFile.name}
          viewUrl={newTabFile.viewUrl}
          onClose={() => setNewTabFile(null)}
        />
      )}

      {renamingItem && (
        <SharedFolderEditNameModal
          currentName={renamingItem.name}
          isSubmitting={isSubmitting}
          onClose={() => setRenamingItem(null)}
          onRename={handleRename}
        />
      )}

      {movingItem && (
        <SharedFolderMoveModal
          isSubmitting={isSubmitting}
          item={movingItem}
          onClose={() => setMovingItem(null)}
          onMove={handleMove}
        />
      )}

      {deletingItem && (
        <SharedFolderDeleteCheckModal
          isSubmitting={isSubmitting}
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
