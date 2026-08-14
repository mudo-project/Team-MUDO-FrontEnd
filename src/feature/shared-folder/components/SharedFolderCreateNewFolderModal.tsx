"use client";

import { useState } from "react";

type SharedFolderCreateNewFolderModalProps = {
  currentPath: string;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
};

export default function SharedFolderCreateNewFolderModal({ currentPath, isSubmitting, onClose, onCreate }: SharedFolderCreateNewFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const trimmedFolderName = folderName.trim();

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" 
      onClick={onClose}
    >
      <section 
        className="w-[440px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]" 
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-[16px] font-bold text-[#0F172A]">새 폴더 만들기</h2>
        <p className="mt-1 text-[12px] text-[#94A3B8]">현재 위치: {currentPath}</p>

        <label className="mt-5 block" htmlFor="shared-folder-new-folder-name">
          <span className="sr-only">폴더 이름</span>
          <input
            className="h-11 w-full rounded-lg border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#12182B]"
            id="shared-folder-new-folder-name"
            placeholder="폴더 이름"
            type="text"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
          />
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button 
            className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#6B7280]" 
            type="button" 
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!trimmedFolderName || isSubmitting}
            type="button"
            onClick={() => onCreate(trimmedFolderName)}
          >
            {isSubmitting ? "만드는 중..." : "만들기"}
          </button>
        </div>
      </section>
    </div>
  );
}
