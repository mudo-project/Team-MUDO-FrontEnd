'use client'

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import TaskSidebar from "./TaskSidebar";
import ChatCreateModal from "./ChatCreateModal";

type TaskView = "received" | "sent";

export default function MessengerSidebar() {
    const [tab, setTab] = useState<"chat" | "task">("chat");
    const [taskView, setTaskView] = useState<TaskView>("received");
    const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleChatTabClick = () => {
        setTab("chat");
        setIsTaskMenuOpen(false);
    };

    const handleTaskTabClick = () => {
        if (tab !== "task") {
            setTab("task");
            setIsTaskMenuOpen(true);
            return;
        }
        setIsTaskMenuOpen((open) => !open);
    };

    const handleSelectTaskView = (view: TaskView) => {
        setTaskView(view);
        setIsTaskMenuOpen(false);
    };

    return (
        <section
            className="flex min-h-0 w-[282px] shrink-0 flex-col border-r border-[#D7E8DB] bg-white"
            aria-label="대화 목록"
        >
            <div className="flex h-[51px] shrink-0 border-b border-[#D7E8DB]">
                <button
                    className={`flex-1 text-[13px] ${tab === "chat" ? "border-b-2 border-[#2C8D50] font-semibold text-[#0F172A]" : "text-[#64748B]"}`}
                    onClick={handleChatTabClick}
                    type="button"
                >
                    채팅
                </button>

                <div className="relative flex-1">
                    <button
                        className={`h-full w-full text-[13px] ${tab === "task" ? "border-b-2 border-[#2C8D50] font-semibold text-[#0F172A]" : "text-[#64748B]"}`}
                        onClick={handleTaskTabClick}
                        type="button"
                    >
                        업무
                    </button>

                    {isTaskMenuOpen && (
                        <div className="absolute top-[calc(100%+6px)] left-1/2 z-20 flex w-[260px] -translate-x-1/2 overflow-hidden rounded-[10px] border border-[#D7E8DB] bg-white shadow-[0_12px_24px_rgba(22,34,54,0.18)]">
                            <button
                                className="flex-1 px-3 py-3 text-center text-[13px] font-medium whitespace-nowrap text-[#0F172A] hover:bg-[#EEF3F0] hover:text-[#2C8D50]"
                                onClick={() => handleSelectTaskView("received")}
                                type="button"
                            >
                                받은 업무
                            </button>
                            <button
                                className="flex-1 border-l border-[#EDF1EE] px-3 py-3 text-center text-[13px] font-medium whitespace-nowrap text-[#0F172A] hover:bg-[#EEF3F0] hover:text-[#2C8D50]"
                                onClick={() => handleSelectTaskView("sent")}
                                type="button"
                            >
                                전달한 업무
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className="flex w-11 items-center justify-center text-[#64748B]"
                    onClick={() => setIsCreateOpen(true)}
                    type="button"
                    aria-label="새 채팅 만들기"
                >
                    <MessageSquarePlus className="size-4" strokeWidth={1.7} />
                </button>
            </div>

            {tab === "chat" ? <ChatSidebar /> : <TaskSidebar view={taskView} />}

            {isCreateOpen && <ChatCreateModal onClose={() => setIsCreateOpen(false)} />}
        </section>
    );
}
