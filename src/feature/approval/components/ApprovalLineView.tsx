import { format } from "date-fns";
import { ApprovalLineData, ApprovalLineStatus } from "../type";
import ApprovalComp from "./ApprovalComp";
import ApprovalIng from "./ApprovalIng";
import ApprovalReject from "./ApprovalReject";
import ApprovalRest from "./ApprovalRest";

const lineStatusLabel: Record<ApprovalLineStatus, string> = {
    WAITING: "대기",
    PENDING: "검토중",
    APPROVED: "승인",
    REJECTED: "반려",
};


export default function ApprovalLineView({ line, i, length }: { line: ApprovalLineData, i: number, length: number }) {
    return (
        <section key={line.lineId} className="flex flex-1 last:flex-none">
            <div className="flex min-w-[72px] shrink-0 flex-col items-center gap-1.5">
                {lineStatusLabel[line.status] === "대기" &&
                    <ApprovalRest />
                }
                {lineStatusLabel[line.status] === "검토중" &&
                    <ApprovalIng />
                }
                {lineStatusLabel[line.status] === "승인" &&
                    <ApprovalComp />
                }
                {lineStatusLabel[line.status] === "반려" &&
                    <ApprovalReject />
                }
                <div className="text-center">
                    <p className="text-[12px] font-medium leading-[18px] text-[#0F172A]">{line.stepOrder}차 · {line.approverName}</p>
                    <p className="pt-px text-[10px] leading-[15px] text-[#64748B]">{lineStatusLabel[line.status]}</p>
                    {line.decidedAt && <p className="pt-px text-[10px] leading-[15px] text-[#C0C8D0]">{format(line.decidedAt, 'yyyy-MM-dd')}</p>}
                </div>
            </div>
            {length !== i + 1 &&
                <div className="mt-[11px] px-10 h-[1.5px] min-w-3 flex-1 bg-[#D0D5DC]" />
            }
        </section>
    )
}