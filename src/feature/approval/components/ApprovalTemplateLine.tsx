import { ApprovalTemplateLineData } from "../type";

export default function ApprovalTemplateLine({ line, i, length }: { line: ApprovalTemplateLineData, i: number, length: number }) {
    return (
        <>
            <div className="flex flex-col items-center gap-1">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#0F172A] text-[13px] font-semibold leading-[19.5px] text-white">
                    {line.approverName.split('')[0]}
                </span>
                <span className="text-[11px] font-normal leading-[16.5px] text-[#0F172A] w-[70px] text-center">
                    {line.stepOrder}차 · {line.approverName}
                </span>
            </div>
            {(length !== i + 1) &&
                <span className="h-[37px] w-[30px] px-2 text-[14px] font-normal leading-[21px] text-[#D0D5DC]">
                    →
                </span>
            }

        </>
    )
}