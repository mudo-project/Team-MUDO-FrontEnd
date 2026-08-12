"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Trash2, Wifi } from "lucide-react";
import { toast } from "sonner";
import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";
import {
  createWifiIpAction,
  deleteWifiIpAction,
  getCurrentIpAction,
  getWifiIpListAction,
} from "@/feature/setting/actions";

export default function SettingWifi() {
  const [ipInput, setIpInput] = useState("");
  const [checkedIp, setCheckedIp] = useState<string | null>(null);
  const [wifiIps, setWifiIps] = useState<WifiIpListItemData[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchWifiIps = useCallback(() => {
    return getWifiIpListAction()
      .then(setWifiIps)
      .catch((error) => {
        const message = error instanceof Error ? error.message : "와이파이 IP 목록 조회에 실패하였습니다.";
        toast.error(message);
      });
  }, []);

  useEffect(() => {
    void fetchWifiIps();
  }, [fetchWifiIps]);

  const trimmedIpInput = ipInput.trim();
  const isRegistered =
    trimmedIpInput.length > 0 && wifiIps.some((wifiIp) => wifiIp.ipAddress === trimmedIpInput);

  async function handleCheckIp() {
    setIsChecking(true);

    try {
      const ipAddress = await getCurrentIpAction();
      setCheckedIp(ipAddress);
    } catch (error) {
      const message = error instanceof Error ? error.message : "현재 접속 IP 조회에 실패하였습니다.";
      toast.error(message);
    } finally {
      setIsChecking(false);
    }
  }

  function handleRegisterCheckedIp() {
    if (!checkedIp) return;
    setIpInput(checkedIp);
  }

  async function handleSave() {
    if (!trimmedIpInput || isRegistered) return;

    setIsSaving(true);
    const result = await createWifiIpAction(trimmedIpInput, "");
    setIsSaving(false);

    if (result.success) {
      toast.success(result.message);
      void fetchWifiIps();
    } else {
      toast.error(result.message);
    }
  }

  async function handleDelete(wifiIpId: number) {
    const result = await deleteWifiIpAction(wifiIpId);

    if (result.success) {
      toast.success(result.message);
      void fetchWifiIps();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <SettingCard>
      <SectionHeading
        title="와이파이 IP 등록"
        description="출퇴근 기록이 허용되는 와이파이 IP 주소를 등록합니다."
      />
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="wifi-ip">와이파이 IP 주소</label>
        <input
          className="h-11 min-w-0 flex-1 rounded-lg border border-[#DCE9DF] px-3 text-[13px] font-medium outline-none"
          id="wifi-ip"
          onChange={(event) => setIpInput(event.target.value)}
          value={ipInput}
        />
        <button
          className="flex h-11 items-center justify-center gap-1 rounded-lg bg-[#0F172A] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!trimmedIpInput || isRegistered || isSaving}
          onClick={handleSave}
          type="button"
        >
          {isRegistered ? (
            <>
              <Check className="size-3.5" />
              등록됨
            </>
          ) : isSaving ? (
            "저장 중..."
          ) : (
            "저장"
          )}
        </button>
      </div>
      <div className="mt-3 rounded-lg bg-[#F6F8FA] px-4 py-3 text-[11px] text-[#718096]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2"><Wifi className="size-3.5" />현재 연결된 네트워크의 IP를 자동으로 가져옵니다</p>
          <button
            className="h-8 rounded-md border border-[#DCE9DF] bg-white px-3 text-[11px] font-medium text-[#475569] disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto"
            disabled={isChecking}
            onClick={handleCheckIp}
            type="button"
          >
            {isChecking ? "확인 중..." : "내 IP 확인"}
          </button>
        </div>

        {checkedIp && (
          <div className="mt-3 flex flex-col gap-3 rounded-lg bg-[#EDF5EE] px-4 py-3 text-[#4D9560] sm:flex-row sm:items-center">
            <p className="flex items-center gap-1.5">
              <Check className="size-3.5" />
              현재 IP: <strong className="font-semibold">{checkedIp}</strong>
            </p>
            <button
              className="h-8 rounded-md bg-[#4D9560] px-3 text-[11px] font-medium text-white sm:ml-auto"
              onClick={handleRegisterCheckedIp}
              type="button"
            >
              이 IP로 등록
            </button>
          </div>
        )}
      </div>

      {wifiIps.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-medium text-[#718096]">등록된 와이파이 IP</p>
          <ul className="mt-2 space-y-2">
            {wifiIps.map((wifiIp) => (
              <li
                className="flex items-center gap-2 rounded-lg border border-[#DCE9DF] px-3 py-2 text-[12px] text-[#172033]"
                key={wifiIp.wifiIpId}
              >
                <Wifi className="size-3.5 text-[#4D9560]" />
                <span className="min-w-0 flex-1">{wifiIp.ipAddress}</span>
                <button
                  aria-label={`${wifiIp.ipAddress} 삭제`}
                  className="text-[#94A3B8]"
                  onClick={() => handleDelete(wifiIp.wifiIpId)}
                  type="button"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SettingCard>
  );
}
