"use client";

import { useRouter } from "next/navigation";

export default function PreviousButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="h-10 rounded-[8px] border border-[#D7E8DB] bg-white px-5 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#F4F8F5]"
      onClick={() => router.back()}
    >
      뒤로가기
    </button>
  );
}
