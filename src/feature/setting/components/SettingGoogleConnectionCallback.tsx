"use client";

import { useEffect, useState } from "react";

export default function SettingGoogleConnectionCallback({ success }: { success: boolean }) {
  const [closeFailed, setCloseFailed] = useState(false);

  useEffect(() => {
    window.close();

    const timer = window.setTimeout(() => setCloseFailed(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  if (!closeFailed) return null;

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center text-[#172033]">
      <p className="text-[14px] font-medium">
        {success ? "구글 계정 연동이 완료되었습니다." : "구글 계정 연동에 실패했습니다."}
      </p>
      <button
        className="h-9 rounded-md bg-[#0F172A] px-4 text-[13px] font-medium text-white"
        onClick={() => window.close()}
        type="button"
      >
        창 닫기
      </button>
    </main>
  );
}
