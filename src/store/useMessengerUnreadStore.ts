import { create } from 'zustand';

type MessengerUnreadStore = {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
};

export const useMessengerUnreadStore = create<MessengerUnreadStore>((set) => ({
    unreadCount: 0,
    setUnreadCount: (count) => set({ unreadCount: count }),
}));
