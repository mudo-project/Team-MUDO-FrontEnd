import { getSharedFolderItemKind } from "../sharedFolderFormat";

type SharedFolderDeleteCheckModalProps = {
  isSubmitting: boolean;
  item: SharedFolderDriveItemData;
  onClose: () => void;
  onDelete: () => void;
};

export default function SharedFolderDeleteCheckModal({ isSubmitting, item, onClose, onDelete }: SharedFolderDeleteCheckModalProps) {
  const itemType = getSharedFolderItemKind(item) === "FOLDER" ? "폴더" : "파일";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" onClick={onClose}>
      <section
        aria-labelledby="shared-folder-delete-title"
        className="w-[480px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="shared-folder-delete-title" className="text-[16px] font-bold text-[#0F172A]">삭제 확인</h2>
        <p className="mt-3 text-[13px] text-[#0F172A]">
          <strong>&quot;{item.name}&quot;</strong>({itemType})을(를) 삭제하시겠습니까?
        </p>
        <p className="mt-3 rounded-lg bg-[#F6F7F5] p-3 text-[12px] leading-5 text-[#64748B]">
          Google Drive 휴지통으로 이동합니다. 복원은 Google Drive 휴지통에서 할 수 있습니다.
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#6B7280]" type="button" onClick={onClose}>
            취소
          </button>
          <button
            className="h-9 rounded-lg bg-[#B55348] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="button"
            onClick={onDelete}
          >
            {isSubmitting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </section>
    </div>
  );
}
