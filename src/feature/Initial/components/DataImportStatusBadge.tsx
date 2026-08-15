import { DataImportRowStatus } from "../type";

const STATUS_LABELS: Record<DataImportRowStatus, string> = {
    READY: "등록 가능",
    NEEDS_REVIEW: "확인 필요",
    DUPLICATE_SUSPECTED: "중복 의심",
    ERROR: "등록 불가",
};

const STATUS_STYLES: Record<DataImportRowStatus, string> = {
    READY: "bg-[#EAF4ED] text-[#2C8D50]",
    NEEDS_REVIEW: "bg-[#FFF7E6] text-[#B7791F]",
    DUPLICATE_SUSPECTED: "bg-[#FFF0F3] text-[#D45D76]",
    ERROR: "bg-[#FDECEC] text-[#C0483F]",
};

export default function DataImportStatusBadge({ status }: { status: DataImportRowStatus }) {
    return (
        <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
        </span>
    );
}
