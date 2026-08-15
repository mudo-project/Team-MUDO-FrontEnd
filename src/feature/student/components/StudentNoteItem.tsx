export default function StudentNoteItem({ note }: { note?: string | null }) {
    return (
        <div>
            <p className="text-[11px] leading-[16.5px] text-[#94A3B8]">특이사항</p>
            <p className="mt-[3px] text-[13px] leading-[19.5px] font-medium text-[#1D2B3A]">{note ?? "-"}</p>
        </div>
    );
}
