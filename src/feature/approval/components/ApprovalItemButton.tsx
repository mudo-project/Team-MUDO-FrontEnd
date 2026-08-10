'use client'

import useModal from "@/components/hooks/useModal"
import MyApprovalModal from "./modal/MyApprovalModal";
import ReceivedApprovalModal from "./modal/ReceivedApprovalModal";
import ReceivedReasonModal from "./modal/ReceivedReasonModal";
import { useState } from "react";

export default function ApprovalItemButton({ id, type = 'other', children }: { id: number, type?: 'my' | 'other', children: React.ReactNode }) {
    const [mode, setMode] = useState<'승인' | '반려'>('승인');

    const reasonModal = useModal();
    const myModal = useModal();
    const otherModal = useModal(active, noneActive);

    function active() {
        setMode('승인');
        reasonModal.openModal();
    }

    function noneActive() {
        setMode('반려');
        reasonModal.openModal();
    }

    return (
        <>
            <button
                onClick={type === 'my' ? myModal.openModal : otherModal.openModal}
                className="w-full text-start grid h-14 grid-cols-8 md:grid-cols-9 items-center border-b border-[#F7F8F9] px-1 sm:px-2 md:h-[62px] md:px-3 lg:h-[67px] lg:grid-cols-11 lg:px-5">
                {children}
            </button>
            {
                myModal.isModal &&
                <MyApprovalModal
                    closeModal={myModal.closeModal}
                    id={id}
                />
            }
            {
                otherModal.isModal &&
                <ReceivedApprovalModal
                    closeModal={otherModal.closeModal}
                    activeModal={otherModal.activeModal}
                    noneActiveModal={otherModal.noneActiveModal}
                    id={id}
                />
            }
            {reasonModal.isModal &&
                <ReceivedReasonModal
                    mode={mode}
                    closeModal={reasonModal.closeModal}
                    id={id}
                />
            }
        </>
    )
}
