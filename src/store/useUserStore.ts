import { MyTokenPayload } from '@/lib/decode';
import { create } from 'zustand';

type UserStore = {
    user: MyTokenPayload;
    permissions: string[];
    setUser: (user: MyTokenPayload) => void;
    clearUser: () => void;
    setPermissions: (permissions: string[]) => void;
    clearPermissions: () => void;
};

const initUser: MyTokenPayload = {
    sub: '',
    username: '',
    roleId: 0,
    accountType: 'MEMBER',
    adminScope: 'null',
    role: undefined,
    mustChangePw: true,
    iat: 0,
    exp: 0
}

export const useUserStore = create<UserStore>((set) => ({
    user: initUser,
    permissions: [],
    setUser: (newUser) => set({ user: newUser }),
    clearUser: () => set({ user: initUser }),
    setPermissions: (newPermissions) => set({ permissions: newPermissions }),
    clearPermissions: () => set({ permissions: [] })
}))

