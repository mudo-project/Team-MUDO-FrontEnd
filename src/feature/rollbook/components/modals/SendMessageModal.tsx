"use client";

import { X } from "lucide-react";
import { useState } from "react";
import SelectMessageStudent from "@/feature/rollbook/components/SelectMessageStudent";

const recipients = [
    { id: 1, name: "최서준", detail: "고3 · 010-1111-2222" },
    { id: 2, name: "한소희", detail: "고3 · 010-9999-0000" },
];

export default function SendMessageModal({ closeModal }: { closeModal: () => void }) {
    const [selectedRecipientIds, setSelectedRecipientIds] = useState(
        () => new Set(recipients.map((recipient) => recipient.id)),
    );
    const selectedCount = selectedRecipientIds.size;
    const isAllSelected = selectedCount === recipients.length;
    const isPartiallySelected = selectedCount > 0 && !isAllSelected;

    const toggleAllRecipients = (checked: boolean) => {
        setSelectedRecipientIds(checked ? new Set(recipients.map((recipient) => recipient.id)) : new Set<number>());
    };

    const toggleRecipient = (recipientId: number, checked: boolean) => {
        setSelectedRecipientIds((current) => {
            const next = new Set(current);

            if (checked) {
                next.add(recipientId);
            } else {
                next.delete(recipientId);
            }

            return next;
        });
    };

    return (
        <div
            className="fixed inset-0 z-1001 flex items-center justify-center bg-[#0F172A]/60"
            onClick={(event) => {
                event.stopPropagation();
                closeModal();
            }}
        >
            <form
                aria-labelledby="send-message-modal-title"
                className="z-1002 flex max-h-[500px] w-[460px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
            >
                <header className="flex h-[86px] shrink-0 items-center justify-between border-b border-[#DCE8E2] px-7">
                    <div>
                        <h2 id="send-message-modal-title" className="text-[16px] leading-6 font-bold text-[#0F172A]">
                            출결 문자 발송
                        </h2>
                        <p className="mt-[3px] text-[12px] leading-[18px] text-[#64748B]">
                            고3 수학 특강 · 2026-08-15
                        </p>
                    </div>
                    <button aria-label="닫기" className="text-[#94A3B8]" onClick={closeModal} type="button">
                        <X aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
                    </button>
                </header>

                <label className="flex h-[41px] shrink-0 cursor-pointer items-center gap-2.5 border-b border-[#DCE8E2] px-7" htmlFor="select-all-recipients">
                    <SelectMessageStudent
                        checked={isAllSelected}
                        id="select-all-recipients"
                        indeterminate={isPartiallySelected}
                        onChange={toggleAllRecipients}
                    />
                    <span className="flex-1 text-[13px] leading-[19.5px] font-medium text-[#0F172A]">전체 선택</span>
                    <span className="text-[12px] leading-[18px] text-[#94A3B8]">{selectedCount}/{recipients.length}명</span>
                </label>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {recipients.map((recipient) => (
                        <label
                            className="flex h-[63px] cursor-pointer items-center gap-3 border-b border-[#F7F8F9] px-7"
                            htmlFor={`recipient-${recipient.id}`}
                            key={recipient.id}
                        >
                            <SelectMessageStudent
                                checked={selectedRecipientIds.has(recipient.id)}
                                id={`recipient-${recipient.id}`}
                                onChange={(checked) => toggleRecipient(recipient.id, checked)}
                            />
                            <div>
                                <p className="text-[13px] leading-[19.5px] font-medium text-[#0F172A]">{recipient.name}</p>
                                <p className="mt-px text-[11px] leading-[16.5px] text-[#94A3B8]">{recipient.detail}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <footer className="flex h-[73px] shrink-0 items-center justify-end gap-2 border-t border-[#DCE8E2] px-7">
                    <button className="h-10 rounded-lg border border-[#DCE8E2] bg-white px-4 text-[13px] text-[#64748B]" onClick={closeModal} type="button">
                        취소
                    </button>
                    <button className="h-10 rounded-lg bg-[#2A3A4A] px-5 text-[13px] font-medium text-white" type="button">
                        {selectedCount}명에게 전송
                    </button>
                </footer>
            </form>
        </div>
    );
}
