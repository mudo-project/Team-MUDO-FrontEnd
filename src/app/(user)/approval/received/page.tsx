import PaginationPrev from "@/components/ui/PaginationPrev";
import { getReceivedApprovalListAction } from "@/feature/approval/actions";
import ApprovalList from "@/feature/approval/components/ApprovalList";
import ApprovalNavBar from "@/feature/approval/components/ApprovalNavBar";
import NoneApproval from "@/feature/approval/components/NoneApproval";


interface paramsProps {
    searchParams: Promise<{
        page: string;
    }>
}

export default async function Page({ searchParams }: paramsProps) {
    const { page } = await searchParams;

    const response = await getReceivedApprovalListAction();
    const approvals = response.data?.content ?? [];

    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-2 py-4 sm:px-2.5 sm:py-5 md:px-4 md:py-6 lg:px-8 lg:py-7">
            <ApprovalNavBar />

            {!response.success && <p className="mt-5 text-[12px] text-red-500">{response.message}</p>}
            {response.success && approvals.length > 0 && <ApprovalList approvals={approvals} />}
            {response.success && approvals.length === 0 && <NoneApproval />}
            <PaginationPrev url='student' page={page} hasNext={response.data?.hasNext} />

        </main>
    );
}
