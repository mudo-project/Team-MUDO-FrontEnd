"use client";

import { useState } from "react";

type SharedFolderEditNameModalProps = {
  currentName: string;
  onClose: () => void;
  onRename: (name: string) => void;
};

export default function SharedFolderEditNameModal({ currentName, onClose, onRename }: SharedFolderEditNameModalProps) {
  const [name, setName] = useState(currentName);

  const trimmedName = name.trim();

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#162236]/35" onClick={onClose}>
      <section
        aria-labelledby="shared-folder-edit-name-title"
        className="w-[480px] rounded-2xl bg-white p-7 shadow-[0_8px_40px_rgba(22,34,54,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="shared-folder-edit-name-title" className="text-[16px] font-bold text-[#0F172A]">
          이름 변경
        </h2>

        <label className="mt-5 block" htmlFor="shared-folder-edit-name">
          <span className="sr-only">이름</span>
          <input
            className="h-11 w-full rounded-lg border border-[#D7E8DB] px-3 text-[13px] text-[#0F172A] outline-none focus:border-[#12182B]"
            id="shared-folder-edit-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="h-9 rounded-lg border border-[#D7E8DB] bg-white px-4 text-[12px] text-[#6B7280]"
            type="button"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="h-9 rounded-lg bg-[#12182B] px-4 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!trimmedName}
            type="button"
            onClick={() => onRename(trimmedName)}
          >
            변경
          </button>
        </div>
      </section>
    </div>
  );
}
