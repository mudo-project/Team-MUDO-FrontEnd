"use client";

import MessengerSidebar from "./MessengerSidebar";
import { useMessengerMobileNav } from "./MessengerMobileNavContext";

export default function MessengerShell({ children }: { children: React.ReactNode }) {
    const { isSidebarOpen, closeSidebar } = useMessengerMobileNav();

    return (
        <>
            <div
                aria-hidden="true"
                className={`absolute inset-0 z-30 bg-[#162236]/35 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}
                onClick={closeSidebar}
            />
            <div
                className={`
                    absolute inset-y-0 left-0 z-40 w-[85%] max-w-[320px]
                    lg:static lg:z-auto lg:w-[282px] lg:max-w-none
                    ${isSidebarOpen ? "flex" : "hidden"} lg:flex
                `}
            >
                <MessengerSidebar />
            </div>
            <div className="flex min-h-0 min-w-0 flex-1">{children}</div>
        </>
    );
}
