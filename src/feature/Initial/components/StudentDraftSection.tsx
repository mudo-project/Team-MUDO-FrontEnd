import { DataImportStudentDraftData } from "../type";
import StudentDraftRow from "./StudentDraftRow";

export default function StudentDraftSection({ rows, onToggle }: { rows: DataImportStudentDraftData[]; onToggle: (rowId: string) => void }) {
    return (
        <section className="overflow-hidden rounded-[12px] border border-[#D7E8DB] bg-white">
            <h2 className="px-5 py-4 text-[14px] font-semibold text-[#0F172A]">학생 후보 <span className="text-[#2C8D50]">{rows.length}</span></h2>
            {rows.map((row) => <StudentDraftRow key={row.rowId} onToggle={onToggle} row={row} />)}
        </section>
    );
}
