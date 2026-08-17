"use client";

import { createContext, useContext, useState } from "react";

type MessengerMobileNavContextValue = {
    isSidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
};

const MessengerMobileNavContext = createContext<MessengerMobileNavContextValue | null>(null);

export function MessengerMobileNavProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <MessengerMobileNavContext.Provider
            value={{
                isSidebarOpen,
                openSidebar: () => setIsSidebarOpen(true),
                closeSidebar: () => setIsSidebarOpen(false),
            }}
        >
            {children}
        </MessengerMobileNavContext.Provider>
    );
}

export function useMessengerMobileNav() {
    const context = useContext(MessengerMobileNavContext);
    if (!context) throw new Error("useMessengerMobileNav must be used within MessengerMobileNavProvider");
    return context;
}
