export default function SharedFolderListHeader() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_140px_110px_150px_90px_36px] gap-3 border-b border-[#E6EBE7] bg-[#F8FAFC] px-4 py-2 text-[11px] font-medium text-[#94A3B8]">
      <span>이름</span>
      <span>종류</span>
      <span>수정자</span>
      <span>수정일</span>
      <span>크기</span>
      <span aria-hidden />
    </div>
  );
}
