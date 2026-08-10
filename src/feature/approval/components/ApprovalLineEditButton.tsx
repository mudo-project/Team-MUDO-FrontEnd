import useModal from "@/components/hooks/useModal";
import EditApprovalModal from "./modal/EditApprovalModal";
import { ApprovalDetailData } from "../type";

export default function ApprovalLineEditButton({ id, approval }: { id: number, approval: ApprovalDetailData }) {
    const modal = useModal();
    return (
        <>
            <button
                className="h-[41px] rounded-[8px] border border-[#D7E8DB] bg-white px-4 text-[13px] font-normal leading-[19.5px] text-[#0F172A]"
                type="button"
                onClick={modal.openModal}
            >
                결재라인 수정
            </button>
            {modal.isModal &&
                <EditApprovalModal
                    closeModal={modal.closeModal}
                    documentId={id}
                    approval={approval}
                />
            }
        </>
    )
}
