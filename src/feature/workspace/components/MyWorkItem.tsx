import { MyWorkspaceTaskData } from "../type";

const statusLabel = {
    WAITING: "대기",
    IN_PROGRESS: "진행중",
    DELAYED: "지연",
};

const statusClass = {
    WAITING: "bg-[#F0F1F3] text-[#3F4856]",
    IN_PROGRESS: "bg-[#EAF2FC] text-[#72A4D8]",
    DELAYED: "bg-[#FDEDEF] text-[#D56073]",
};

export default function MyWorkItem({ task }: { task: MyWorkspaceTaskData }) {
    return (
        <div className="grid h-11 grid-cols-7 items-center border-b border-[#EEF0F3] px-2 text-[10px] leading-[18px] last:border-b-0 sm:px-3 md:h-[46px] md:px-4 md:text-[11px] lg:h-[47px] lg:px-5 lg:text-[12px]">
            <p className="col-span-3 truncate pr-2 md:pr-3 lg:pr-4">
                <strong className="text-[10px] leading-[19.5px] font-medium md:text-[12px] lg:text-[13px]">
                    {task.title}
                </strong>
            </p>
            <span className="col-span-2 truncate pr-2 text-[10px] leading-[16.5px] text-[#A7B0BD] lg:text-[11px]">
                {task.workspaceName}
            </span>
            <span className="col-span-1 text-[#98A2B1]">{task.dueAt}</span>
            <div className="col-span-1">
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-[16.5px] font-medium lg:px-2 lg:text-[11px] ${statusClass[task.status]}`}>
                    {statusLabel[task.status]}
                </span>
            </div>
        </div>
    );
}
