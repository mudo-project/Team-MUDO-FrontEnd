import { format } from "date-fns";
import { X } from "lucide-react";

interface AlarmListItem {
    notificationId: number;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function AlarmList({ alarms }: { alarms: AlarmListItem[] }) {
    if (alarms.length === 0) {
        return (
            <div className="flex h-[200px] items-center justify-center rounded-xl border border-[#DCE9DF] bg-white text-[13px] text-[#64748B] shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                알림이 없습니다
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#DCE9DF] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
            {alarms.map((alarm) => (
                <div
                    className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_68px_20px] items-center gap-3 border-b border-[#E5EEE7] px-6 last:border-b-0"
                    key={alarm.notificationId}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        {alarm.read
                            ? <span className="w-1.5 shrink-0" />
                            : <span aria-label="안읽음" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4D9560]" />
                        }
                        <span
                            className={`min-w-0 truncate text-[13px] ${alarm.read ? "text-[#64748B]" : "font-semibold text-[#172033]"}`}
                        >
                            {alarm.message}
                        </span>
                    </div>
                    <time className="text-right text-[11px] text-[#64748B]">
                        {format(new Date(alarm.createdAt), "MM.dd")}
                    </time>
                    <button
                        aria-label="알림 삭제"
                        className="flex size-[20px] items-center justify-center text-[#C0C8D0] hover:cursor-pointer"
                        type="button"
                    >
                        <X className="size-3.5" strokeWidth={1.6} />
                    </button>
                </div>
            ))}
        </div>
    );
}
