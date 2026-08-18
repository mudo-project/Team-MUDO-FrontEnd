import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayrollEmailBatchResultAction } from "@/feature/payroll/actions";
import PayrollEmailBatchResultView from "@/feature/payroll/components/PayrollEmailBatchResultView";
import DesktopOnlyGuard from "@/components/ui/DesktopOnlyGuard";

interface FinancePayrollEmailBatchPageProps {
    params: Promise<{ batchId: string }>;
}

export default async function FinancePayrollEmailBatchPage({ params }: FinancePayrollEmailBatchPageProps) {
    const { batchId: batchIdParam } = await params;
    const batchId = Number(batchIdParam);

    if (!Number.isFinite(batchId)) {
        notFound();
    }

    let result: PayrollEmailBatchResultDetailData | null = null;

    try {
        result = await getPayrollEmailBatchResultAction(batchId, { page: 0, size: 20 });
    } catch {
        result = null;
    }

    return (
        <div className="mt-4 pb-8">
            <Link className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B]" href="/finance/payroll">
                <ArrowLeft className="size-3.5" />
                급여명세서로 돌아가기
            </Link>

            <div className="mt-5">
                <DesktopOnlyGuard>
                    {result ? (
                        <PayrollEmailBatchResultView batchId={batchId} initialResult={result} />
                    ) : (
                        <div className="mt-10 flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B]">
                            일괄 발송 결과를 불러오지 못했습니다.
                        </div>
                    )}
                </DesktopOnlyGuard>
            </div>
        </div>
    );
}
