import SharedFolderList from "./SharedFolderList";
import SharedFolderListHeader from "./SharedFolderListHeader";
import SharedFolderPath from "./SharedFolderPath";
import SharedFolderToolbar from "./SharedFolderToolbar";

const SHARED_FOLDER_ITEMS: SharedFolderItemData[] = [
  { id: 1, kind: "FOLDER", name: "공지사항212", modifierName: "김서준", modifiedAt: "2026.08.13 18:00", size: "-" },
  { id: 2, kind: "FOLDER", name: "상담기록", modifierName: "김서준", modifiedAt: "2026.08.10 09:00", size: "-" },
  { id: 3, kind: "FOLDER", name: "수업자료", modifierName: "이수민", modifiedAt: "2026.08.11 09:00", size: "-" },
  { id: 4, kind: "FOLDER", name: "행정서류", modifierName: "박지현", modifiedAt: "2026.08.09 09:00", size: "-" },
  { id: 5, kind: "FILE", fileType: "UPLOADED", name: "2026 학사일정.pdf", modifierName: "박지현", modifiedAt: "2026.08.08 09:00", size: "1.2MB" },
  { id: 6, kind: "FILE", fileType: "GOOGLE_DOCS", name: "구글 독스", modifierName: "김서준", modifiedAt: "2026.08.13 17:57", size: "-" },
  { id: 7, kind: "FILE", fileType: "GOOGLE_SHEETS", name: "구글 시트", modifierName: "김서준", modifiedAt: "2026.08.13 17:58", size: "-" },
  { id: 8, kind: "FILE", fileType: "GOOGLE_SHEETS", name: "출석부", modifierName: "김서준", modifiedAt: "2026.08.13 18:05", size: "-" },
  { id: 9, kind: "FILE", fileType: "GOOGLE_SLIDES", name: "학원 소개자료", modifierName: "김서준", modifiedAt: "2026.08.07 09:00", size: "-" },
];

export default function SharedFolderBoard() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-6">
      <SharedFolderToolbar />

      <section aria-label="공유폴더 목록" className="mt-4 overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
        <SharedFolderPath />
        <SharedFolderListHeader />
        <SharedFolderList items={SHARED_FOLDER_ITEMS} />
      </section>
    </main>
  );
}
