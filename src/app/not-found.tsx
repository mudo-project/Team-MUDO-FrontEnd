import Link from "next/link";
import PreviousButton from "@/components/ui/PreviousButton";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#FCFCFC] px-8 text-center">
      <div>
        <p className="text-8xl font-black text-[#2C8D50]">404</p>
        <h1 className="mt-6 text-3xl font-bold text-[#0F172A]">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm text-[#64748B]">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <PreviousButton />
          <Link
            href="/"
            className="flex h-10 items-center rounded-[8px] bg-[#2C8D50] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#267A45]"
          >
            메인 페이지
          </Link>
        </div>
      </div>
    </main>
  );
}
