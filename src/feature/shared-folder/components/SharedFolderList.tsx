import SharedFolderItem from "./SharedFolderItem";

type SharedFolderListProps = {
  items: SharedFolderItemData[];
};

export default function SharedFolderList({ items }: SharedFolderListProps) {
  if (items.length === 0) {
    return <p className="px-4 py-10 text-center text-[12px] text-[#94A3B8]">파일이 없습니다.</p>;
  }

  return (
    <div>
      {items.map((item) => (
        <SharedFolderItem key={item.id} item={item} />
      ))}
    </div>
  );
}
