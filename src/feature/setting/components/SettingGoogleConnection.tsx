"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Ban, Cloud, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import SettingGoogleReplaceModal from "@/feature/setting/components/SettingGoogleReplaceModal";
import SettingGoogleDisconnectModal from "@/feature/setting/components/SettingGoogleDisconnectModal";
import { formatGoogleDateTime } from "@/feature/setting/utils";
import {
  checkGoogleConnectionAction,
  disconnectGoogleAction,
  getGoogleAuthorizationUrlAction,
  getGoogleConnectionAction,
} from "@/feature/setting/actions";

type ConnectionStatus = "not-connected" | "connected" | "expiring" | "expired" | "failed";

const STATUS_TO_CONNECTION_STATUS: Record<GoogleConnectionStatus, ConnectionStatus> = {
  CONNECTED: "connected",
  EXPIRING: "expiring",
  EXPIRED: "expired",
  FAILED: "failed",
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

const STATUS_BANNER_STYLE: Record<BannerStatus, { className: string; description: string; actionLabel: string }> = {
  expiring: {
    className: "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
    description: "계정 재연결을 진행해주세요",
    actionLabel: "재연결",
  },
  expired: {
    className: "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]",
    description: "계정을 다시 연결해주세요",
    actionLabel: "재연결",
  },
  failed: {
    className: "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]",
    description: "권한이 취소되었거나 필요한 권한이 부족합니다",
    actionLabel: "재연결",
  },
};

function getDaysUntil(iso: string): number {
  const diffMs = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
}

function getBannerTitle(status: BannerStatus, connection: GoogleConnectionData): string {
  if (status === "expiring") {
    return connection.refreshTokenExpiresAt
      ? `${getDaysUntil(connection.refreshTokenExpiresAt)}일 뒤 토큰이 만료됩니다`
      : "곧 토큰이 만료됩니다";
  }
  if (status === "expired") return "토큰이 만료되었습니다";
  return "연결에 실패했습니다";
}

function openGoogleAuthorizationPopup(authorizationUrl: string): Window | null {
  return window.open(authorizationUrl, "google-oauth", "width=520,height=650");
}

export default function SettingGoogleConnection() {
  const [connection, setConnection] = useState<GoogleConnectionData | null>(null);
  const [isLoadingConnection, setIsLoadingConnection] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const pollIntervalRef = useRef<number | null>(null);

  const status: ConnectionStatus = connection ? STATUS_TO_CONNECTION_STATUS[connection.status] : "not-connected";
  const isConnectedLike = status !== "not-connected";
  const isBannerStatus = status === "expiring" || status === "expired" || status === "failed";
  const banner =
    isBannerStatus && connection
      ? { ...STATUS_BANNER_STYLE[status], title: getBannerTitle(status, connection) }
      : null;

  const fetchConnection = useCallback(() => {
    return getGoogleConnectionAction()
      .then(setConnection)
      .catch((error) => {
        const message = error instanceof Error ? error.message : "구글 연동 상태 조회에 실패하였습니다.";
        toast.error(message);
      });
  }, []);

  useEffect(() => {
    void fetchConnection().finally(() => setIsLoadingConnection(false));

    return () => {
      if (pollIntervalRef.current !== null) {
        window.clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchConnection]);

  // OAuth 콜백 팝업(SettingGoogleConnectionCallback)이 postMessage로 결과를 알려주면 즉시 상태를 다시 조회한다.
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== "https://ieum.store") return;
      if (event.data?.source !== "google-oauth-connection") return;

      if (pollIntervalRef.current !== null) {
        window.clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      void fetchConnection().finally(() => setIsConnecting(false));
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchConnection]);

  async function handleConnect() {
    setIsConnecting(true);
    const result = await getGoogleAuthorizationUrlAction(false);

    if (!result.success || !result.authorizationUrl) {
      setIsConnecting(false);
      toast.error(result.message);
      return;
    }

    const popup = openGoogleAuthorizationPopup(result.authorizationUrl);

    if (!popup) {
      setIsConnecting(false);
      toast.error("팝업이 차단되었습니다. 브라우저 팝업 차단을 해제해주세요.");
      return;
    }

    pollIntervalRef.current = window.setInterval(() => {
      if (popup.closed) {
        if (pollIntervalRef.current !== null) {
          window.clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        void fetchConnection().finally(() => setIsConnecting(false));
      }
    }, 500);
  }

  async function handleCheckConnection() {
    setIsCheckingConnection(true);
    const result = await checkGoogleConnectionAction();

    if (result.success) {
      await fetchConnection();
    } else {
      toast.error(result.message);
    }

    setIsCheckingConnection(false);
  }

  async function handleDisconnect() {
    const result = await disconnectGoogleAction();
    setIsDisconnectModalOpen(false);

    if (result.success) {
      toast.success(result.message);
      setConnection(null);
    } else {
      toast.error(result.message);
    }
  }

  if (isLoadingConnection) {
    return (
      <section className="flex min-h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.02)] lg:p-7">
        <Loader2 className="size-5 animate-spin text-[#94A3B8]" />
      </section>
    );
  }

  return (
    <>
      <section className="rounded-xl border border-[#DCE9DF] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.02)] lg:p-7">
        <h2 className="text-xl font-bold tracking-[-0.04em]">구글 계정 연동</h2>
        <p className="mt-1.5 text-sm text-[#7B879B]">
          학원 명의 구글 계정을 연결하면 드라이브·독스·시트를 템플릿 기능에서 사용할 수 있습니다.
        </p>

        {isConnectedLike && connection ? (
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
                  className="shrink-0 text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isConnecting}
                  onClick={handleConnect}
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
                  {connection.googleEmail}
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
                  className="mt-3 h-9 rounded-md bg-[#0F172A] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isConnecting}
                  onClick={handleConnect}
                  type="button"
                >
                  재연결
                </button>
              )}

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-[#7B879B]">연결 일시</dt>
                  <dd>{formatGoogleDateTime(connection.connectedAt)}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-[#7B879B]">연결한 관리자</dt>
                  <dd>{connection.connectedByUserName ?? `사용자 #${connection.connectedByUserId}`}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-[#7B879B]">권한 범위</dt>
                  <dd className="min-w-0 break-words">{connection.scope}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-[#7B879B]">토큰 확인</dt>
                  <dd>{formatGoogleDateTime(connection.lastCheckedAt)}</dd>
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
              className="mt-6 h-12 rounded-lg bg-[#161B2D] px-6 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isConnecting}
              onClick={handleConnect}
              type="button"
            >
              {isConnecting ? "연결 중..." : "구글 계정 연결"}
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
          <li>• 토큰은 최대 60일 유효하며, 만료 3일 전부터 갱신 필요 알림이 표시됩니다.</li>
        </ul>
      </section>

      {isReplaceModalOpen && connection && (
        <SettingGoogleReplaceModal
          email={connection.googleEmail}
          onClose={() => {
            setIsReplaceModalOpen(false);
            void fetchConnection();
          }}
        />
      )}

      {isDisconnectModalOpen && connection && (
        <SettingGoogleDisconnectModal
          email={connection.googleEmail}
          onClose={() => setIsDisconnectModalOpen(false)}
          onConfirm={handleDisconnect}
        />
      )}
    </>
  );
}
