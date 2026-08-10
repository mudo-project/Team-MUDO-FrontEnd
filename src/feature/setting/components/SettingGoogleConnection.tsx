"use client";

import { useState } from "react";
import { Ban, Cloud, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import SettingGoogleReplaceModal from "@/feature/setting/components/SettingGoogleReplaceModal";
import SettingGoogleDisconnectModal from "@/feature/setting/components/SettingGoogleDisconnectModal";

type ConnectionStatus = "not-connected" | "connected" | "expiring" | "expired" | "failed";

// 데모용 더미 데이터입니다. 실제 구글 계정 연동 API가 없어 상태 전환만 흉내냅니다.
const DUMMY_CONNECTION = {
  email: "academy@mudo.co.kr",
  connectedAt: "2026.07.01 14:22",
  connectedBy: "대표 김지수",
  scope: "드라이브 · 문서 · 스프레드시트",
  tokenCheckedAt: "2026.08.03 09:00",
};

const STATUS_BADGE: Record<Exclude<ConnectionStatus, "not-connected">, { label: string; className: string }> = {
  connected: { label: "연결됨", className: "text-[#4D9560]" },
  expiring: { label: "갱신 필요", className: "text-[#D97706]" },
  expired: { label: "연결 만료", className: "text-[#DC2626]" },
  failed: { label: "연결 실패", className: "text-[#DC2626]" },
};

const STATUS_DOT_CLASS: Record<Exclude<ConnectionStatus, "not-connected" | "failed">, string> = {
  connected: "bg-[#4D9560]",
  expiring: "bg-[#D97706]",
  expired: "bg-[#DC2626]",
};

type BannerStatus = "expiring" | "expired" | "failed";

const STATUS_BANNER: Record<BannerStatus, { className: string; title: string; description: string; actionLabel: string }> = {
  expiring: {
    className: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
    title: "n일 뒤 토큰이 만료됩니다",
    description: "계정 재연결을 진행해주세요",
    actionLabel: "계정 교체",
  },
  expired: {
    className: "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]",
    title: "토큰이 만료되었습니다",
    description: "계정을 다시 연결해주세요",
    actionLabel: "계정 교체",
  },
  failed: {
    className: "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]",
    title: "연결에 실패했습니다",
    description: "권한이 취소되었습니다",
    actionLabel: "재연결",
  },
};

export default function SettingGoogleConnection() {
  const [status, setStatus] = useState<ConnectionStatus>("not-connected");
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

  const isConnectedLike = status !== "not-connected";
  const banner = status === "expiring" || status === "expired" || status === "failed" ? STATUS_BANNER[status] : null;

  function handleCheckConnection() {
    setIsCheckingConnection(true);
    window.setTimeout(() => setIsCheckingConnection(false), 1500);
  }

  function handleRetryConnect() {
    setStatus("connected");
  }

  function handleDisconnect() {
    setStatus("not-connected");
    setIsDisconnectModalOpen(false);
  }

  return (
    <>
      <section className="rounded-xl border border-[#DCE9DF] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.02)] lg:p-7">
        <h2 className="text-xl font-bold tracking-[-0.04em]">구글 계정 연동</h2>
        <p className="mt-1.5 text-sm text-[#7B879B]">
          학원 명의 구글 계정을 연결하면 드라이브·독스·시트를 템플릿 기능에서 사용할 수 있습니다.
        </p>

        {isConnectedLike ? (
          <>
            {banner && (
              <div
                className={`mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm ${banner.className}`}
              >
                <p className="flex items-start gap-2">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <strong className="block font-semibold">{banner.title}</strong>
                    <span className="text-[13px] opacity-90">{banner.description}</span>
                  </span>
                </p>
                <button
                  className="shrink-0 text-[13px] font-semibold"
                  onClick={status === "failed" ? handleRetryConnect : () => setIsReplaceModalOpen(true)}
                  type="button"
                >
                  {banner.actionLabel} →
                </button>
              </div>
            )}

            <div className={`rounded-lg bg-[#F6F8FA] p-6 ${banner ? "mt-3" : "mt-6"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                  {status === "failed" ? (
                    <Ban className="size-4 text-[#DC2626]" />
                  ) : (
                    <span className={`size-2 rounded-full ${STATUS_DOT_CLASS[status]}`} />
                  )}
                  {DUMMY_CONNECTION.email}
                </p>
                {isCheckingConnection ? (
                  <span className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#0F172A]">
                      <Loader2 className="size-3.5 animate-spin" />
                      확인 중
                    </span>
                    <span className="text-sm text-[#94A3B8]">잠시 기다려주세요...</span>
                  </span>
                ) : (
                  <span className={`text-sm font-semibold ${STATUS_BADGE[status].className}`}>
                    {STATUS_BADGE[status].label}
                  </span>
                )}
              </div>

              {status === "failed" && (
                <button
                  className="mt-3 h-9 rounded-md bg-[#0F172A] px-4 text-[13px] font-semibold text-white"
                  onClick={handleRetryConnect}
                  type="button"
                >
                  재연결
                </button>
              )}

              <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[#7B879B]">연결 일시</dt>
                <dd>{DUMMY_CONNECTION.connectedAt}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[#7B879B]">연결한 관리자</dt>
                <dd>{DUMMY_CONNECTION.connectedBy}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[#7B879B]">권한 범위</dt>
                <dd>{DUMMY_CONNECTION.scope}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-[#7B879B]">토큰 확인</dt>
                <dd>{DUMMY_CONNECTION.tokenCheckedAt}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                className="flex h-9 items-center gap-1.5 rounded-md border border-[#DCE9DF] bg-white px-3 text-[13px] font-medium text-[#475569] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isCheckingConnection}
                onClick={handleCheckConnection}
                type="button"
              >
                <RefreshCw className="size-3.5" />
                연결 상태 확인
              </button>
              <button
                className="h-9 rounded-md border border-[#DCE9DF] bg-white px-3 text-[13px] font-medium text-[#475569]"
                onClick={() => setIsReplaceModalOpen(true)}
                type="button"
              >
                계정 교체
              </button>
              <button
                className="h-9 rounded-md px-3 text-[13px] font-medium text-[#DC2626] disabled:cursor-not-allowed disabled:text-[#94A3B8]"
                disabled={isCheckingConnection}
                onClick={() => setIsDisconnectModalOpen(true)}
                type="button"
              >
                연동 해제
              </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 flex min-h-[250px] flex-col items-center justify-center rounded-lg bg-[#F1F4F8] px-5 text-center">
            <Cloud aria-hidden="true" className="size-11 stroke-[1.7] text-[#718097]" />
            <p className="mt-4 text-lg font-semibold tracking-[-0.04em]">연결된 구글 계정이 없습니다</p>
            <p className="mt-3 text-sm text-[#8190A5]">
              학원 명의 계정으로 연결해주세요. 개인 계정은 권장하지 않습니다.
            </p>
            <button
              className="mt-6 h-12 rounded-lg bg-[#161B2D] px-6 text-sm font-medium text-white"
              onClick={() => setStatus("connected")}
              type="button"
            >
              구글 계정 연결
            </button>
          </div>
        )}
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

      {isReplaceModalOpen && (
        <SettingGoogleReplaceModal email={DUMMY_CONNECTION.email} onClose={() => setIsReplaceModalOpen(false)} />
      )}

      {isDisconnectModalOpen && (
        <SettingGoogleDisconnectModal
          email={DUMMY_CONNECTION.email}
          onClose={() => setIsDisconnectModalOpen(false)}
          onConfirm={handleDisconnect}
        />
      )}
    </>
  );
}
