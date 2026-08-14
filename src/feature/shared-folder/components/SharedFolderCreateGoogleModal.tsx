'use client'

import { useState } from "react";
import { FILE_TYPE_LABEL } from "./SharedFolderItem";

type SharedFolderGoogleFileType = "GOOGLE_DOCS" | "GOOGLE_SHEETS" | "GOOGLE_SLIDES";

const DEFAULT_FILE_NAME: Record<SharedFolderGoogleFileType, string> = {
  GOOGLE_DOCS: "제목 없는 문서",
  GOOGLE_SHEETS: "제목 없는 스프레드시트",
  GOOGLE_SLIDES: "제목 없는 프레젠테이션",
};

type SharedFolderCreateGoogleModalProps = {
  fileType: SharedFolderGoogleFileType;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (fileName: string) => void;
};

export default function SharedFolderCreateGoogleModal({ fileType, isSubmitting, onClose, onCreate }: SharedFolderCreateGoogleModalProps) {
  const [fileName, setFileName] = useState("");

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" 
      onClick={onClose}
    >
      <section 
        className="w-[440px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]" 
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-[16px] font-bold text-[#0F172A]">{FILE_TYPE_LABEL[fileType]} 만들기</h2>

        <label className="mt-5 block" htmlFor="shared-folder-google-file-name">
          <span className="sr-only">파일 이름</span>
          <input
            className="h-11 w-full rounded-lg border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#12182B]"
            id="shared-folder-google-file-name"
            placeholder="파일 이름"
            type="text"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
          />
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#6B7280]" type="button" onClick={onClose}>
            취소
          </button>
          <button
            className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="button"
            onClick={() => onCreate(fileName.trim() || DEFAULT_FILE_NAME[fileType])}
          >
            {isSubmitting ? "만드는 중..." : "만들기"}
          </button>
        </div>
      </section>
    </div>
  );
}
