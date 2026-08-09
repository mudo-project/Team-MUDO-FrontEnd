import { Cloud } from "lucide-react";

export default function GoogleConnectPage() {
  return (
    <main className="h-[calc(100dvh-3.25rem)] overflow-hidden bg-[#FCFCFC] px-5 py-16 text-[#172033] lg:px-8 lg:py-[4.25rem]">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[1010px] pb-8">
          <div className="mb-6">
            <h1 className="text-[26px] font-bold tracking-[-0.04em]">구글 연동</h1>
            <p className="mt-1.5 text-sm text-[#7B879B]">
              구글 계정과 연결하면 드라이브·독스·시트를 템플릿 기능에서 사용할 수 있습니다.
            </p>
          </div>

          <section className="rounded-xl border border-[#DCE9DF] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.02)] lg:p-7">
            <h2 className="text-xl font-bold tracking-[-0.04em]">구글 계정 연동</h2>
            <p className="mt-1.5 text-sm text-[#7B879B]">
              학원 명의 구글 계정을 연결하면 드라이브·독스·시트를 템플릿 기능에서 사용할 수 있습니다.
            </p>

            <div className="mt-6 flex min-h-[250px] flex-col items-center justify-center rounded-lg bg-[#F1F4F8] px-5 text-center">
              <Cloud className="size-11 stroke-[1.7] text-[#718097]" aria-hidden="true" />
              <p className="mt-4 text-lg font-semibold tracking-[-0.04em]">연결된 구글 계정이 없습니다</p>
              <p className="mt-3 text-sm text-[#8190A5]">
                학원 명의 계정으로 연결해주세요. 개인 계정은 권장하지 않습니다.
              </p>
              <button
                className="mt-6 h-12 rounded-lg bg-[#161B2D] px-6 text-sm font-medium text-white"
                type="button"
              >
                구글 계정 연결
              </button>
            </div>
          </section>

          <section className="mt-5 rounded-xl border border-[#DCE9DF] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.02)] lg:p-7">
            <h2 className="text-lg font-bold tracking-[-0.04em]">연동 안내</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#7B879B]">
              <li>• 구글 계정은 학원 명의 G Suite(Google Workspace) 계정을 권장합니다.</li>
              <li>• 연동 후 구글 드라이브에 학원 전용 폴더가 생성되며, 카테고리별 하위 폴더로 구성됩니다.</li>
              <li>• 계정을 교체할 경우 기존 드라이브의 파일에는 접근할 수 없게 됩니다.</li>
              <li>• 토큰은 최대 60일 유효하며, 만료 7일 전부터 갱신 필요 알림이 표시됩니다.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
