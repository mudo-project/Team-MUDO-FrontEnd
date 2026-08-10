"use client";

import { useState } from "react";
import { X } from "lucide-react";

const CONFIRM_KEYWORD = "해제";

export default function SettingGoogleDisconnectModal({
  email,
  onClose,
  onConfirm,
}: {
  email: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmInput, setConfirmInput] = useState("");
  const isConfirmEnabled = confirmInput.trim() === CONFIRM_KEYWORD;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-[#162236]/30"
      onClick={onClose}
    >
      <section
        className="w-[420px] rounded-xl bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold tracking-[-0.02em] text-[#172033]">연동을 해제할까요?</h2>
          <button
            aria-label="연동 해제 모달 닫기"
            className="text-[#94A3B8]"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="mt-4 rounded-lg bg-[#F6F8FA] px-4 py-3 text-[13px] font-medium text-[#172033]">{email}</p>

        <p className="mt-3 text-[13px] leading-5 text-[#7B879B]">
          해제하면 템플릿 목록·미리보기·업로드 기능을 사용할 수 없습니다. 구글 드라이브의 파일은 삭제되지 않습니다.
        </p>

        <label className="mt-4 block text-[13px] text-[#475569]" htmlFor="google-disconnect-confirm">
          확인을 위해 <strong className="font-semibold text-[#172033]">{CONFIRM_KEYWORD}</strong>를 입력하세요
        </label>
        <input
          className="mt-2 h-11 w-full rounded-lg border border-[#DCE9DF] px-3 text-[13px] outline-none"
          id="google-disconnect-confirm"
          onChange={(event) => setConfirmInput(event.target.value)}
          placeholder={CONFIRM_KEYWORD}
          value={confirmInput}
        />

        <div className="mt-5 flex gap-2">
          <button
            className="h-11 flex-1 rounded-lg border border-[#DCE9DF] bg-white text-[13px] font-medium text-[#475569]"
            onClick={onClose}
            type="button"
          >
            취소
          </button>
          <button
            className="h-11 flex-1 rounded-lg bg-[#DC2626] text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#94A3B8]"
            disabled={!isConfirmEnabled}
            onClick={onConfirm}
            type="button"
          >
            연동 해제
          </button>
        </div>
      </section>
    </div>
  );
}
