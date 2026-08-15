import { DataImportStudentDraftData } from "../type";
import DataImportStatusBadge from "./DataImportStatusBadge";

export default function StudentDraftRow({ row, onToggle }: { row: DataImportStudentDraftData; onToggle: (rowId: string) => void }) {
    return (
        <div className="grid grid-cols-12 items-center gap-3 border-t border-[#EEF2EF] px-5 py-3 text-[12px]">
            <input checked={row.selected} className="col-span-1" onChange={() => onToggle(row.rowId)} type="checkbox" />
            <div className="col-span-3"><strong>{row.name}</strong><p className="text-[#94A3B8]">{row.phone || "연락처 없음"}</p></div>
            <span className="col-span-2">{row.grade}</span><span className="col-span-2">{row.school || "-"}</span>
            <span className="col-span-2"><DataImportStatusBadge status={row.status} /></span>
            <span className="col-span-2 text-[#C0483F]">{row.messages.join(", ")}</span>
        </div>
    );
}
