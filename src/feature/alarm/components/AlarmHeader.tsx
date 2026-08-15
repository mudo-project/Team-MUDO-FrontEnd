export default function AlarmHeader({ onDeleteRead }: { onDeleteRead: () => void }) {
    return (
        <div className="mb-3 flex items-center justify-between">
            <h1 className="text-[18px] font-bold text-[#0F172A]">알림</h1>
            <button
                className="flex h-8 items-center rounded-md border border-[#D7E8DB] bg-white px-3.5 text-[11px] font-semibold text-[#64748B] hover:cursor-pointer"
                onClick={onDeleteRead}
                type="button"
            >
                읽은 알림 삭제
            </button>
        </div>
    );
}
