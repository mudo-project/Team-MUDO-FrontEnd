import { X } from "lucide-react";
import { PAYROLL_EMAIL_STATUS_BADGE_CLASS, PAYROLL_EMAIL_STATUS_LABEL } from "../statusStyles";

interface PayrollEmailDeliveryResultPanelProps {
    employeeName: string;
    onClose: () => void;
    result: PayrollEmailDeliveryCreateData;
}

export default function PayrollEmailDeliveryResultPanel({ employeeName, onClose, result }: PayrollEmailDeliveryResultPanelProps) {
    const status = result.status as PayrollEmailDeliveryStatus;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/35" onClick={onClose}>
            <section className="w-[380px] rounded-xl bg-white p-6 shadow-[0_8px_16px_rgba(22,34,54,0.16)]" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[15px] font-bold text-[#172033]">이메일 발송 결과</h1>
                        <p className="mt-1 text-[12px] text-[#94A3B8]">{employeeName}님에게 발송한 명세서입니다.</p>
                    </div>
                    <button aria-label="닫기" onClick={onClose} type="button">
                        <X className="size-[18px] text-[#718096]" />
                    </button>
                </div>

                <dl className="mt-4 divide-y divide-[#F1F3F6] rounded-lg border border-[#E1EBE3]">
                    <div className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                        <dt className="text-[#7C8AA0]">상태</dt>
                        <dd>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${PAYROLL_EMAIL_STATUS_BADGE_CLASS[status]}`}>
                                {PAYROLL_EMAIL_STATUS_LABEL[status]}
                            </span>
                        </dd>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                        <dt className="text-[#7C8AA0]">요청 시각</dt>
                        <dd className="font-semibold text-[#172033]">{result.requestedAt}</dd>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                        <dt className="text-[#7C8AA0]">발송 이력</dt>
                        <dd className="font-semibold text-[#172033]">{result.reused ? "기존 이력 재사용" : "신규 발송"}</dd>
                    </div>
                </dl>

                <p className="mt-3 text-[11px] text-[#94A3B8]">
                    발송 성공은 메일 발송 작업이 등록됐다는 의미이며, 이후 상태는 Mailgun 처리 결과에 따라 바뀝니다.
                </p>
            </section>
        </div>
    );
}
