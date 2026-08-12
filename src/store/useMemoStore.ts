import { create } from 'zustand';

type MemoStore = {
    isOpen: boolean;
    toggleMemo: () => void;
};

export const useMemoStore = create<MemoStore>((set) => ({
    isOpen: false,
    toggleMemo: () => set((state) => ({ isOpen: !state.isOpen })),
}))
