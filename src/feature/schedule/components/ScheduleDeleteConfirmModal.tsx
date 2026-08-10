"use client";

type ScheduleDeleteConfirmModalProps = {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ScheduleDeleteConfirmModal({ title, onCancel, onConfirm }: ScheduleDeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[360px] rounded-2xl bg-white p-6">
        <h2 className="text-[16px] font-bold">일정을 삭제할까요?</h2>
        <p className="mt-2 break-words text-[13px] text-[#718096]">&quot;{title}&quot; 일정을 삭제하면 되돌릴 수 없습니다.</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="h-10 rounded-lg border border-[#DCE9DF] bg-white px-4 text-[13px] font-medium text-[#64748B]"
            type="button"
            onClick={onCancel}
          >
            취소
          </button>
          <button className="h-10 rounded-lg bg-[#C65A50] px-4 text-[13px] font-semibold text-white" type="button" onClick={onConfirm}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
