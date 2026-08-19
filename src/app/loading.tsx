import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#FCFCFC] text-center">
      <Loader2
        className="size-8 animate-spin text-[#2C8D50]"
        aria-hidden="true"
      />
      <p className="mt-5 text-sm text-[#64748B]">
        정보를 가져오는 중입니다.
      </p>
    </main>
  );
}
