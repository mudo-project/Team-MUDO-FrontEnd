"use client";

type SharedFolderDownloadFormatModalProps = {
  formats: SharedFolderDownloadFormat[];
  isSubmitting: boolean;
  itemName: string;
  onClose: () => void;
  onSelect: (format: SharedFolderDownloadFormat) => void;
};

const FORMAT_LABEL: Record<SharedFolderDownloadFormat, string> = {
  PDF: "PDF",
  DOCX: "Word 문서(.docx)",
  XLSX: "Excel 통합 문서(.xlsx)",
  PPTX: "PowerPoint 프레젠테이션(.pptx)",
};

export default function SharedFolderDownloadFormatModal({
  formats,
  isSubmitting,
  itemName,
  onClose,
  onSelect,
}: SharedFolderDownloadFormatModalProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" onClick={onClose}>
      <section
        aria-labelledby="shared-folder-download-format-title"
        className="w-[360px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="shared-folder-download-format-title" className="text-[16px] font-bold text-[#0F172A]">다운로드 형식 선택</h2>
        <p className="mt-1 truncate text-[12px] text-[#94A3B8]">&quot;{itemName}&quot;을(를) 어떤 형식으로 다운로드할까요?</p>

        <div className="mt-4 flex flex-col gap-2">
          {formats.map((format) => (
            <button
              key={format}
              className="flex h-10 items-center rounded-lg border border-[#DCE9DF] px-4 text-left text-[13px] font-medium text-[#172033] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
              type="button"
              onClick={() => onSelect(format)}
            >
              {FORMAT_LABEL[format]}
            </button>
          ))}
        </div>

        <button
          className="mt-4 h-9 w-full rounded-lg border border-[#D7E8DB] bg-white text-[12px] text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          type="button"
          onClick={onClose}
        >
          취소
        </button>
      </section>
    </div>
  );
}
