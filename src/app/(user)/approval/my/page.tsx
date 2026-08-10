import { getSubmittedApprovalListAction } from "@/feature/approval/actions";
import ApprovalList from "@/feature/approval/components/ApprovalList";
import ApprovalNavBar from "@/feature/approval/components/ApprovalNavBar";
import NoneApproval from "@/feature/approval/components/NoneApproval";

export default async function Page() {
    const response = await getSubmittedApprovalListAction();
    const approvals = response.data?.content ?? [];

    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-2 py-4 sm:px-2.5 md:px-4 md:py-5 lg:px-8 lg:py-7">
            <ApprovalNavBar />


            {!response.success && <p className="mt-5 text-[12px] text-red-500">{response.message}</p>}
            {response.success && approvals.length > 0 && <ApprovalList approvals={approvals} type='my' />}
            {response.success && approvals.length === 0 && <NoneApproval />}
        </main>
    );
}
