import { Search } from "lucide-react";
import ReceivedTaskList from "./ReceivedTaskList";
import SentTaskList from "./SentTaskList";

export default function TaskSidebar({ view }: { view: "received" | "sent" }) {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[#E7EFE9] p-3">
                <label className="flex h-8 w-full min-w-44 items-center rounded-md border border-[#DCE8DE] bg-white px-3">
                    <Search className="h-3.5 w-3.5 text-[#718096]" strokeWidth={1.8} />
                    <input
                        aria-label="업무 검색"
                        className="min-w-0 flex-1 border-0 bg-transparent pl-2 text-[11px] outline-none placeholder:text-[#94A3B8]"
                        placeholder="업무 검색"
                    />
                </label>
            </div>

            {view === "received" ? <ReceivedTaskList /> : <SentTaskList />}
        </div>
    );
}
