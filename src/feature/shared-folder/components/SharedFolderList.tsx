import SharedFolderItem from "./SharedFolderItem";

type SharedFolderListProps = {
  items: SharedFolderDriveItemData[];
  isFolderEmpty: boolean;
  hasNext: boolean;
  isLoadingMore: boolean;
  openItemMenuId: string | null;
  onDelete: (item: SharedFolderDriveItemData) => void;
  onFileUploadRequest: () => void;
  onFolderCreateRequest: () => void;
  onFolderOpen: (item: SharedFolderDriveItemData) => void;
  onItemMove: (item: SharedFolderDriveItemData) => void;
  onItemRename: (item: SharedFolderDriveItemData) => void;
  onItemMenuSelect: () => void;
  onItemMenuToggle: (itemId: string) => void;
  onLoadMore: () => void;
};

export default function SharedFolderList({
  items,
  isFolderEmpty,
  hasNext,
  isLoadingMore,
  openItemMenuId,
  onDelete,
  onFileUploadRequest,
  onFolderCreateRequest,
  onFolderOpen,
  onItemMove,
  onItemRename,
  onItemMenuSelect,
  onItemMenuToggle,
  onLoadMore,
}: SharedFolderListProps) {
  if (items.length === 0) {
    if (!isFolderEmpty) {
      return <p className="flex min-h-0 flex-1 items-center justify-center px-4 py-10 text-center text-[12px] text-[#94A3B8]">파일이 없습니다.</p>;
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10 text-center">
        <span aria-hidden className="text-[28px]">📫</span>
        <strong className="mt-3 text-[13px] text-[#0F172A]">이 폴더에 파일이 없습니다.</strong>
        <p className="mt-1 text-[12px] text-[#94A3B8]">파일을 업로드하거나 새 폴더를 만드세요.</p>
        <div className="mt-4 flex gap-2">
          <button className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white" type="button" onClick={onFileUploadRequest}>
            파일 업로드
          </button>
          <button className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#425466]" type="button" onClick={onFolderCreateRequest}>
            폴더 만들기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {items.map((item) => (
        <SharedFolderItem
          key={item.id}
          isMenuOpen={openItemMenuId === item.id}
          item={item}
          onDelete={() => onDelete(item)}
          onFolderOpen={() => onFolderOpen(item)}
          onMenuSelect={onItemMenuSelect}
          onMenuToggle={() => onItemMenuToggle(item.id)}
          onMove={() => onItemMove(item)}
          onRename={() => onItemRename(item)}
        />
      ))}
      {hasNext && (
        <div className="flex justify-center border-t border-[#F1F5F1] p-3">
          <button
            className="h-8 rounded-md border border-[#D7E8DB] bg-white px-4 text-[11px] text-[#425466] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoadingMore}
            type="button"
            onClick={onLoadMore}
          >
            {isLoadingMore ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
