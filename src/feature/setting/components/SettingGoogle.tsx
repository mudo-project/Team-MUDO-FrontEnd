import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";

export default function SettingGoogle() {
  return (
    <SettingCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading title="구글 연동" description="학원 명의 구글 계정을 연동하면 드라이브·독스·시트 템플릿 기능에서 사용할 수 있습니다." />
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF5EE] px-2.5 py-1 text-[10px] font-medium text-[#4D9560]"><Check className="size-3" />연결됨</span>
          <Link className="flex h-8 items-center gap-1 rounded-md border border-[#DCE9DF] px-3 text-[11px] text-[#64748B]" href="/setting/google">
            관리 <ChevronRight className="size-3" />
          </Link>
        </div>
      </div>
    </SettingCard>
  );
}
