"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createSharedFolderFolderAction,
  getSharedFolderContentListAction,
  getSharedFolderRootStatusAction,
  recreateSharedFolderRootAction,
} from "../actions";
import { getSharedFolderItemKind } from "../sharedFolderFormat";
import SharedFolderCreateNewFolderModal from "./SharedFolderCreateNewFolderModal";
import SharedFolderList from "./SharedFolderList";
import SharedFolderListHeader from "./SharedFolderListHeader";
import SharedFolderPath from "./SharedFolderPath";
import SharedFolderToolbar from "./SharedFolderToolbar";
import type { SharedFolderCreateOption } from "./SharedFolderCreateMenu";

type SharedFolderFilter = "ALL" | "FOLDER" | "FILE";
type SharedFolderPathEntry = { id: string; name: string };

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
        onFileUploadRequest={() => {}}
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
            onDelete={() => setOpenItemMenuId(null)}
            onFileUploadRequest={() => {}}
            onFolderCreateRequest={() => setIsNewFolderModalOpen(true)}
            onFolderOpen={handleFolderOpen}
            onItemMenuSelect={() => setOpenItemMenuId(null)}
            onItemMenuToggle={handleItemMenuToggle}
            onItemMove={() => setOpenItemMenuId(null)}
            onItemRename={() => setOpenItemMenuId(null)}
            onLoadMore={handleLoadMore}
          />
        )}
      </section>

      {isNewFolderModalOpen && (
        <SharedFolderCreateNewFolderModal
          currentPath={["공유파일 루트", ...path.map((folder) => folder.name)].join(" / ")}
          isSubmitting={isSubmitting}
          onClose={() => setIsNewFolderModalOpen(false)}
          onCreate={handleNewFolderCreate}
        />
      )}
    </main>
  );
}
