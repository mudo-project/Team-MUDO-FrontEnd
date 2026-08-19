"use client";

import PreviousButton from "@/components/ui/PreviousButton";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#FCFCFC] px-8 text-center">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">
          오류가 발생했습니다
        </h1>
        <p className="mt-3 text-sm text-[#64748B]">
          {error.message || "잠시 후 다시 시도해주세요."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <PreviousButton />
          <button
            type="button"
            className="h-10 rounded-[8px] bg-[#2C8D50] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#267A45]"
            onClick={reset}
          >
            다시 시도
          </button>
        </div>
      </div>
    </main>
  );
}
