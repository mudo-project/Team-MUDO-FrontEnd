export default function MessageMenu({ onClose }: { onClose: () => void }) {
    return (
        <div className="absolute right-0 top-full z-10 mt-1 w-24 overflow-hidden rounded-[8px] border border-[#D7E8DB] bg-white shadow-[0_8px_12px_rgba(22,34,54,0.12)]">
            <button className="block w-full px-3 py-2 text-left text-[11px] text-[#0F172A] hover:bg-[#F7F9F7]" onClick={onClose} type="button">
                수정
            </button>
            <button className="block w-full px-3 py-2 text-left text-[11px] text-[#C0483F] hover:bg-[#F7F9F7]" onClick={onClose} type="button">
                삭제
            </button>
        </div>
    );
}
