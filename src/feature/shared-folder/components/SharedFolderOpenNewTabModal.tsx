type SharedFolderOpenNewTabModalProps = {
  fileName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function SharedFolderOpenNewTabModal({ fileName, onClose, onConfirm }: SharedFolderOpenNewTabModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" 
      onClick={onClose}
    >
      <section 
        className="w-[420px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]" 
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-[16px] font-bold text-[#0F172A]">새 탭에서 열기</h2>
        <p className="mt-2 text-[13px] text-[#425466]">&quot;{fileName}&quot;을 새 탭에서 여시겠습니까?</p>

        <div className="mt-6 flex justify-end gap-2">
          <button 
            className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#6B7280]" 
            type="button" 
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white" 
            type="button" 
            onClick={onConfirm}
          >
            새 탭에서 열기
          </button>
        </div>
      </section>
    </div>
  );
}
