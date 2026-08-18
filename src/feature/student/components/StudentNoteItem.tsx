export default function StudentNoteItem({ note }: { note?: string | null }) {
    return (
        <div>
            <p className="text-[10px] md:text-[11px] leading-[15px] md:leading-[16.5px] text-[#94A3B8]">특이사항</p>
            <p className="mt-[3px] text-[12px] md:text-[13px] leading-[18px] md:leading-[19.5px] font-medium text-[#1D2B3A]">{note ?? "-"}</p>
        </div>
    );
}
