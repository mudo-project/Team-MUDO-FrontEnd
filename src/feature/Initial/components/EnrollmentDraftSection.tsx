import { DataImportEnrollmentDraftData } from "../type";
import EnrollmentDraftRow from "./EnrollmentDraftRow";

export default function EnrollmentDraftSection({ rows, onToggle }: { rows: DataImportEnrollmentDraftData[]; onToggle: (rowId: string) => void }) {
    return (
        <section className="overflow-hidden rounded-[12px] border border-[#D7E8DB] bg-white">
            <h2 className="px-5 py-4 text-[14px] font-semibold text-[#0F172A]">수강 관계 후보 <span className="text-[#2C8D50]">{rows.length}</span></h2>
            {rows.map((row) => <EnrollmentDraftRow key={row.rowId} onToggle={onToggle} row={row} />)}
        </section>
    );
}
