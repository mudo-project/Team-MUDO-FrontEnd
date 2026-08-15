import { Progress } from "@/components/ui/progress";
import { PROGRESS_CLASS_NAME } from "../constants";
import { EcsHostHeadroomData } from "../type";

interface HostResourceCardProps {
    host: EcsHostHeadroomData;
}

const getUsedPercent = (registered: number, remaining: number) =>
    registered > 0 ? ((registered - remaining) / registered) * 100 : 0;

export default function HostResourceCard({ host }: HostResourceCardProps) {
    const cpuUsedPercent = getUsedPercent(host.registeredCpu, host.remainingCpu);
    const memoryUsedPercent = getUsedPercent(host.registeredMemoryMib, host.remainingMemoryMib);
    const isWarning = cpuUsedPercent >= 80 || memoryUsedPercent >= 80;
    const resourceProgressClassName = `${PROGRESS_CLASS_NAME} ${isWarning ? "[&_[data-slot=progress-indicator]]:bg-[#D65045]" : ""}`;

    return (
        <article className="rounded-[9px] border border-[#E3ECE6] px-4 py-3">
            <div className="flex items-center">
                <strong className="text-[10px] font-semibold text-[#0F172A] md:text-[12px]">{host.hostId}</strong>
                <span className="ml-1.5 text-[10px] text-[#94A3B8] md:text-[12px]">{host.cluster}</span>
                <div className="ml-auto flex gap-1">
                    {host.academyCodes.map((code) => <span className="rounded-[3px] bg-[#EAF4ED] px-1.5 py-0.5 text-[10px] text-[#2C8D50] md:text-[12px]" key={code}>{code}</span>)}
                </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                    <div className="mb-1 flex text-[10px] text-[#94A3B8] md:text-[12px]"><span>CPU</span><span className="ml-auto">{host.remainingCpu.toLocaleString()} / {host.registeredCpu.toLocaleString()} 남음</span></div>
                    <div className="flex items-center gap-2"><Progress className={`${resourceProgressClassName} w-full`} value={cpuUsedPercent} /><span className={`text-[10px] md:text-[12px] ${isWarning ? "text-[#D65045]" : "text-[#2C8D50]"}`}>{cpuUsedPercent.toFixed(1)}%</span></div>
                </div>
                <div>
                    <div className="mb-1 flex text-[10px] text-[#94A3B8] md:text-[12px]"><span>메모리</span><span className="ml-auto">{host.remainingMemoryMib.toLocaleString()} / {host.registeredMemoryMib.toLocaleString()} MiB 남음</span></div>
                    <div className="flex items-center gap-2"><Progress className={`${resourceProgressClassName} w-full`} value={memoryUsedPercent} /><span className={`text-[10px] md:text-[12px] ${isWarning ? "text-[#D65045]" : "text-[#2C8D50]"}`}>{memoryUsedPercent.toFixed(1)}%</span></div>
                </div>
            </div>
        </article>
    );
}
