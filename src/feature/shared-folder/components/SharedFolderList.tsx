import SharedFolderItem from "./SharedFolderItem";

type SharedFolderListProps = {
  items: SharedFolderItemData[];
  isFolderEmpty: boolean;
  openItemMenuId: number | null;
  onDelete: (itemId: number) => void;
  onFileUploadRequest: () => void;
  onFolderCreateRequest: () => void;
  onFolderOpen: (folderId: number) => void;
  onItemMove: (itemId: number) => void;
  onItemRename: (itemId: number) => void;
  onItemMenuSelect: () => void;
  onItemMenuToggle: (itemId: number) => void;
};

export default function SharedFolderList({
  items,
  isFolderEmpty,
  openItemMenuId,
  onDelete,
  onFileUploadRequest,
  onFolderCreateRequest,
  onFolderOpen,
  onItemMove,
  onItemRename,
  onItemMenuSelect,
  onItemMenuToggle,
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
          onDelete={() => onDelete(item.id)}
          onFolderOpen={() => onFolderOpen(item.id)}
          onMove={() => onItemMove(item.id)}
          onRename={() => onItemRename(item.id)}
          onMenuSelect={onItemMenuSelect}
          onMenuToggle={() => onItemMenuToggle(item.id)}
        />
      ))}
    </div>
  );
}
