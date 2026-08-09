"use client";

import { useState } from "react";
import { Check, Wifi } from "lucide-react";
import SettingCard from "@/feature/setting/components/SettingCard";
import SectionHeading from "@/feature/setting/components/SectionHeading";

// 임시로 사용할 더미데이터입니다. 추후 API 연동을 진행하면서 실제 접속 IP 조회로 대체할 예정입니다.
const DUMMY_CURRENT_IP = "106.101.137.196";

export default function SettingWifi() {
  const [ipInput, setIpInput] = useState("");
  const [checkedIp, setCheckedIp] = useState<string | null>(null);
  const [registeredIps, setRegisteredIps] = useState<string[]>([]);

  const trimmedIpInput = ipInput.trim();
  const isSaved = trimmedIpInput.length > 0 && registeredIps.includes(trimmedIpInput);

  function handleCheckIp() {
    setCheckedIp(DUMMY_CURRENT_IP);
  }

  function handleRegisterCheckedIp() {
    if (!checkedIp) return;
    setIpInput(checkedIp);
  }

  function handleSave() {
    if (!trimmedIpInput || registeredIps.includes(trimmedIpInput)) return;
    setRegisteredIps((prev) => [...prev, trimmedIpInput]);
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
          disabled={!trimmedIpInput || isSaved}
          onClick={handleSave}
          type="button"
        >
          {isSaved ? (
            <>
              <Check className="size-3.5" />
              저장됨
            </>
          ) : (
            "저장"
          )}
        </button>
      </div>
      <div className="mt-3 rounded-lg bg-[#F6F8FA] px-4 py-3 text-[11px] text-[#718096]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2"><Wifi className="size-3.5" />현재 연결된 네트워크의 IP를 자동으로 가져옵니다</p>
          <button
            className="h-8 rounded-md border border-[#DCE9DF] bg-white px-3 text-[11px] font-medium text-[#475569] sm:ml-auto"
            onClick={handleCheckIp}
            type="button"
          >
            내 IP 확인
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

      {registeredIps.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-medium text-[#718096]">등록된 와이파이 IP</p>
          <ul className="mt-2 space-y-2">
            {registeredIps.map((ip) => (
              <li
                className="flex items-center gap-2 rounded-lg border border-[#DCE9DF] px-3 py-2 text-[12px] text-[#172033]"
                key={ip}
              >
                <Wifi className="size-3.5 text-[#4D9560]" />
                {ip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </SettingCard>
  );
}
