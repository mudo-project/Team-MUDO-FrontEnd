import SettingGoogleConnection from "@/feature/setting/components/SettingGoogleConnection";

export default function GoogleConnectPage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 pt-6 text-[#172033] lg:px-8">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[1010px] pb-8">
          <div className="mb-6">
            <h1 className="text-[26px] font-bold tracking-[-0.04em]">구글 연동</h1>
            <p className="mt-1.5 text-sm text-[#7B879B]">
              구글 계정과 연결하면 드라이브·독스·시트를 템플릿 기능에서 사용할 수 있습니다.
            </p>
          </div>

          <SettingGoogleConnection />
        </div>
      </div>
    </main>
  );
}
