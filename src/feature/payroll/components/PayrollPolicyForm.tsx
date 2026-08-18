'use client'

import { useState } from "react";
import { toast } from "sonner";
import useModal from "@/components/hooks/useModal";
import TwoButtonModal from "@/components/ui/TwoButtonModal";
import { updatePayrollPolicyAction } from "../actions";

interface PayrollPolicyFormProps {
    policy: PayrollPolicyGetData;
}

export default function PayrollPolicyForm({ policy }: PayrollPolicyFormProps) {
    const [payDayType, setPayDayType] = useState<PayrollPayDayType>(policy.payDayType);
    const [payDay, setPayDay] = useState(policy.payDay ?? 5);
    const [paymentMonthOffset, setPaymentMonthOffset] = useState(String(policy.paymentMonthOffset));
    const [isSaving, setIsSaving] = useState(false);
    const saveModal = useModal();

    const handleChangePaymentMonthOffset = (rawValue: string) => {
        // 앞자리 0이 남아 "01"처럼 표시되는 것을 막기 위해 숫자 뒤에 오는 선행 0을 제거한다.
        setPaymentMonthOffset(rawValue.replace(/^0+(?=\d)/, ""));
    };

    const handleSave = async () => {
        if (isSaving) return;

        setIsSaving(true);
        const result = await updatePayrollPolicyAction({
            payDayType,
            payDay: payDayType === "FIXED_DAY" ? payDay : null,
            paymentMonthOffset: Number(paymentMonthOffset) || 0,
        });
        setIsSaving(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message);
        saveModal.closeModal();
    };

    return (
        <section aria-label="급여 정책 설정" className="rounded-xl border border-[#DCE9DF] bg-white p-6">
            <h2 className="text-[15px] font-bold text-[#172033]">급여 정책</h2>
            <p className="mt-1 text-[12px] text-[#94A3B8]">지급 예정일 계산 기준입니다. 수정해도 기존 급여의 지급 예정일은 바뀌지 않습니다.</p>

            <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                    <span className="mb-2 block text-[12px] font-semibold text-[#394257]">지급일 유형</span>
                    <div className="flex gap-2">
                        {([
                            ["FIXED_DAY", "매월 고정일"],
                            ["MONTH_END", "매월 말일"],
                        ] as [PayrollPayDayType, string][]).map(([value, label]) => (
                            <button
                                className={`h-10 flex-1 rounded-lg border text-[13px] font-semibold ${payDayType === value
                                    ? "border-[#172033] bg-[#172033] text-white"
                                    : "border-[#DCE9DF] bg-white text-[#64748B]"
                                }`}
                                key={value}
                                onClick={() => setPayDayType(value)}
                                type="button"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-[12px] font-semibold text-[#394257]" htmlFor="payDay">지급일</label>
                    <input
                        className="h-10 w-full rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] outline-none disabled:bg-[#F1F3F6] disabled:text-[#94A3B8]"
                        disabled={payDayType === "MONTH_END"}
                        id="payDay"
                        max={31}
                        min={1}
                        onChange={(event) => setPayDay(Number(event.target.value))}
                        type="number"
                        value={payDayType === "MONTH_END" ? "" : payDay}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-[12px] font-semibold text-[#394257]" htmlFor="paymentMonthOffset">지급월 오프셋</label>
                    <input
                        className="h-10 w-full rounded-lg border border-[#DCE9DF] bg-white px-3 text-[13px] outline-none"
                        id="paymentMonthOffset"
                        max={12}
                        min={0}
                        onChange={(event) => handleChangePaymentMonthOffset(event.target.value)}
                        type="number"
                        value={paymentMonthOffset}
                    />
                    <p className="mt-1.5 text-[11px] text-[#94A3B8]">귀속월 대비 지급월 차이(0이면 당월, 1이면 익월)</p>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    className="h-10 rounded-lg bg-[#172033] px-5 text-[13px] font-semibold text-white"
                    onClick={saveModal.openModal}
                    type="button"
                >
                    저장
                </button>
            </div>

            {saveModal.isModal && (
                <TwoButtonModal
                    activeModal={handleSave}
                    closeModal={saveModal.closeModal}
                    confirmLabel="저장"
                    content="변경한 급여 정책은 이후 생성하는 급여의 지급 예정일 계산부터 적용됩니다."
                    isPending={isSaving}
                    title="급여 정책을 저장하시겠습니까?"
                />
            )}
        </section>
    );
}
