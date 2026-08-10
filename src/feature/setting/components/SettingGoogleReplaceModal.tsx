"use client";

import { useState } from "react";
import { Check, FileText, Folder, Loader2, Table2, TriangleAlert, X } from "lucide-react";

type ReplaceStep = 1 | 2 | 3;

const STEPS: { step: ReplaceStep; label: string }[] = [
  { step: 1, label: "동의" },
  { step: 2, label: "인증" },
  { step: 3, label: "완료" },
];

const PERMISSIONS = [
  { icon: Folder, title: "드라이브 파일 관리", description: "템플릿 폴더에 파일을 생성·수정합니다" },
  { icon: FileText, title: "구글 문서 접근", description: "문서 템플릿을 생성하고 편집합니다" },
  { icon: Table2, title: "구글 스프레드시트 접근", description: "시트 템플릿을 생성하고 편집합니다" },
];

export default function SettingGoogleReplaceModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [step, setStep] = useState<ReplaceStep>(1);

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-[#162236]/30"
      onClick={onClose}
    >
      <section
        className="w-[440px] rounded-xl bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold tracking-[-0.02em] text-[#172033]">구글 계정 교체</h2>
          <button
            aria-label="구글 계정 교체 모달 닫기"
            className="text-[#94A3B8]"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex items-start justify-center">
          {STEPS.map(({ step: s, label }, index) => (
            <div className="flex items-center" key={s}>
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-[12px] font-semibold ${
                    s < step
                      ? "bg-[#4D9560] text-white"
                      : s === step
                        ? "bg-[#0F172A] text-white"
                        : "bg-[#E2E8F0] text-[#94A3B8]"
                  }`}
                >
                  {s < step ? <Check className="size-3.5" /> : s}
                </span>
                <span className={`text-[11px] font-medium ${s === step ? "text-[#172033]" : "text-[#94A3B8]"}`}>
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span className={`mx-2 mb-4 h-px w-10 ${s < step ? "bg-[#4D9560]" : "bg-[#E2E8F0]"}`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="mt-6">
            <div className="flex items-start gap-2 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[13px] text-[#92400E]">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <p>
                교체하면 기존 계정(<strong className="font-semibold">{email}</strong>)의 인증 정보는 폐기됩니다.
                기존 드라이브에 저장된 템플릿은 새 계정에서 접근할 수 없습니다.
              </p>
            </div>

            <p className="mt-5 text-[13px] font-medium text-[#475569]">다음 권한을 요청합니다.</p>

            <ul className="mt-2 divide-y divide-[#E5EAF0] overflow-hidden rounded-lg border border-[#E5EAF0]">
              {PERMISSIONS.map((permission) => (
                <li className="flex items-center gap-3 px-4 py-3" key={permission.title}>
                  <permission.icon className="size-4 shrink-0 text-[#64748B]" />
                  <div>
                    <p className="text-[13px] font-medium text-[#172033]">{permission.title}</p>
                    <p className="text-[12px] text-[#94A3B8]">{permission.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-2">
              <button
                className="h-11 flex-1 rounded-lg border border-[#DCE9DF] bg-white text-[13px] font-medium text-[#475569]"
                onClick={onClose}
                type="button"
              >
                취소
              </button>
              <button
                className="h-11 flex-1 rounded-lg bg-[#0F172A] text-[13px] font-semibold text-white"
                onClick={() => setStep(2)}
                type="button"
              >
                동의하고 계속하기
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 flex flex-col items-center py-6 text-center">
            <Loader2 className="size-8 animate-spin text-[#4D9560]" />
            <p className="mt-4 text-[14px] font-medium text-[#172033]">구글 로그인 창에서 계속 진행해주세요</p>
            <button
              className="mt-2 text-[13px] font-medium text-[#4D9560]"
              onClick={() => setStep(3)}
              type="button"
            >
              창이 열리지 않았나요? 다시 열기
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 flex flex-col items-center py-4 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#EDF5EE] text-[#4D9560]">
              <Check className="size-5" />
            </span>
            <p className="mt-4 text-[14px] text-[#172033]">
              <strong className="font-semibold">{email}</strong> 계정이 연결되었습니다
            </p>
            <button
              className="mt-6 h-11 w-full rounded-lg bg-[#0F172A] text-[13px] font-semibold text-white"
              onClick={onClose}
              type="button"
            >
              확인
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
