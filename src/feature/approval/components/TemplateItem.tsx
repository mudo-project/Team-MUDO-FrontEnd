import { format } from "date-fns";
import { ApprovalTemplateListData } from "../type";
import TemplateDetailButton from "./TemplateDetailButton";



export default function TemplateItem({ content }: { content: ApprovalTemplateListData }) {
    return (
        <TemplateDetailButton id={content.id}>
            <p className="col-span-4 text-[10px] font-medium leading-[19.5px] text-[#0F172A] md:text-[12px] lg:col-span-6 lg:text-[13px]">
                {content.name}
            </p>
            <p className="col-span-1 text-[10px] font-normal leading-[18px] text-[#64748B] md:text-[11px] lg:text-[12px]">
                {content.id}
            </p>
            <div className="col-span-3 flex items-center gap-0.5 md:gap-1">
                {content.lines.map((approver, i) => (
                    <div className="flex items-center gap-0.5 md:gap-1" key={approver.approverId}>
                        <span className="rounded-[20px] bg-[#FCFCFC] px-1 py-0.5 text-[10px] font-normal leading-[16.5px] text-[#0F172A] md:px-1.5 lg:px-2 lg:text-[11px]">
                            {approver.approverName}
                        </span>
                        {i !== (content.lines.length - 1) && <span className="text-[10px] font-normal leading-[15px] text-[#D0D5DC]">
                            →
                        </span>}
                    </div>
                ))}
            </div>

            <p className="col-span-1 text-[10px] font-normal leading-[18px] text-[#B0B8C1] md:text-[11px] lg:text-[12px]">
                {format(content.createdAt, 'yyyy.MM.dd')}
            </p>
        </TemplateDetailButton>
    )
}
