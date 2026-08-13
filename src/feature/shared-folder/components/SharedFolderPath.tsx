type SharedFolderPathProps = {
  path: SharedFolderItemData[];
  onNavigate: (folderId: number | null) => void;
};

export default function SharedFolderPath({ path, onNavigate }: SharedFolderPathProps) {
  return (
    <nav aria-label="공유폴더 경로" className="flex items-center gap-2 border-b border-[#E6EBE7] px-4 py-2.5 text-[12px] font-medium">
      <button className="text-[#2F6B42]" type="button" onClick={() => onNavigate(null)}>공유파일 루트</button>
      {path.map((folder) => (
        <span key={folder.id} className="flex min-w-0 items-center gap-2">
          <span className="text-[#CBD5E1]">/</span>
          <button className="max-w-[180px] truncate text-[#0F172A]" type="button" onClick={() => onNavigate(folder.id)}>
            {folder.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
