import MyWorkItem from "@/feature/workspace/components/MyWorkItem";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-[#FCFDFE] text-[#202A3C]">
      <header className="border-b border-[#E4E8ED] px-2 pt-4 pb-4 sm:px-3 md:px-5 md:pt-5 lg:px-8 lg:pt-7 lg:pb-[17px]">
        <h1 className="text-[14px] leading-[22.5px] font-bold tracking-[-0.02em] md:text-[15px]">내 업무 모아보기</h1>
        <div className="mt-2 flex flex-col md:flex-row md:items-center gap-1 sm:mt-2.5 sm:gap-1.5 md:mt-3 md:gap-2 lg:gap-2.5">

          <div className="items-center flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5">
            <label className="flex h-7 w-[110px] items-center rounded-[7px] border border-[#DCE1E7] bg-[#F7F8FA] px-1.5 sm:w-[140px] sm:px-2 md:h-[30px] md:w-[165px] lg:w-[195px] lg:px-[11px]">
              <Search className="size-3" strokeWidth={1.5} />
              <input
                className="ml-1 w-full bg-transparent text-[10px] text-[#202A3C] placeholder:text-[#9EA7B4] focus:outline-none sm:ml-1.5 sm:text-[11px] lg:ml-[7px] lg:text-[12px]"
                placeholder="업무 제목 검색"
                aria-label="업무 제목 검색"
              />
            </label>
            <span className="block md:hidden text-[10px] text-[#B3BBC6] sm:text-[11px] lg:text-[12px]">7건</span>
          </div>

          <div className="flex gap-1">
            <select
              className="h-7 w-[75px] rounded-[7px] border border-[#DCE1E7] bg-white px-1.5 text-[10px] focus:outline-none sm:w-[85px] sm:px-2 sm:text-[11px] md:h-[30px] lg:w-[101px] lg:px-3 lg:text-[12px]"
              defaultValue="all"
              aria-label="상태 필터"
            >
              <option value="all">상태: 전체</option>
              <option value="waiting">상태: 대기</option>
              <option value="progress">상태: 진행중</option>
              <option value="done">상태: 완료</option>
            </select>

            <select
              className="h-7 w-[105px] rounded-[7px] border border-[#DCE1E7] bg-white px-1.5 text-[10px] focus:outline-none sm:w-[120px] sm:px-2 sm:text-[11px] md:h-[30px] lg:w-[145px] lg:px-3 lg:text-[12px]"
              defaultValue="all"
              aria-label="워크스페이스 필터"
            >
              <option value="all">워크스페이스: 전체</option>
              <option value="school">8월 학사 운영</option>
              <option value="onboarding">신규 강사 온보딩</option>
            </select>
          </div>

          <span className="hidden md:block text-[10px] text-[#B3BBC6] sm:text-[11px] lg:text-[12px]">7건</span>
        </div>
      </header>

      <section className="px-2 py-4 sm:px-3 md:px-4 md:py-5 lg:px-6">
        <div className="w-full overflow-hidden rounded-[9px] border border-[#DDE2E8] bg-white">
          <div className="grid h-[34px] grid-cols-8 md:grid-cols-9 items-center border-b border-[#EBEEF2] px-2 text-[10px] leading-[16.5px] font-medium text-[#A8B0BC] sm:px-3 md:h-9 md:px-4 lg:h-[37px] lg:px-5 lg:text-[11px]">
            <span className="col-span-3 md:col-span-4">업무 제목</span>
            <span className="col-span-2">워크스페이스</span>
            <span className="col-span-1">등록자</span>
            <span className="col-span-1">기한</span>
            <span className="col-span-1">상태</span>
          </div>

          <MyWorkItem />
        </div>
      </section>
    </main>
  );
}
