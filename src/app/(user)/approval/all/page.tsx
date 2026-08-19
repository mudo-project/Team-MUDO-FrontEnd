import PaginationPrev from "@/components/ui/PaginationPrev";
import { getAllApprovalListAction } from "@/feature/approval/actions";
import ApprovalList from "@/feature/approval/components/ApprovalList";
import ApprovalNavBar from "@/feature/approval/components/ApprovalNavBar";
import NoneApproval from "@/feature/approval/components/NoneApproval";


interface paramsProps {
    searchParams: Promise<{
        page: string;
    }>
}


export default async function Page({ searchParams }: paramsProps) {
    const { page = "0" } = await searchParams;
    const parsedPage = Number(page);
    const currentPage = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : 0;
    const response = await getAllApprovalListAction(currentPage);
    const approvals = response.data?.content ?? [];

    return (
        <main className="min-h-[calc(100dvh-52px)] w-full bg-[#FCFCFC] px-2 py-4 sm:px-2.5 sm:py-5 md:px-4 md:py-6 lg:px-8 lg:py-7">
            <ApprovalNavBar />

            {!response.success && <p className="mt-5 text-[12px] text-red-500">{response.message}</p>}
            {response.success && approvals.length > 0 && <ApprovalList approvals={approvals} />}
            {response.success && approvals.length === 0 && <NoneApproval />}
            <PaginationPrev url="approval/all" page={currentPage} hasNext={response.data?.hasNext} />

        </main>
    );
}
