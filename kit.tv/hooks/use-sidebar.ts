import {create} from "zustand";

interface SidebarStore{
    collapsed: boolean;
    onExapnd: () => void;
    onCollapse: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
    collapsed: false,
    onExapnd: () => set(() => ({collapsed: false})),
    onCollapse: () => set(() => ({collapsed: true})),
}));